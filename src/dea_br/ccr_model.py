import numpy as np
from scipy.optimize import linprog
from typing import Dict, Tuple, Any

def solve_ccr(X: np.ndarray, Y: np.ndarray, k: int, epsilon: float = 1e-6) -> Tuple[float, Dict[str, np.ndarray]]:
    """
    Solve the input-oriented CCR model (Model 2) for DMU k.
    
    Args:
        X: Input matrix (n_dmus x m_inputs)
        Y: Output matrix (n_dmus x s_outputs)
        k: Index of the DMU to evaluate
        epsilon: Non-Archimedean constant (lower bound for weights)
        
    Returns:
        theta_kk: Self-efficiency score (0 to 1)
        weights: Dictionary containing 'u' (output weights) and 'v' (input weights)
    
    Raises:
        ValueError: If optimization fails
    """
    n_dmus, n_inputs = X.shape
    _, n_outputs = Y.shape
    
    # Decision variables: [v_1, ..., v_m, u_1, ..., u_s]
    # Total variables = m + s
    
    # Objective: Maximize sum(u_r * y_rk) -> Minimize -sum(u_r * y_rk)
    # Coeffs for v are 0, coeffs for u are -y_rk
    c = np.concatenate([np.zeros(n_inputs), -Y[k]])
    
    # Equality Constraint: sum(v_i * x_ik) = 1
    # [x_k1, ..., x_km, 0, ..., 0] * [v, u]^T = 1
    A_eq = np.zeros((1, n_inputs + n_outputs))
    A_eq[0, :n_inputs] = X[k]
    b_eq = [1.0]
    
    # Inequality Constraints: sum(u * Y_j) - sum(v * X_j) <= 0 for all j
    # Rearranged: -sum(v * X_j) + sum(u * Y_j) <= 0
    # Shape: (n_dmus, m+s)
    A_ub = np.zeros((n_dmus, n_inputs + n_outputs))
    A_ub[:, :n_inputs] = -X
    A_ub[:, n_inputs:] = Y
    b_ub = np.zeros(n_dmus)
    
    # Bounds: w >= epsilon
    bounds = [(epsilon, None)] * (n_inputs + n_outputs)
    
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, bounds=bounds, method='highs')
    
    if res.success:
        theta_kk = -res.fun
        
        # Handle potential floating point errors slightly above 1.0
        if theta_kk > 1.0 and theta_kk < 1.00001:
            theta_kk = 1.0
            
        v = res.x[:n_inputs]
        u = res.x[n_inputs:]
        return theta_kk, {'u': u, 'v': v}
    else:
        # Fallback or error
        raise ValueError(f"CCR Optimization failed for DMU {k}: {res.message}")

import numpy as np
from scipy.optimize import minimize, LinearConstraint
from typing import Tuple, Dict, Optional
from .prospect_theory import DEFAULT_ALPHA, DEFAULT_BETA, DEFAULT_LAMBDA

def solve_bounded_rationality_model(
    X: np.ndarray, 
    Y: np.ndarray, 
    k: int,            # Evaluator DMU (whose weights we are determining)
    j: int,            # Peer DMU (who is being evaluated)
    theta_limit: float, # The objective (Organizational or Personal)
    theta_kk_star: float, # Self-efficiency of k
    mode: str,         # 'gain' or 'loss'
    alpha: float = DEFAULT_ALPHA,
    beta: float = DEFAULT_BETA,
    lambda_: float = DEFAULT_LAMBDA,
    epsilon: float = 1e-6
) -> Optional[float]:
    """
    Solves the non-linear optimization models (6, 7, 8, 9) for Cross-Efficiency.
    
    Returns:
        theta_jk: The cross-efficiency score of DMU j using K's optimized weights.
    """
    n_dmus, m = X.shape
    _, s = Y.shape
    
    # Initial guess: Use optimal weights from CCR for k, and 0 for deltas
    # We need to re-solve CCR or pass weights in. For simplicity, we restart from a feasible point if possible
    # or just 1/m, 1/s.
    x0 = np.concatenate([
        np.ones(m) / m, 
        np.ones(s) / s, 
        [0.0, 0.0]
    ])
    
    # --- Objective Functions ---
    if mode == 'gain':
        # Model 6/8: Min S = (dy)^alpha + (dx)^alpha
        # x[-1] is dy, x[-2] is dx
        fun = lambda x: (x[-1]**alpha) + (x[-2]**alpha)
        
        # Original: Min Gain. 
        # Note: Minimizing a concave function (x^0.88) can strictly happen at boundaries.
    else:
        # Model 7/9: Max S = -lambda(-(-dy))^beta ...
        # Simplified: Max S = -lambda(dy)^beta - lambda(dx)^beta
        # Equivalent to Min -S = lambda(dy)^beta + lambda(dx)^beta
        fun = lambda x: lambda_ * (x[-1]**beta) + lambda_ * (x[-2]**beta)

    # --- Constraints ---
    constraints = []
    
    # 1. Self-efficiency constraint for k:
    # sum(u * y_k) - theta_kk * sum(v * x_k) = 0
    # Coefficients for v: -theta_kk * x_k
    # Coefficients for u: y_k
    # Coefficients for dx, dy: 0
    con1_v = -theta_kk_star * X[k]
    con1_u = Y[k]
    con1_deltas = [0.0, 0.0]
    con1_coeffs = np.concatenate([con1_v, con1_u, con1_deltas])
    constraints.append(LinearConstraint(con1_coeffs, 0, 0))
    
    # 2. Peer Evaluation Constraint (The Definition 4/5 constraint)
    # Gain (Theta_target < Theta_jj_star, e.g. target is easier/lower):
    # (u*y_j - dy) / (v*x_j + dx) = Theta_target
    # u*y_j - dy = Theta_target * v*x_j + Theta_target * dx
    # u*y_j - Theta_target*v*x_j - dy - Theta_target*dx = 0
    
    # Loss (Theta_target > Theta_jj_star, e.g. target is harder):
    # (u*y_j + dy) / (v*x_j - dx) = Theta_target
    # u*y_j + dy = Theta_target * v*x_j - Theta_target * dx
    # u*y_j - Theta_target*v*x_j + dy + Theta_target*dx = 0
    
    con2_v = -theta_limit * X[j]
    con2_u = Y[j]
    
    if mode == 'gain':
        con2_dx = -theta_limit
        con2_dy = -1.0
    else:
        con2_dx = theta_limit
        con2_dy = 1.0
        
    con2_coeffs = np.concatenate([con2_v, con2_u, [con2_dx, con2_dy]])
    constraints.append(LinearConstraint(con2_coeffs, 0, 0))
    
    # 3. Standard DEA constraints for all other DMUs t != k
    # sum(u y_t) - sum(v x_t) <= 0
    # or sum(u y_t) - sum(v x_t) = s_t <= 0
    # Implemented as LinearConstraint lb=-inf, ub=0
    
    # Matrix form for all DMUs (including k and j for completeness/safety)
    # -X v + Y u <= 0
    # Cols: v(m), u(s), dx, dy
    A_dea = np.zeros((n_dmus, m + s + 2))
    A_dea[:, :m] = -X
    A_dea[:, m:m+s] = Y
    # dx, dy coeffs are 0
    
    # Remove row k? Normally standard DEA cross-eff requires weights to be feasible for ALL DMUs.
    # Yes, constraint (143) says t=1..n, t!=k. 
    # But for t=k, we have the equality constraint (con1). So feasible <=0 is implied by =0.
    # We can keep it or filter it. Keeping it is fine.
    
    constraints.append(LinearConstraint(A_dea, -np.inf, 0))
    
    # --- Bounds ---
    # v, u >= epsilon
    # dx, dy >= 0
    bounds = []
    for _ in range(m + s):
        bounds.append((epsilon, None))
    bounds.append((0, None)) # dx
    bounds.append((0, None)) # dy
    
    # --- Solve ---
    res = minimize(
        fun, 
        x0, 
        method='SLSQP', 
        bounds=bounds,
        constraints=constraints,
        options={'ftol': 1e-9, 'disp': False}
    )
    
    if not res.success:
        # If optimization fails, fallback to standard cross-efficiency
        # Just calculate using the current weights if feasible, or return 0?
        # A robust fallback is essential.
        # Fallback: Solve standard CCR for k again (just to get weights) then apply to j
        return None 
        
    # Calculate resultant Prospect Value
    # Gain: S = (dy)^alpha + (dx)^alpha
    # Loss: S = -lambda(dy)^beta - lambda(dx)^beta
    dx = res.x[-2]
    dy = res.x[-1]
    
    # Extract weights
    v = res.x[:m]
    u = res.x[m:m+s]
    
    # Calculate Cross-Efficiency Score theta_jk = (u * Y_j) / (v * X_j)
    # Note: denominator v*X_j might not be 1 (it is 1 for X_k, not X_j)
    numer = np.dot(u, Y[j])
    denom = np.dot(v, X[j])
    
    if denom == 0:
        return 0.0
        
    theta_jk = numer / denom
    return theta_jk


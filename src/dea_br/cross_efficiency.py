import numpy as np
from typing import Dict, Tuple, Union
from .ccr_model import solve_ccr
from .bounded_rationality_models import solve_bounded_rationality_model
from .prospect_theory import DEFAULT_ALPHA, DEFAULT_BETA, DEFAULT_LAMBDA

def calculate_cross_efficiency_matrix(
    X: np.ndarray, 
    Y: np.ndarray, 
    theta_limits: Union[float, Dict[int, float]] = 1.0,
    alpha: float = DEFAULT_ALPHA,
    beta: float = DEFAULT_BETA,
    lambda_: float = DEFAULT_LAMBDA
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Calculates the bounded rationality cross-efficiency matrix.
    
    Args:
        X: Inputs (N x M)
        Y: Outputs (N x S)
        theta_limits: The target efficiency/objective to check against.
                      Can be a float (Organizational/Global Objective)
                      or a dict {dmu_id: target} (Personal Objective or Composite).
        alpha, beta, lambda_: Prospect Theory parameters.
        
    Returns:
        matrix: N x N cross-efficiency matrix. (Row J = DMU J's scores as evaluated by Cols K).
                matrix[j, k] is the score of J using K's weights.
        self_efficiencies: Array of size N (Diagonal of matrix).
    """
    n_dmus = X.shape[0]
    
    # Step 1: Self-Efficiencies (CCR)
    self_effs = np.zeros(n_dmus)
    
    # Store initial weights to use as fallback or start points?
    # For now, just getting the scores.
    for k in range(n_dmus):
        theta, _ = solve_ccr(X, Y, k)
        self_effs[k] = theta
        
    # Step 2: Cross-Efficiency Matrix
    matrix = np.zeros((n_dmus, n_dmus))
    
    for k in range(n_dmus): # Evaluator K
        theta_kk = self_effs[k]
        
        # Diagonal is always self-efficiency
        matrix[k, k] = theta_kk
        
        for j in range(n_dmus): # Peer J
            if j == k:
                continue
            
            # 1. Determine Target for this pair
            if isinstance(theta_limits, dict):
                # Personal/Composite Objective for J
                # Use .get(j) because we are evaluating J against J's objective
                target = theta_limits.get(j, 1.0)
            else:
                # Global Organizational Objective
                target = float(theta_limits)
            
            # 2. Determine Mode (Gain vs Loss)
            # Compare J's potential/self-efficiency vs Target
            theta_jj = self_effs[j]
            
            if target > theta_jj:
                mode = 'loss' # Target is higher than self-ability (Deficiency)
            else:
                mode = 'gain' # Target is lower (Surplus)
                
            # 3. Solve Optimization
            score = solve_bounded_rationality_model(
                X, Y, k, j,
                theta_limit=target,
                theta_kk_star=theta_kk,
                mode=mode,
                alpha=alpha,
                beta=beta,
                lambda_=lambda_
            )
            
            if score is not None:
                matrix[j, k] = score
            else:
                # Fallback: Just calculate using generic CCR weights from K?
                # Ideally we re-solve solve_ccr(k) to get weights then apply.
                # For performance, maybe cache weights from step 1. 
                # Doing a quick re-solve for now is safe.
                theta_k_fallback, weights_k = solve_ccr(X, Y, k)
                
                # Theta_jk = u*y_j / v*x_j
                val = np.dot(weights_k['u'], Y[j]) / np.dot(weights_k['v'], X[j])
                matrix[j, k] = val
                
    return matrix, self_effs

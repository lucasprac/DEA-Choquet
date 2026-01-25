import numpy as np

# Empirical parameters from Tversky & Kahneman (1992), used in Shi et al. (2024)
DEFAULT_ALPHA = 0.88
DEFAULT_BETA = 0.88
DEFAULT_LAMBDA = 2.25

def prospect_value_function(delta_z: float, alpha: float = DEFAULT_ALPHA, 
                          beta: float = DEFAULT_BETA, lambda_: float = DEFAULT_LAMBDA) -> float:
    """
    Calculate the prospect value v(Δz) based on Prospect Theory.
    
    Formula:
        v(Δz) = (Δz)^α           if Δz >= 0
        v(Δz) = -λ(-Δz)^β        if Δz < 0
        
    Args:
        delta_z: Deviation from reference point (Performance - Objective)
        alpha: Concavity parameter for gains (0 < alpha < 1)
        beta: Convexity parameter for losses (0 < beta < 1)
        lambda_: Loss aversion coefficient (lambda > 1)
        
    Returns:
        float: Psychological value
    """
    if delta_z >= 0:
        return float(delta_z ** alpha)
    else:
        return float(-lambda_ * ((-delta_z) ** beta))

def calculate_gain_value(delta_y: float, delta_x: float, alpha: float = DEFAULT_ALPHA) -> float:
    """
    Calculate gain prospect value S_j2 (Definition 5).
    S_j2 = (Δy)^α + (Δx)^α
    
    Args:
        delta_y: Output surplus (profit)
        delta_x: Input saving
        alpha: Gain parameter
    """
    # Ensure non-negative inputs
    d_y = max(0.0, delta_y)
    d_x = max(0.0, delta_x)
    return (d_y ** alpha) + (d_x ** alpha)

def calculate_loss_value(delta_y_deficiency: float, delta_x_redundancy: float, 
                       beta: float = DEFAULT_BETA, lambda_: float = DEFAULT_LAMBDA) -> float:
    """
    Calculate loss prospect value S_j1 (Definition 4).
    S_j1 = -λ(-( -Δy ))^β - λ(-( -Δx ))^β
         = -λ(Δy_deficiency)^β - λ(Δx_redundancy)^β
    
    Note: The paper defines inputs as negative deltas: 
    S = -lambda(-Delta_y)^beta - lambda(-Delta_x)^beta
    Here we pass the absolute magnitude of the deficiency/redundancy for clarity.
    
    Args:
        delta_y_deficiency: Magnitude of output deficiency (>0 means deficiency)
        delta_x_redundancy: Magnitude of input redundancy (>0 means redundancy)
    """
    d_y = max(0.0, delta_y_deficiency)
    d_x = max(0.0, delta_x_redundancy)
    
    term_y = -lambda_ * (d_y ** beta)
    term_x = -lambda_ * (d_x ** beta)
    
    return term_y + term_x

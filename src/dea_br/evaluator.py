import numpy as np
from typing import Dict, List, Any, Optional
from .cross_efficiency import calculate_cross_efficiency_matrix
from .prospect_theory import DEFAULT_ALPHA, DEFAULT_BETA, DEFAULT_LAMBDA

class BoundedRationalityEvaluator:
    def __init__(
        self,
        theta_oo: float = 0.7,
        mu: float = 0.6,
        alpha: float = DEFAULT_ALPHA,
        beta: float = DEFAULT_BETA,
        lambda_: float = DEFAULT_LAMBDA
    ):
        """
        Main runner for DEA Bounded Rationality Evaluation.
        
        Args:
            theta_oo: Organizational Objective (Global Reference Point).
            mu: Weight for Organizational Objective in Composite calculation.
                (1 - mu) is used for Personal Objective.
            alpha, beta, lambda_: Prospect Theory parameters.
        """
        self.theta_oo = theta_oo
        self.mu = mu
        self.alpha = alpha
        self.beta = beta
        self.lambda_ = lambda_
        
    def evaluate(
        self,
        dmu_ids: List[Any],
        inputs: np.ndarray,
        outputs: np.ndarray,
        personal_objectives: Optional[Dict[Any, float]] = None
    ) -> Dict[Any, Dict[str, Any]]:
        """
        Run the evaluation pipeline.
        
        Args:
            dmu_ids: List of identifiers for DMUs.
            inputs: N x M array.
            outputs: N x S array.
            personal_objectives: Dict mapping dmu_id to their personal target.
                                 If None, defaults to theta_oo for everyone (pure OO).
                                 
        Returns:
            Dict mapping dmu_id to result dict containing:
            - ccr_efficiency
            - cross_efficiency (The final score)
            - rank
            - category
        """
        # Validate data
        if len(dmu_ids) != inputs.shape[0] or len(dmu_ids) != outputs.shape[0]:
            raise ValueError("Size mismatch between DMU IDs and Data matrices")
            
        # 1. Calculate Composite Objectives
        # Theta^CO = Theta^OO * mu + Theta^PO * (1-mu)
        theta_limits = {}
        
        for i, dmu_id in enumerate(dmu_ids):
            theta_po = self.theta_oo # Default
            if personal_objectives and dmu_id in personal_objectives:
                theta_po = personal_objectives[dmu_id]
            
            # Formula Eq 197
            theta_co = (self.theta_oo * self.mu) + (theta_po * (1.0 - self.mu))
            theta_limits[i] = theta_co
            
        # 2. Run Cross-Efficiency Matrix Calculation
        matrix, self_effs = calculate_cross_efficiency_matrix(
            X=inputs,
            Y=outputs,
            theta_limits=theta_limits,
            alpha=self.alpha,
            beta=self.beta,
            lambda_=self.lambda_
        )
        
        # 3. Calculate Average Cross-Efficiency (Final Score)
        # Axis 1 = Mean of Row (How J is evaluated by all K)
        avg_scores = np.mean(matrix, axis=1)
        
        # 4. Prepare Results & Ranking
        results = {}
        
        # Create list for sorting
        ranked_list = []
        for i, dmu_id in enumerate(dmu_ids):
            rec = {
                'id': dmu_id,
                'ccr_efficiency': float(self_effs[i]),
                'cross_efficiency': float(avg_scores[i]),
                'composite_score': float(avg_scores[i]), # For compatibility (Paper calls it cross eff)
                'theta_co': float(theta_limits[i])
            }
            ranked_list.append(rec)
            
        # Sort descending by score
        ranked_list.sort(key=lambda x: x['cross_efficiency'], reverse=True)
        
        # Assign Ranks and Categories
        n = len(ranked_list)
        for rank, item in enumerate(ranked_list, 1):
            item['rank'] = rank
            
            # Percentile-based categorization (as per platform spec)
            percentile = (rank / n) * 100
            if percentile <= 5:
                category = 'Exceptional'
            elif percentile <= 25:
                category = 'Above Target'
            elif percentile <= 75:
                category = 'Meets Target'
            elif percentile <= 95:
                category = 'Below Target'
            else:
                category = 'Critical'
                
            item['category'] = category
            
            # Store in result dict
            results[item['id']] = item
            
        return results

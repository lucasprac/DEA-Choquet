import numpy as np
from typing import Dict, List, Any, Optional
from .choquet import DMU, run_choquet_evaluation, normalize_data

class BoundedRationalityEvaluator:
    def __init__(
        self,
        rho: float = 0.5,
        ethical_principle: str = 'fairness',
        # Deprecated/Ignored params kept for compatibility
        theta_oo: float = 0.7,
        mu: float = 0.6,
        alpha: float = 0.88,
        beta: float = 0.88,
        lambda_: float = 2.25
    ):
        """
        Main runner for DEA Choquet Integral Evaluation.
        
        Args:
            rho: Weight balance parameter (0, 1].
            ethical_principle: 'fairness', 'utilitarianism', or 'equity'.
            theta_oo, mu, alpha, beta, lambda_: Ignored (Legacy params).
        """
        self.rho = rho
        self.ethical_principle = ethical_principle
        # Legacy
        self.theta_oo = theta_oo 
        
    def evaluate(
        self,
        dmu_ids: List[Any],
        inputs: np.ndarray,
        outputs: np.ndarray,
        personal_objectives: Optional[Dict[Any, float]] = None
    ) -> Dict[Any, Dict[str, Any]]:
        """
        Run the Choquet DEA evaluation pipeline.
        
        Args:
            dmu_ids: List of identifiers for DMUs.
            inputs: N x M array.
            outputs: N x S array.
            personal_objectives: Ignored in this methodology (kept for API compat).
                                 Choquet methodology focuses on Satisfaction/Fairness.
                                 
        Returns:
            Dict mapping dmu_id to result dict.
        """
        # Validate data
        if len(dmu_ids) != inputs.shape[0] or len(dmu_ids) != outputs.shape[0]:
            raise ValueError("Size mismatch between DMU IDs and Data matrices")
            
        # 1. Create DMU objects
        data_dmus = []
        for i, d_id in enumerate(dmu_ids):
            # Create fresh copy of arrays
            d = DMU(
                name=str(d_id),
                inputs=inputs[i].astype(float).copy(),
                outputs=outputs[i].astype(float).copy()
            )
            data_dmus.append(d)
            
        # 2. Normalize Data
        # Choquet method usually requires normalization to [0,1] for comparability
        data_dmus = normalize_data(data_dmus)
        
        # 3. Run Pipeline
        final_scores, E_max, E_min = run_choquet_evaluation(data_dmus, rho=self.rho)
        
        # 4. Prepare Results & Ranking
        results = {}
        
        # Combine into list for sorting
        ranked_list = []
        for i, d_id in enumerate(dmu_ids):
            rec = {
                'id': d_id,
                'ccr_efficiency': float(data_dmus[i].efficiency_ccr if data_dmus[i].efficiency_ccr else 0.0),
                'cross_efficiency': float(final_scores[i]),
                'composite_score': float(final_scores[i]), 
                'satisfaction': float(data_dmus[i].satisfaction if data_dmus[i].satisfaction else 0.0),
                'theta_co': 0.0 # Legacy field
            }
            ranked_list.append(rec)
            
        # Sort descending by score
        ranked_list.sort(key=lambda x: x['cross_efficiency'], reverse=True)
        
        # Assign Ranks and Categories
        n = len(ranked_list)
        for rank, item in enumerate(ranked_list, 1):
            item['rank'] = rank
            
            # Percentile-based categorization
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

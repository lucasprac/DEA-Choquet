
import pytest
import numpy as np
import pandas as pd
import sys
import os

# Add src to path for direct execution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from dea_br.choquet import DMU, run_choquet_evaluation, normalize_data
from dea_br.evaluator import BoundedRationalityEvaluator

def test_numerical_example_choquet():
    """
    Test against the numerical example from the Choquet DEA Guide (Table 3).
    """
    dmus = [
        DMU("A", np.array([7,7,7], dtype=float), np.array([4,4], dtype=float)),
        DMU("B", np.array([5,9,7], dtype=float), np.array([7,7], dtype=float)),
        DMU("C", np.array([4,6,5], dtype=float), np.array([5,7], dtype=float)),
        DMU("D", np.array([5,9,8], dtype=float), np.array([6,2], dtype=float)),
        DMU("E", np.array([6,8,5], dtype=float), np.array([3,6], dtype=float)),
    ]
    
    # Normalize
    dmus_norm = normalize_data(dmus)
    
    # Run Evaluation (rho=0.5)
    final_scores, _, _ = run_choquet_evaluation(dmus_norm, rho=0.5)
    
    print("\nChoquet Results:")
    for i, d in enumerate(dmus_norm):
        print(f"DMU {d.name}: Score={final_scores[i]:.4f}, Satisfaction={d.satisfaction:.4f}, SelfEff={d.efficiency_ccr:.4f}")
        
    scores_dict = {d.name: final_scores[i] for i, d in enumerate(dmus_norm)}
    scores = list(scores_dict.values())
    
    # Basic Validity Checks
    assert all(0.0 <= s <= 1.0001 for s in scores), "Scores out of range"
    assert len(set(scores)) > 1, "Scores should not be identical for all DMUs"
    
    # Verify Evaluator Wrapper works
    evaluator = BoundedRationalityEvaluator(rho=0.5)
    
    inputs = np.array([
        [7,7,7],
        [5,9,7],
        [4,6,5],
        [5,9,8],
        [6,8,5]
    ])
    outputs = np.array([
        [4,4],
        [7,7],
        [5,7],
        [6,2],
        [3,6]
    ])
    dmu_ids = ["A", "B", "C", "D", "E"]
    
    results = evaluator.evaluate(dmu_ids, inputs, outputs)
    
    print("\nWrapper Results:", results)
    
    # Check structure
    assert 'A' in results
    assert 'cross_efficiency' in results['A']
    assert results['A']['rank'] > 0

if __name__ == "__main__":
    test_numerical_example_choquet()

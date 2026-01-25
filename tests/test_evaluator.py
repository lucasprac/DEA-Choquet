import pytest
import numpy as np
from dea_br.evaluator import BoundedRationalityEvaluator


class TestEvaluator:
    """Integration tests for the full evaluation pipeline."""
    
    def test_basic_pipeline(self):
        """Test that the pipeline runs without errors."""
        evaluator = BoundedRationalityEvaluator(theta_oo=0.8, mu=0.6)
        
        X = np.array([[100.0], [100.0], [100.0]])
        Y = np.array([[100.0], [80.0], [50.0]])
        
        dmu_ids = ['E1', 'E2', 'E3']
        personal_objectives = {'E1': 0.8, 'E2': 0.8, 'E3': 0.8}
        
        results = evaluator.evaluate(dmu_ids, X, Y, personal_objectives)
        
        assert 'E1' in results
        assert 'E2' in results
        assert 'E3' in results
        
    def test_ranking_order(self):
        """Test that ranking is correct."""
        evaluator = BoundedRationalityEvaluator(theta_oo=0.7, mu=0.6)
        
        X = np.array([[10.0], [10.0], [10.0]])
        Y = np.array([[100.0], [80.0], [50.0]])
        
        dmu_ids = ['E1', 'E2', 'E3']
        
        results = evaluator.evaluate(dmu_ids, X, Y)
        
        assert results['E1']['rank'] == 1
        assert results['E2']['rank'] == 2
        assert results['E3']['rank'] == 3
        
    def test_ccr_efficiency_values(self):
        """Test that CCR efficiency values are calculated correctly."""
        evaluator = BoundedRationalityEvaluator()
        
        X = np.array([[1.0], [1.0]])
        Y = np.array([[1.0], [0.5]])
        
        results = evaluator.evaluate(['E1', 'E2'], X, Y)
        
        assert results['E1']['ccr_efficiency'] == pytest.approx(1.0, abs=0.01)
        assert results['E2']['ccr_efficiency'] == pytest.approx(0.5, abs=0.01)
        
    def test_categories_assigned(self):
        """Test that performance categories are assigned."""
        evaluator = BoundedRationalityEvaluator()
        
        X = np.array([[1.0], [1.0]])
        Y = np.array([[1.0], [0.5]])
        
        results = evaluator.evaluate(['E1', 'E2'], X, Y)
        
        assert 'category' in results['E1']
        assert 'category' in results['E2']
        
    def test_personal_objectives_used(self):
        """Test that personal objectives affect the composite target."""
        evaluator = BoundedRationalityEvaluator(theta_oo=0.5, mu=0.6)
        
        X = np.array([[10.0], [10.0]])
        Y = np.array([[100.0], [100.0]])
        
        personal_obj = {'E1': 0.5, 'E2': 0.9}
        
        results = evaluator.evaluate(['E1', 'E2'], X, Y, personal_obj)
        
        assert results['E1']['theta_co'] == pytest.approx(0.5, abs=0.01)
        assert results['E2']['theta_co'] == pytest.approx(0.66, abs=0.01)

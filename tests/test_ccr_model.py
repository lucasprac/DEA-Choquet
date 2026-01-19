import pytest
import numpy as np
from dea_br.ccr_model import solve_ccr


class TestCCRModel:
    """Tests for the CCR self-efficiency model."""
    
    def test_basic_efficiency(self):
        """Test basic 2-DMU case where one is clearly efficient."""
        X = np.array([[1.0], [1.0]])
        Y = np.array([[1.0], [0.5]])
        
        theta0, _ = solve_ccr(X, Y, 0)
        theta1, _ = solve_ccr(X, Y, 1)
        
        assert theta0 == pytest.approx(1.0, abs=0.01)
        assert theta1 == pytest.approx(0.5, abs=0.01)
        
    def test_weights_returned(self):
        """Test that weights are returned correctly."""
        X = np.array([[1.0], [1.0]])
        Y = np.array([[1.0], [0.5]])
        
        theta, weights = solve_ccr(X, Y, 0)
        
        assert 'u' in weights
        assert 'v' in weights
        assert len(weights['u']) == 1
        assert len(weights['v']) == 1
        
    def test_multiple_inputs_outputs(self):
        """Test with multiple inputs and outputs."""
        X = np.array([
            [4, 4.0452],
            [7, 2.25],
            [15, 13.37]
        ])
        Y = np.array([
            [0.03, 0.1211],
            [0.18, 0.55],
            [0.95, 0.56]
        ])
        
        for k in range(3):
            theta, weights = solve_ccr(X, Y, k)
            assert 0 <= theta <= 1.0001
            assert len(weights['u']) == 2
            assert len(weights['v']) == 2
            
    def test_dominance(self):
        """Test that dominated DMU has lower efficiency."""
        X = np.array([[10.0], [10.0], [10.0]])
        Y = np.array([[5.0], [10.0], [2.0]])
        
        theta0, _ = solve_ccr(X, Y, 0)
        theta1, _ = solve_ccr(X, Y, 1)
        theta2, _ = solve_ccr(X, Y, 2)
        
        assert theta1 > theta0
        assert theta0 > theta2
        assert theta1 == pytest.approx(1.0, abs=0.01)

import pytest
from dea_br.prospect_theory import (
    prospect_value_function,
    calculate_gain_value,
    calculate_loss_value,
    DEFAULT_ALPHA,
    DEFAULT_BETA,
    DEFAULT_LAMBDA
)


class TestProspectTheory:
    """Tests for Prospect Theory value functions."""
    
    def test_gain_positive(self):
        """Gains should return positive values."""
        result = prospect_value_function(0.5)
        assert result > 0
        
    def test_loss_negative(self):
        """Losses should return negative values."""
        result = prospect_value_function(-0.5)
        assert result < 0
        
    def test_zero_reference(self):
        """At reference point, value should be 0."""
        result = prospect_value_function(0.0)
        assert result == pytest.approx(0.0)
        
    def test_loss_aversion(self):
        """Loss of X should be felt more than gain of X."""
        gain = prospect_value_function(0.3)
        loss = prospect_value_function(-0.3)
        assert abs(loss) > abs(gain)
        
    def test_default_parameters(self):
        """Test default parameters match paper."""
        assert DEFAULT_ALPHA == pytest.approx(0.88)
        assert DEFAULT_BETA == pytest.approx(0.88)
        assert DEFAULT_LAMBDA == pytest.approx(2.25)
        
    def test_calculate_gain_value(self):
        """Test gain value calculation."""
        result = calculate_gain_value(0.1, 0.1)
        expected = 2 * (0.1 ** 0.88)
        assert result == pytest.approx(expected, rel=0.01)
        
    def test_calculate_loss_value(self):
        """Test loss value calculation."""
        result = calculate_loss_value(0.1, 0.1)
        expected = -2 * 2.25 * (0.1 ** 0.88)
        assert result == pytest.approx(expected, rel=0.01)

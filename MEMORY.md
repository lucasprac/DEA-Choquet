# MEMORY

## 2026-01-25
- **Problem**: Need to replace Bounded Rationality DEA engine with Choquet Integral DEA engine.
- **Solution**: 
    - Implemented `src/dea_br/choquet.py` following the guide `choquet_dea_guide.md`.
    - Added dependencies: `pulp`, `pandas`, `scikit-learn`.
    - Refactored `src/dea_br/evaluator.py` to wrap the new Choquet engine.
    - Updated `normalize_data` to use "Divide by Max" strategy to avoid zero inputs and preserve ratios.
    - Created `tests/test_choquet.py` to verify implementation against the guide's numerical example.
    - Notes: The `rho` parameter (Weight Balance) and Satisfaction principle (e.g. 'fairness') are now key drivers. Legacy parameters (`alpha`, `beta`, `lambda`) are ignored.
    - **Cleanup**: Removed legacy DEA engine files (`ccr_model.py`, `bounded_rationality_models.py`, `cross_efficiency.py`, `prospect_theory.py`) and their corresponding tests. The system now exclusively uses the Choquet Integral engine.
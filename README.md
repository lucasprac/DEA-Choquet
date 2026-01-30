<<<<<<< HEAD
# Hybrid Performance Evaluation Model (DEA-Choquet)

This project implements a multidimensional sales performance evaluation method combining **DEA-Choquet Cross-Efficiency** (Operational Efficiency) and **Effectiveness Matrices** (Financial Results).

## Structure

- **`src/models.py`**: Data definition using Polars (DMUs, Variables).
- **`src/solver/choquet_dea.py`**: The optimization engine using `pulp` for Linear Programming. It implements the Zhao Cross-Efficiency model with Choquet Integral (2-additive).
- **`src/analysis/matrix.py`**: Logic for classifying salespeople into 4 Quadrants (Benchmark, Diligent, Opportunistic, Underperformer).

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

You can run the example script which uses mock data:

```bash
python main.py
```

This will output the optimization results and generate a `final_report.csv` with the classification of each salesperson.

## Evaluation Methodology

1. **Choquet DEA**: Calculates efficiency considering interactions between inputs (synergy) and weight balance constraints.
2. **Cross-Efficiency**: Reduces self-evaluation bias by averaging scores using peer weights.
3. **Decision Matrix**: Maps "Score Zhao" (Efficiency) vs "Revenue" (Efficacy) into diagnostic quadrants.
=======
# Choquet Integral DEA Engine

A Python library implementing the **Choquet Integral DEA Cross-Efficiency Evaluation Method**, based on the research by **Zhao & Gong (2023)**.

This library replaces traditional linear DEA aggregation with a non-linear Choquet integral approach, capturing interactions between indicators and optimizing for stakeholder satisfaction.

## Key Features

*   **2-Additive Choquet Integral**: Models pairwise interactions (synergy or substitution) between input/output indicators.
*   **DMU Satisfaction Optimization**: Selects weights that maximize the minimum satisfaction across all units (Fairness/Rawlsian principle).
*   **Weight Balance Restrictions**: Prevents zero weights and excessive weight differences using the $\rho$ parameter.
*   **Automatic Interaction Estimation**: Estimates synergy/substitution indices using empirical correlation analysis.
*   **Ethical Frameworks**: Optimized for Fairness (Max-min satisfaction) to ensure results are accepted by all stakeholders.

## Installation

```bash
pip install pulp pandas scikit-learn numpy scipy
```

## Quick Start

```python
import numpy as np
from dea_br import BoundedRationalityEvaluator

# 1. Define Data (5 DMUs, 3 Inputs, 2 Outputs)
inputs = np.array([
    [7, 7, 7],
    [5, 9, 7],
    [4, 6, 5],
    [5, 9, 8],
    [6, 8, 5]
], dtype=float)

outputs = np.array([
    [4, 4],
    [7, 7],
    [5, 7],
    [6, 2],
    [3, 6]
], dtype=float)

dmu_ids = ["A", "B", "C", "D", "E"]

# 2. Initialize Evaluator
# rho=0.5: Balance between weight flexibility and dispersion
evaluator = BoundedRationalityEvaluator(rho=0.5, ethical_principle='fairness')

# 3. Run Evaluation
results = evaluator.evaluate(
    dmu_ids=dmu_ids,
    inputs=inputs,
    outputs=outputs
)

# 4. Inspect Results
for dmu_id, res in results.items():
    print(f"DMU {dmu_id}: Rank={res['rank']} Score={res['cross_efficiency']:.4f} Satisfaction={res['satisfaction']:.4f}")
```

## Methodology Overview

The evaluation follows a 3-step hierarchical optimization:

1.  **Optimal Self-Evaluation (2-CHCCR)**: Calculates maximum self-efficiency for each DMU using Choquet aggregation and weight balance constraints.
2.  **Target Computation**: Determines the ideal (Benevolent) and non-ideal (Aggressive) cross-efficiency boundaries for every pair of DMUs.
3.  **Satisfaction Optimization**: Searches for the "Fair" weight profile that maximizes the satisfaction of the least-satisfied DMU relative to its targets.

### The $\rho$ Parameter
The `rho` parameter (range $(0, 1]$) controls how much weights are allowed to differ. 
- Higher $\rho$ (e.g., 0.7) forces more balanced importance across indicators.
- Lower $\rho$ (e.g., 0.1) allows the model to specialize weights to highlight specific strengths.

## Mathematical Reference

This library implements the models from:
> **Zhao, Y., & Gong, Z. (2023).** *On a Choquet Integral DEA Cross-Efficiency Evaluation Method Involving the Satisfaction of Decision-Making Units and Weight Balance of Indicators.* International Journal of Computational Intelligence Systems. [DOI: 10.1007/s44196-023-00204-x](https://doi.org/10.1007/s44196-023-00204-x)

## License

MIT
>>>>>>> 929a415648f220fb6ee79ad3f15d83c79b89006b

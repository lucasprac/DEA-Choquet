# DEA Bounded Rationality Engine

A Python library implementing the **Cross-Efficiency Evaluation Method with Performance Level as a Management Objective in Consideration of Bounded Rationality**, based on the research by Shi, Wang & Zhang (2024).

This library provides a robust Data Envelopment Analysis (DEA) engine that accounts for:
*   **Organizational Objectives**: Global targets set by management.
*   **Personal Objectives**: Individual targets set by DMUs.
*   **Bounded Rationality**: Uses **Prospect Theory** (gains/losses) to model the psychological value of performance relative to these objectives.

## Features

*   **CCR Model**: Classic self-efficiency evaluation.
*   **Bounded Rationality Cross-Efficiency**:
    *   Models 6 & 7: Organizational Objectives (Gain/Loss optimization).
    *   Models 8 & 9: Personal Objectives (Gain/Loss optimization).
*   **Composite Objectives**: Weighted combination of organizational and personal goals.
*   **Prospect Theory Integration**: Configurable $\alpha, \beta, \lambda$ parameters for value functions.
*   **Scipy Integration**: Uses `scipy.optimize.linprog` for reliable linear programming.

## Installation

```bash
C
```

## Quick Start

```python
import numpy as np
from dea_br import BoundedRationalityEvaluator

# 1. Define Data (Inputs X, Outputs Y)
# 3 DMUs, 1 Input, 1 Output
X = np.array([[10], [20], [30]])
Y = np.array([[100], [150], [200]])

# 2. Define Objectives (Organizational & Personal)
theta_oo = 0.8  # Organizational Objective (0-1)
theta_po = {0: 0.9, 1: 0.8, 2: 0.7} # Personal Objectives per DMU ID

# 3. Initialize Evaluator
evaluator = BoundedRationalityEvaluator(
    theta_oo=theta_oo,
    mu=0.6,          # 60% weight to Organizational Objective
    alpha=0.88,      # Prospect Theory parameters
    beta=0.88,
    lambda_=2.25
)

# 4. Run Evaluation
results = evaluator.evaluate(
    dmu_ids=[0, 1, 2],
    inputs=X,
    outputs=Y,
    personal_objectives=theta_po
)

# 5. Inspect Results
for dmu_id, res in results.items():
    print(f"DMU {dmu_id}: Score={res['composite_score']:.4f} Rank={res['rank']}")
```

## Mathematical Models

This library implements the following models from [Shi et al. (2024)](https://doi.org/10.1007/s44196-024-00650-1):

*   **Model (2)**: CCR Self-Efficiency.
*   **Model (6)**: Cross-efficiency minimizing gain relative to Organizational Objective.
*   **Model (7)**: Cross-efficiency maximizing loss relative to Organizational Objective.
*   **Model (8)**: Cross-efficiency minimizing gain relative to Personal Objective.
*   **Model (9)**: Cross-efficiency maximizing loss relative to Personal Objective.

## License

MIT

# Mathematical Engine: Choquet DEA (Zhao Model)

## Overview
A bounded-rational performance evaluation system that ranks Decision-Making Units (DMUs) using prospect theory and cross-efficiency analysis.

## Core Constraints
- **Max Variables**: Max 10 input/output variables (Optimal: 5-8).
- **Data Quality**: Strictly positive values required (Min: 0.001). Zeros must be pre-processed (add epsilon).
- **Computation Time**: ~5 seconds for 1000+ employees.
- **Weight Balance (θ)**: Typical θ ≈ 3.0 (prevents unbalanced weighting).

## Workflow Phases
1. **Data Ingestion**: Support CSV/Excel.
2. **Preprocessing**: Normalization (0 to 1) and zero-to-epsilon conversion.
3. **Automated Interaction Mapping**: Generate 2-additive pairs (Combinatorial Logic $C_n^2$).
4. **Zhao Optimization Engine**:
   - Maximize Self-Efficiency via Linear Programming.
   - Constraints: Frontier ($\le 1$), Weight Balance ($\theta$), Monotonicity.
5. **Cross-Efficiency Calculation**: Apply peer weights to calculate average Zhao Score.
6. **9-Box Grid Classification**:
   - X-Axis: Zhao Score (Efficiency).
   - Y-Axis: Effectiveness KPI (User defined).
   - Thresholds: Dynamic statistical terciles (33% / 66%).

## Classification Labels
- **High/High**: Star / Benchmark (Promote)
- **High/Low**: High Cost / Workhorse (Optimize)
- **Low/High**: Enigma (Check Market/Role)
- **Low/Low**: Critical (Restructure/Exit)

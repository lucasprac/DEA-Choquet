# The Architectural WorkflowThis is the high-level logic flow of the system: #

## Data Ingestion & Preprocessing ##
- Input: User provides a Dataset (CSV/Excel).
- Configuration: User defines Inputs ($X$), Outputs ($Y$), and Effectiveness_KPI ($Z$).
- Normalization: All data is normalized (0 to 1) to ensure mathematical stability in the solver.

## Automated Interaction Mapping (The "Genetic" Feature) ## 
- The system detects the number of inputs ($m$) and outputs ($s$).
- It automatically generates 2-additive pairs (Combinatorial Logic $C_n^2$).
- Example: If inputs are $[A, B, C]$, the system creates weight variables for $A, B, C$ AND interactions $AB, AC, BC$.

## The Zhao Optimization Engine (Loop) ##
- For every DMU (Decision Making Unit), the system initiates a Linear Programming (LP) Solver.
- Objective: Maximize Self-Efficiency.
- Constraints applied:
    - $\text{Efficiency} \le 1$ (Frontier).
    - $\text{Weight Balance}$ (using parameter $\theta$ to prevent zero weights).
    - $\text{Monotonicity}$ (ensuring mathematical validity).
- Result: A set of optimal weights (Möbius transform) for that specific DMU.

## Cross-Efficiency Calculation ##
- The system applies the weights found for DMU $A$ to evaluate DMUs $B, C, D...$
- The final Zhao Score is the average of all peer evaluations.

## 9-Box Grid Classification (The Decision Tree) ##
- X-Axis: Zhao Score (Efficiency).
- Y-Axis: Effectiveness KPI (User defined).
- Thresholds: Calculated dynamically using statistical terciles (33rd and 66th percentiles).
- Output: Assignment of a label (e.g., "Star", "Problematic", "High Cost") based on the Grid location.
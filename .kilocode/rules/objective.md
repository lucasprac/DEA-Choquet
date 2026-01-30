---
trigger: always_on
---

The Hybrid - Performance Evaluation Model

Technical Specification & Methodology Whitepaper

Version: 1.0

Date: October 2023

1. Executive Summary

This document defines the architecture of the Hybrid - Model, a novel framework for organizational performance evaluation. This methodology integrates the managerial decision-making structure proposed by  et al. (using dual-dimensional analysis of Efficiency and Effectiveness) with the advanced mathematical robustness of  & Gong (utilizing Choquet Integral Data Envelopment Analysis with Weight Balancing).

Unlike traditional DEA models (CCR/BCC) which assume independence between variables and allow for unbalanced weighting schemes, the - model accounts for synergistic interactions between inputs and enforces weight fairness. The result is a generic, "genetic" evaluation engine capable of diagnosing performance across diverse organizational contexts (Sales, Logistics, Healthcare) with high precision.

2. Theoretical Framework

The model addresses two fundamental limitations in classical performance measurement:

The "Efficiency Trap": Traditional DEA measures how well resources are converted into outputs but ignores the absolute magnitude of the result. A small unit can be 100% efficient but irrelevant to the company's bottom line.

The "Additivity Bias": Classical models assume inputs are independent. In reality, resources interact (e.g., Time + Skill > Time + Time).

2.1 The Hybrid Synthesis

Component

Source Theory

Role in Model

Operational Efficiency

The "Engine". Calculates the quality of the process using Cross-Efficiency DEA with Choquet Integrals to capture input interactions.

Strategic Effectiveness

The "Compass". Measures the absolute achievement of organizational goals (e.g., Revenue, Volume).

Decision Logic

9-Box Grid Matrix

The "classifier". Maps the intersection of Efficiency and Effectiveness to suggest management interventions.

3. The Mathematical Engine ('s Core)

The core of the evaluation is the Choquet Integral Cross-Efficiency DEA. This section details the mathematical programming problem (LPP) solved for each Decision Making Unit (DMU).

3.1 Input Interaction (2-Additive Choquet Integral)

Standard DEA uses a weighted sum ($\sum w_i x_i$). Our model replaces this with the Choquet Integral to capture interactions. We utilize the Möbius Transform for 2-additive measures, simplifying complexity while retaining synergy detection.

For a set of inputs $M$, the aggregated input value for DMU $j$ is:

$$\text{Input}(j) = \sum_{i \in M} v_i x_{ij} + \sum_{\{i,k\} \subseteq M} v_{ik} \min(x_{ij}, x_{kj})$$

Where:

$v_i$: The independent weight of input $i$.

$v_{ik}$: The interaction weight between inputs $i$ and $k$ (can be positive for synergy or negative for redundancy).

3.2 The Optimization Problem (Self-Evaluation)

For a specific DMU $d$, we maximize its efficiency score ($E_d$) subject to specific constraints. The Solver runs the following Linear Program:

Objective Function:


$$\text{Maximize } E_{dd} = \sum_{r \in S} u_r y_{rd} + \sum_{\{r,q\} \subseteq S} u_{rq} \min(y_{rd}, y_{qd})$$

Subject to:

Normalization Constraint:


$$\sum_{i \in M} v_i x_{id} + \sum_{\{i,k\} \subseteq M} v_{ik} \min(x_{id}, x_{kd}) = 1$$

Frontier Constraint (Efficiency $\le$ 1):
For all DMUs $j=1...n$:


$$(\text{Output Choquet}_j) - (\text{Input Choquet}_j) \le 0$$

Monotonicity (Validity):
Ensures that increasing an input does not decrease the aggregate value.


$$v_i + \sum_{k \in M \setminus i} v_{ik} \ge 0 \quad \forall i$$

Weight Balance Constraint ($\theta$):
This is the critical innovation by . It prevents the model from assigning zero weights to unfavorable variables. We calculate the Shapley Value (global importance) for each factor and constrain the ratio between the max and min importance:


$$\frac{\max(\text{Shapley}_i)}{\min(\text{Shapley}_i)} \le \theta$$


(Typically, $\theta \approx 3.0$).

3.3 Cross-Efficiency Calculation

To eliminate the bias of self-evaluation (where a DMU chooses weights that make it look best), we employ the Cross-Efficiency strategy:

Let $v^*_d$ and $u^*_d$ be the optimal weights chosen by DMU $d$.

Calculate $E_{dk}$: The efficiency of DMU $k$ using DMU $d$'s weights.

The final  Score for DMU $k$ is the average of peer evaluations:


$$\text{Score}_{}(k) = \frac{1}{n} \sum_{d=1}^{n} E_{dk}$$

4. The Classification System ('s Matrix)

Once the mathematical engine produces the  Score (Process Quality) and the user defines the Effectiveness KPI (Goal Achievement), the model classifies the DMUs using a Dynamic 9-Box Grid.

4.1 Statistical Thresholding

Instead of arbitrary fixed lines (e.g., "Score > 0.5"), the model calculates Terciles (33rd and 66th percentiles) based on the population distribution.

Low: Bottom 33% of the group.

Medium: Middle 33%.

High: Top 33%.

4.2 The 9-Box Taxonomy

The intersection of the two axes creates 9 strategic profiles:



Low Efficiency (Process Issues)

Medium Efficiency

High Efficiency (Process Excellence)

High Effectiveness (High Results)

High Cost / Workhorse



(Delivers results but wastes resources. Risk of burnout or margin loss.)

Strong Performer



(Solid results with reasonable cost.)

★ The Star / Benchmark



(Ideal state. High volume, minimal waste. Role Model.)

Medium Effectiveness

Inconsistent


(Average volume, high cost. Needs training.)

Core Player


(The backbone of the operation.)

High Potential


(Great process, good volume. Ready to scale.)

Low Effectiveness (Low Results)

Critical / Bottleneck



(No results, high consumption. Restructure immediately.)

Underperformer



(Process is okay, but results are lacking.)

The Enigma / Misaligned



(Highly efficient process but low volume. Check market potential or activity type.)

5. Implementation Architecture

The methodology is implemented as a "Genetic" software class, meaning it adapts to the input data structure provided by the user.

5.1 The Workflow

Data Ingestion: The system accepts a dataset $D$ and a configuration map identifying columns as Inputs ($X$), Outputs ($Y$), and Effectiveness ($Z$).

Combinatorial Mapping: The system automatically generates the set of 2-additive pairs ($C_n^2$) for the Choquet Integral.

Solver Iteration: A loop runs the Linear Programming solver (using libraries like Gurobi or Pulp) $n$ times (once per DMU) to determine optimal weights.

Matrix Generation: The Cross-Efficiency matrix is computed and averaged.

Diagnostic Reporting: Final scores are mapped to the 9-Box grid, and automated textual insights are generated based on the specific interaction weights (e.g., identifying if "Visits" and "Sales" had positive synergy).

6. Advantages & Limitations

6.1 Key Advantages

Fairness: The Weight Balance constraint ($\theta$) ensures that no variable is ignored.

Reality Modeling: Captures synergies (positive interactions) and redundancies (negative interactions) which additive models miss.

Robustness: Cross-efficiency eliminates the "benevolence bias" of standard DEA.

Actionability: The 9-Box grid translates abstract scores into clear HR/Management actions.

6.2 Limitations

Computational Cost: The problem complexity grows quadratically with the number of variables due to interaction pairs. It is recommended to keep inputs/outputs under 10 variables each.

Data Requirements: Requires positive data. Zero values in inputs must be pre-processed (usually by adding a small constant $\epsilon$) to allow the solver to function correctly.

Convexity Assumption: Like all DEA models, it assumes a convex production possibility set.

7. Conclusion

The Hybrid - Model represents a state-of-the-art approach to organizational analytics. By bridging the gap between rigorous Operations Research (Choquet DEA) and practical Strategic Management (Performance Matrix), it offers a diagnostic tool that is both
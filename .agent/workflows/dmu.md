---
description: This workflow implements a bounded-rational performance evaluation system that ranks Decision-Making Units (DMUs) using prospect theory and cross-efficiency analysis
---

# Cross-Efficiency Evaluation Workflow with Bounded Rationality
---

## PHASE 0: SETUP

### 0.1 Define Decision-Making Units (DMUs)

A DMU is one **employee**, **manager**, or **team**. All DMUs must be comparable (e.g., all sales reps, all engineers).

### 0.2 Select Inputs and Outputs

**Input (x):** Resource consumed or effort expended.  
Examples: # opportunities worked, hours spent, team headcount, salary cost.

**Output (y):** Result or value created.  
Examples: revenue generated, deals closed, CSAT score, delivery rate.

**Rule:** Inputs are "controllable effort"; outputs are "desired outcomes" (higher is better).

### 0.3 Data Collection and Validation

1. Collect raw data for each DMU for each input/output over evaluation period.
2. **Preprocessing:**
   - Remove invalid data points (zero revenue with non-zero expenses).
   - Handle endogeneity (if total profit and net profit are collinear, keep one).
   - Create derived outputs if needed (new product revenue / total revenue).
   - Standardize units.
   - Handle negative values (standardize to positive).

---

## PHASE 1: SELF-EVALUATION (CCR MODEL)

### 1.1 Solve the CCR Model for Each DMU

For each DMU \(k\), solve:

```
Maximize:  ∑ᵣ uᵣₖ · yᵣₖ

Subject to:
  ∑ᵢ vᵢₖ · xᵢₖ = 1                           (normalization)
  ∑ᵣ uᵣₖ · yᵣⱼ - ∑ᵢ vᵢₖ · xᵢⱼ ≤ 0         for all j
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε                         (ε = 0.0001)
```

**Outputs:**
- Optimal weights: \(u^*_k, v^*_k\)
- Self-evaluation efficiency: \(\theta_k \in [0,1]\)

**Interpretation:**
- \(\theta_k = 1.0\) → DMU on efficiency frontier (Pareto-optimal)
- \(\theta_k < 1.0\) → DMU inefficient; can improve by reducing inputs or increasing outputs

---

## PHASE 2: DEFINE MANAGEMENT OBJECTIVES (Reference Points)

### 2.1 Organizational Objective (OO)

**Definition:** Company-wide target efficiency level derived from policy and DMU benchmark data.

**How to set:**
1. Calculate all self-evaluation efficiencies \(\theta_1, \theta_2, ..., \theta_n\).
2. Set OO as specific target (e.g., OO = 0.7, 0.75, 0.8, 0.9, 1.0).
3. OO should be achievable but challenging (e.g., 75th percentile of current performance).

**Formula:** \(OO \in [0, 1]\)

### 2.2 Personal Objective (POₖ)

**Definition:** Individual DMU target based on current performance and growth aspirations.

**How to set:**
1. For each DMU \(k\), define personal improvement goal.
2. \(PO_k\) is typically higher than current \(\theta_k\).
3. Can be set via manager-employee negotiation or relative to role level.

**Formula:** \(PO_k \in [\theta_k, 1.0]\)

### 2.3 Composite Objective (COₖ)

**Definition:** Weighted combination of organizational and personal objectives.

**Formula:**
$$CO_k = \alpha \cdot OO + (1-\alpha) \cdot PO_k$$

where \(\alpha \in [0, 1]\) is weighting parameter:
- \(\alpha = 0\) → pure personal objectives (bottom-up)
- \(\alpha = 0.5\) → equal weight (balanced)
- \(\alpha = 1\) → pure organizational objectives (top-down)

---

## PHASE 3: GAIN/LOSS CLASSIFICATION (Prospect Theory)

### 3.1 Compare Self-Evaluation to Objective

For each DMU \(j\) facing objective MO:

**Loss Domain** (\(\theta_j < MO\)):
- Status: Underperforming
- \(x_j\) = input redundancy (wasted inputs)
- \(y_j\) = output deficiency (missing outputs)
- Loss: \(S_j = y_j - \lambda \cdot x_j\)

**Gain Domain** (\(\theta_j \geq MO\)):
- Status: Meeting or exceeding
- \(x_j\) = input savings (efficient use)
- \(y_j\) = output profit (extra results)
- Gain: \(S_j = y_j - x_j\)

### 3.2 Prospect Theory Parameters

**Loss aversion coefficient:**
$$\lambda = 2.25$$

Losses are perceived 2.25× more painful than equivalent gains are pleasant.

**Value function curvature:**
$$\alpha = 0.88, \quad \beta = 0.88$$

---

## PHASE 4: PEER EVALUATION (CROSS-EFFICIENCY MODELS)

### 4.1 Organizational Objective Path

**For each pair (j, k) where k is evaluator:**

**Step 4.1a: Determine domain**

```
if OO ≤ θⱼ:
    Use Model 6 (Benevolent) - Minimize loss of j
else (OO > θⱼ):
    Use Model 7 (Aggressive) - Maximize loss of j
```

**Model 6 (Benevolent, when OO ≤ θⱼ):**

```
Minimize:  Sⱼ¹ = yⱼ¹ - λ·xⱼ¹

Subject to:
  ∑ᵣ uᵣₖ·yᵣⱼ - yⱼ¹ = OO × ∑ᵢ vᵢₖ·xᵢⱼ + xⱼ¹
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ
  ∑ᵣ uᵣₖ·yᵣₜ ≤ ∑ᵢ vᵢₖ·xᵢₜ   for all t ≠ k
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε,  yⱼ¹ ≥ 0,  xⱼ¹ ≥ 0
```

**Model 7 (Aggressive, when OO > θⱼ):**

```
Maximize:  Sⱼ² = yⱼ² - λ·xⱼ²

Subject to:
  ∑ᵣ uᵣₖ·yᵣⱼ + yⱼ² = OO × (∑ᵢ vᵢₖ·xᵢⱼ + xⱼ²)
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ
  ∑ᵣ uᵣₖ·yᵣₜ ≤ ∑ᵢ vᵢₖ·xᵢₜ   for all t ≠ k
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε,  yⱼ² ≥ 0,  xⱼ² ≥ 0
```

**Output:** Cross-efficiency \(e^{OO}_{jk} = \frac{\sum_r u^*_{rk} \cdot y_{rj}}{\sum_i v^*_{ik} \cdot x_{ij}}\)

### 4.2 Personal Objective Path

**For evaluator k evaluating itself under personal objective POₖ:**

**Step 4.2a: Determine domain**

```
if POₖ ≤ θₖ:
    Use Model 8 (Gain-focused) - Maximize own gain
else (POₖ > θₖ):
    Use Model 9 (Loss-focused) - Minimize own loss
```

**Model 8 (Gain domain, when POₖ ≤ θₖ):**

```
Maximize:  Sₖ¹ = yₖ¹ - xₖ¹

Subject to:
  ∑ᵣ uᵣₖ·yᵣₖ - yₖ¹ = POₖ × (∑ᵢ vᵢₖ·xᵢₖ - xₖ¹)
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ
  ∑ᵣ uᵣₖ·yᵣⱼ ≤ ∑ᵢ vᵢₖ·xᵢⱼ   for all j ≠ k
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε,  yₖ¹ ≥ 0,  xₖ¹ ≥ 0
```

**Model 9 (Loss domain, when POₖ > θₖ):**

```
Minimize:  Sₖ² = yₖ² - λ·xₖ²

Subject to:
  ∑ᵣ uᵣₖ·yᵣₖ + yₖ² = POₖ × (∑ᵢ vᵢₖ·xᵢₖ + xₖ²)
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ
  ∑ᵣ uᵣₖ·yᵣⱼ ≤ ∑ᵢ vᵢₖ·xᵢⱼ   for all j ≠ k
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε,  yₖ² ≥ 0,  xₖ² ≥ 0
```

### 4.3 Composite Objective Path

**Compute weighted average:**

$$CE^{CO}_k = \alpha \cdot CE^{OO}_k + (1-\alpha) \cdot CE^{PO}_k$$

where:
- \(CE^{OO}_k\) = average of org-objective cross-efficiencies for k
- \(CE^{PO}_k\) = average of personal-objective cross-efficiencies for k
- \(\alpha\) = weight on org (typically 0.5 for balance)

---

## PHASE 5: AGGREGATE CROSS-EFFICIENCY SCORES

### 5.1 Compute Average Cross-Efficiency for Each DMU

For each DMU \(j\), aggregate all peer evaluations plus self-evaluation.

**Formula (for organizational objective OO):**

$$CE^{OO}_j = \frac{1}{n} \left[ \theta_j + \sum_{k \neq j} e^{OO}_{jk} \right]$$

where:
- \(\theta_j\) = self-evaluation (from CCR)
- \(e^{OO}_{jk}\) = cross-efficiency when k evaluates j under OO
- \(n\) = total number of DMUs

Each DMU gets evaluated by (n-1) peers plus itself. Average smooths out quirky peer evaluations.

### 5.2 Final Ranking

1. Compute CE scores for all DMUs under chosen objective (OO, PO, or CO).
2. **Sort in descending order** by CE score.
3. Assign rank 1 (best) to highest CE, rank n (worst) to lowest CE.

---

## PHASE 6: INTERPRETATION (Bounded Rationality Insights)

### 6.1 Self-Evaluation vs Cross-Evaluation Gap

**If** \(\theta_j > CE_j\):
- DMU j chose weights favoring itself (self-interested).
- Other peers don't rate j as highly.
- Suggests potential bias in weight selection.

**If** \(\theta_j \approx CE_j\):
- DMU j's weights are broadly accepted by peers.
- More "fair" or "robust" evaluation.
- Lower risk of gaming the system.

**If** \(\theta_j < CE_j\):
- Rare; j undervalued itself.
- Peers see j's strengths better than j does itself.

### 6.2 Impact of Objectives on Ranking

**Organizational objective impact:**

DMUs **below OO** face **aggressive evaluation** (peers magnify weaknesses):
- Large ranking swings as OO changes.
- Indicates "problem areas" needing attention.

DMUs **above OO** receive **benevolent evaluation** (peers suppress downsides):
- Stable rankings across different OO levels.
- Indicates "solid performers" meeting bar.

**Personal objective impact:**

DMUs with **realistic PO** (close to current \(\theta\)) show stable CE.

DMUs with **ambitious PO** (far above \(\theta\)) show more variation depending on gain/loss domain.

**Composite objective:**

Balances org expectations (top-down) with individual ambitions (bottom-up). More flexible and psychologically realistic.

---

## IMPLEMENTATION LOGIC

### Key Decision Points

**1. Organizational Objective Selection**

```
if OO ≤ θⱼ:
    Model 6: Benevolent evaluation
    Objective: Minimize loss (suppress j's weaknesses)
else:
    Model 7: Aggressive evaluation
    Objective: Maximize loss (amplify j's weaknesses)
```

**2. Personal Objective Selection**

```
if POₖ ≤ θₖ:
    Model 8: Gain-focused
    Objective: Maximize own gain (amplify strengths)
else:
    Model 9: Loss-focused
    Objective: Minimize own loss (suppress weaknesses)
```

**3. Objective Type Path**

- **OO Path:** For organizational alignment (top-down)
- **PO Path:** For individual motivation (bottom-up)
- **CO Path:** For balanced evaluation (\(\alpha \cdot OO + (1-\alpha) \cdot PO\))

### Algorithm Overview

```
1. For each DMU k:
   a. Solve CCR model → get θₖ, u*ₖ, v*ₖ

2. Set organizational objective OO
   Set personal objectives POₖ for each k
   Set composite weight α

3. For each DMU j:
   a. For each evaluator k ≠ j:
      i. Determine: OO vs θⱼ → gain/loss domain
      ii. Select Model (6 or 7)
      iii. Solve LP → get e^OO_{jk}
   
   b. Average: CE^OO_j = (1/n)[θⱼ + ∑e^OO_{jk}]

4. Similarly for PO path (evaluator k evaluates itself):
   a. Determine: POₖ vs θₖ → gain/loss domain
   b. Select Model (8 or 9)
   c. Solve LP → get e^PO_{kk}
   d. Average: CE^PO_k = (1/n)[θₖ + ∑e^PO_{kj}]

5. For composite: CE^CO_k = α·CE^OO_k + (1-α)·CE^PO_k

6. Sort all DMUs by CE score (descending) → Final ranking
```

---

## BOUNDED RATIONALITY MECHANISMS

### Prospect Theory in Cross-Efficiency

The study embeds prospect theory (Kahneman & Tversky) into performance evaluation:

**When evaluating a peer below target (loss domain):**
- Peer's losses are amplified (\(\times \lambda = 2.25\))
- Evaluator perceives peer as worse than objective data suggests
- Models 6 & 7 encode this amplification

**When evaluating a peer above target (gain domain):**
- Peer's gains are not amplified
- Evaluator sees peer more "normally"
- Models 6 & 7 encode this symmetry breaking

**When evaluating oneself (self-interest):**
- Evaluator maximizes own gains (Model 8) or minimizes own losses (Model 9)
- Creates strategic behavior: focus on strengths if ahead, focus on excuses if behind
- Realistic representation of how managers actually behave

### Loss Aversion Effect

The coefficient \(\lambda = 2.25\) captures that humans feel losses 2.25× more intensely than equivalent gains. This is embedded in the loss function:

$$\text{Loss} = y - \lambda \cdot x$$

Loss-averse evaluators will strongly penalize peers underperforming relative to target.

---

## DATA REQUIREMENTS

### Inputs

- **DMU identifier** (employee ID, manager ID, team name)
- **Evaluation period** (start date, end date)
- **m input values** per DMU (resources, effort)
- **s output values** per DMU (results, impact)
- **Objective values** (OO, POₖ, α)

### Outputs

- **Self-evaluation efficiency** \(\theta_k\) for each DMU
- **Cross-efficiency scores** \(e_{jk}\) for each pair
- **Aggregate cross-efficiency** \(CE_j\) for each DMU
- **Final ranking** (rank, DMU, θ, CE, gap)
- **Interpretation insights** (gain/loss domain, performance status)

---

## CRITICAL ASSUMPTIONS

1. **Constant Returns to Scale (CRS):** All models assume linear input-output relationships.

2. **Organizational and Personal Objectives Aligned:** Both push DMU to improve efficiency (increase \(\theta\)).

3. **Weights are Endogenous:** Each DMU selects optimal weights; no external weighting imposed.

4. **Prospect Theory Parameters Fixed:** Uses published values (\(\alpha=0.88, \beta=0.88, \lambda=2.25\)) unless local behavioral data available.

5. **DMU Comparability:** All DMUs must be in same functional area with comparable inputs/outputs.

6. **Data Positivity:** All inputs and outputs must be positive (preprocess as needed).

---

## SOLVER REQUIREMENTS

LP solver must support:
- Linear programming with continuous variables
- Non-negativity constraints
- Equality and inequality constraints
- Objective function: minimize or maximize linear form
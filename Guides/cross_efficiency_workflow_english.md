# Cross-Efficiency Evaluation Workflow with Bounded Rationality

## PART 0: PRE-EVALUATION SETUP

### 0.1 Define Decision-Making Units (DMUs)

**What is a DMU?**
- In your system, a DMU is typically one **employee**, one **manager**, or one **team**.
- All DMUs must be comparable (e.g., all sales reps, all engineers, all managers).

### 0.2 Select Inputs and Outputs

**Definition:**
- **Input (x):** Resource consumed or effort expended by the DMU.  
  Examples: # of opportunities worked, hours spent, team headcount, salary cost.

- **Output (y):** Result or value created by the DMU.  
  Examples: revenue generated, deals closed, CSAT score, delivery rate.

**Rule of thumb:**
- Inputs should be "controllable" by the DMU (or at least measurable effort).
- Outputs should be "desired outcomes" (higher is better for most).

### 0.3 Data Collection and Validation

**Steps:**
1. Collect raw data for each DMU for each input/output over the evaluation period.
2. **Data preprocessing:**
   - Remove invalid data points (e.g., zero revenue with non-zero expenses).
   - Handle endogeneity (e.g., if "total profit" and "net profit" are collinear, keep only one).
   - Create derived outputs if needed (e.g., new product revenue / total revenue).
   - Standardize units (convert thousands to millions if mixing scales).
   - Handle negative values (e.g., standardize net profit to be all positive).

**Example result:**
```
        x₁(Opps) x₂(Hours) y₁(Revenue) y₂(Conv%) y₃(Retention%)
DMU1    120      180       45.5        38        92
```

---

## PART 1: SELF-EVALUATION (CCR MODEL)

### 1.1 Solve the CCR Model for Each DMU

**Purpose:** Calculate the baseline efficiency score (self-evaluation) for each DMU.

**CCR Model (Linear Programming):**

For each DMU \(k\), solve:

```
Maximize:  θₖ = (∑ᵣ uᵣₖ · yᵣₖ) / (∑ᵢ vᵢₖ · xᵢₖ)

Subject to:
  (∑ᵣ uᵣₖ · yᵣⱼ) / (∑ᵢ vᵢₖ · xᵢⱼ) ≤ 1   for all j = 1, ..., n
  uᵣₖ ≥ ε                                for all r (ε = infinitesimal, e.g., 0.0001)
  vᵢₖ ≥ ε                                for all i
```

**Rewritten in standard LP form:**

```
Maximize:  ∑ᵣ uᵣₖ · yᵣₖ

Subject to:
  ∑ᵢ vᵢₖ · xᵢₖ = 1                        (normalization)
  ∑ᵣ uᵣₖ · yᵣⱼ - ∑ᵢ vᵢₖ · xᵢⱼ ≤ 0   for all j
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε
```

**Outputs from this step:**
- Optimal weights: \(u^*ₖ = (u₁ₖ, u₂ₖ, ..., uₛₖ)\) (output weights)  
  and \(v^*ₖ = (v₁ₖ, v₂ₖ, ..., vₘₖ)\) (input weights)
- Self-evaluation efficiency: \(\theta_k = \sum_r u^*_{rk} \cdot y_{rk} / \sum_i v^*_{ik} \cdot x_{ik}\)

**Intuition:**
- The LP solver finds weights that make DMU \(k\) look as efficient as possible.
- The constraint ensures that no DMU looks > 100% efficient under those weights.
- Different DMUs will have different optimal weights (weight flexibility).

**Example (Sales Team, Hypothetical):**

```
DMU1 (Alice):
  Optimal weights found: u₁ = 0.015 ($/revenue), v₁ = 0.008 (#opps), v₂ = 0.003 (hours)
  Self-evaluation: θ₁ = (0.015 × 45.5) / (0.008 × 120 + 0.003 × 180) 
                      = 0.6825 / 1.02 = 0.6691
```
### 1.2 Interpret Self-Evaluation Scores

- **θₖ = 1.0** → DMU is on the efficiency frontier (Pareto-optimal).
- **θₖ < 1.0** → DMU is inefficient; could improve by reducing inputs or increasing outputs.
- Higher θₖ → Better self-evaluated performance.

---

## PART 2: DEFINE MANAGEMENT OBJECTIVES (Reference Points)

### 2.1 Organizational Objective (OO)

**Definition:**  
A **company-wide target efficiency level** derived from policy and DMU benchmark data.

**How to set it:**
1. Calculate all self-evaluation efficiencies θ₁, θ₂, ..., θₙ.
2. Compute statistics: mean, median, percentiles.
3. Set OO as a specific target level (e.g., OO = 0.7, 0.75, 0.8, 0.9, 1.0).
   - If OO = 0.7, you're saying "we want all teams to be at least 70% efficient."
   - OO should be *achievable but challenging* (e.g., 75th percentile of current performance).

**Formula:**
```
OO ∈ [0, 1]  (typically set between the worst and best current efficiency)
```

**Example:**
- Current efficiencies: [0.67, 0.35, 0.89, 0.92, 0.55, ...]
- Mean = 0.68, Median = 0.75
- Set **OO = 0.75** (median target) or **OO = 0.80** (ambitious).

### 2.2 Personal Objective (POₖ)

**Definition:**  
An **individual DMU target** set based on the DMU's current performance and growth aspirations.

**How to set it:**
1. For each DMU \(k\), define a personal improvement goal.
2. PO_k is typically **higher than current θₖ** (aspirational).
3. Can be set by:
   - Manager-employee negotiation (e.g., "Alice, your goal for Q2 is 0.78").
   - Relative to role level (e.g., "new hires aim for 0.65, seniors for 0.85").
   - Fixed increment (e.g., "everyone aims to improve 5 percentage points from current").

**Formula:**
```
POₖ ∈ [θₖ, 1.0]  (equal to or higher than current efficiency)
```

**Example:**
```
DMU1 (Alice):     θ₁ = 0.67  →  PO₁ = 0.75

```

### 2.3 Composite Objective (COₖ)

**Definition:**  
A **weighted combination** of organizational and personal objectives.

**Formula:**
```
COₖ = α · OO + (1-α) · POₖ

where α ∈ [0, 1] is a weighting parameter
  α = 0   → pure personal objectives (bottom-up)
  α = 0.5 → equal weight to org & personal (balanced)
  α = 1   → pure organizational objectives (top-down)
```

**Example (α = 0.5, balanced):**
```
DMU1: CO₁ = 0.5 × 0.75 + 0.5 × 0.75 = 0.75
```
---

## PART 3: DEFINE GAIN/LOSS BASED ON OBJECTIVES

### 3.1 Compare Self-Evaluation to Objective

**For each DMU j facing objective MO:**

```
if θⱼ < MO:
    Status = "LOSS DOMAIN"  (underperforming)
    xⱼ = input redundancy (wasted inputs)
    yⱼ = output deficiency (missing outputs)
    Loss = Sⱼ = yⱼ - λ · xⱼ  (loss is amplified by λ)

else (θⱼ ≥ MO):
    Status = "GAIN DOMAIN"  (meeting or exceeding)
    xⱼ = input savings (efficient use)
    yⱼ = output profit (extra results)
    Gain = Sⱼ = yⱼ - xⱼ  (gain is non-amplified)
```

### 3.2 Prospect Theory Parameters

**Loss aversion coefficient:**
```
λ = 2.25  (research by Tversky & Kahneman)
```

This means losses are perceived 2.25× more painful than equivalent gains are pleasant.

**Value function concavity/convexity:**
```
α = 0.88  (curvature in loss domain)
β = 0.88  (curvature in gain domain)
```

### 3.3 Compute Gain/Loss Quantities

**Loss Domain (when threshold MO > efficiency θⱼ):**

```
xⱼ (input redundancy) = (MO - ∑ᵣ uᵣ·yᵣⱼ / ∑ᵢ vᵢ·xᵢⱼ) × (sum of weighted inputs)

yⱼ (output deficiency) = MO × (sum of weighted inputs) - ∑ᵣ uᵣ·yᵣⱼ
```

**Gain Domain (when efficiency θⱼ ≥ MO):**

```
xⱼ (input savings) = ∑ᵢ vᵢ·xᵢⱼ - (∑ᵣ uᵣ·yᵣⱼ / MO)

yⱼ (output profit) = ∑ᵣ uᵣ·yᵣⱼ - MO × (sum of weighted inputs)
```

**Intuition:**
- If you're below the target, you're "wasting inputs" and "missing outputs" (both bad).
- If you're above the target, you're "saving inputs" and "generating extra outputs" (both good).

---

## PART 4: PEER EVALUATION (CROSS-EFFICIENCY WITH OBJECTIVES)

### 4.1 Organizational Objective Path

**For each pair (j, k) where k is the evaluator:**

**Step 4.1a: Check if target is achievable**

```
if OO ≤ θⱼ (j meets the organizational objective):
    Peer k evaluates j BENEVOLENTLY (Model 6 - Minimize Loss of j)
    Objective: Minimize Sⱼ¹ = yⱼ¹ - xⱼ¹  (suppress j's strengths)
    
else (OO > θⱼ, j is below target):
    Peer k evaluates j AGGRESSIVELY (Model 7 - Maximize Loss of j)
    Objective: Maximize Sⱼ² = yⱼ² - xⱼ²  (amplify j's weaknesses)
```

**Step 4.1b: Solve the cross-efficiency LP model**

**Model 6 (Benevolent evaluation when OO ≤ θⱼ):**

```
Minimize:  Sⱼ¹ = yⱼ¹ - λ·xⱼ¹

Subject to:
  ∑ᵣ uᵣₖ·yᵣⱼ - yⱼ¹ = OO × ∑ᵢ vᵢₖ·xᵢⱼ + xⱼ¹   (gain vs org objective)
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ                (k's self-eval constraint)
  ∑ᵣ uᵣₖ·yᵣₜ ≤ ∑ᵢ vᵢₖ·xᵢₜ   for all t ≠ k      (all others feasible)
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε
  yⱼ¹ ≥ 0,  xⱼ¹ ≥ 0
```

**Model 7 (Aggressive evaluation when OO > θⱼ):**

```
Maximize:  Sⱼ² = yⱼ² - λ·xⱼ²

Subject to:
  ∑ᵣ uᵣₖ·yᵣⱼ + yⱼ² = OO × (∑ᵢ vᵢₖ·xᵢⱼ + xⱼ²)   (loss vs org objective)
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ                (k's self-eval constraint)
  ∑ᵣ uᵣₖ·yᵣₜ ≤ ∑ᵢ vᵢₖ·xᵢₜ   for all t ≠ k      (all others feasible)
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε
  yⱼ² ≥ 0,  xⱼ² ≥ 0
```

**Output:**  
Cross-efficiency score when k evaluates j under org objective:
```
e⁻ᴼᴼ_{jk} = (∑ᵣ u*ᵣₖ·yᵣⱼ) / (∑ᵢ v*ᵢₖ·xᵢⱼ)
```

### 4.2 Personal Objective Path

**For evaluator k evaluating itself under personal objective POₖ:**

**Step 4.2a: Check threshold**

```
if POₖ ≤ θₖ (k meets its own personal objective):
    Model 8: Maximize gain (yₖ¹ - xₖ¹)
    
else (POₖ > θₖ, k is below own target):
    Model 9: Minimize loss (yₖ² - xₖ²)
```

**Step 4.2b: Solve LP**

**Model 8 (Gain domain, PO_k ≤ θ_k):**

```
Maximize:  Sₖ¹ = yₖ¹ - xₖ¹

Subject to:
  ∑ᵣ uᵣₖ·yᵣₖ - yₖ¹ = POₖ × (∑ᵢ vᵢₖ·xᵢₖ - xₖ¹)   (savings vs personal objective)
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ                  (k's self-eval)
  ∑ᵣ uᵣₖ·yᵣⱼ ≤ ∑ᵢ vᵢₖ·xᵢⱼ   for all j ≠ k      (all others feasible)
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε
  yₖ¹ ≥ 0,  xₖ¹ ≥ 0
```

**Model 9 (Loss domain, PO_k > θ_k):**

```
Minimize:  Sₖ² = yₖ² - λ·xₖ²

Subject to:
  ∑ᵣ uᵣₖ·yᵣₖ + yₖ² = POₖ × (∑ᵢ vᵢₖ·xᵢₖ + xₖ²)   (deficiency vs personal objective)
  ∑ᵣ uᵣₖ·yᵣₖ = θₖ × ∑ᵢ vᵢₖ·xᵢₖ                  (k's self-eval)
  ∑ᵣ uᵣₖ·yᵣⱼ ≤ ∑ᵢ vᵢₖ·xᵢⱼ   for all j ≠ k      (all others feasible)
  uᵣₖ ≥ ε,  vᵢₖ ≥ ε
  yₖ² ≥ 0,  xₖ² ≥ 0
```

**Output:**  
Cross-efficiency score of k evaluating itself under personal objective:
```
e⁻ᴾᴼ_{kk} = (∑ᵣ u*ᵣₖ·yᵣₖ) / (∑ᵢ v*ᵢₖ·xᵢₖ)
```

### 4.3 Composite Objective Path

**Compute weighted average:**

```
For each DMU k:
  CE⁻ᶜᴼ_k = α · CE⁻ᴼᴼ_k + (1-α) · CE⁻ᴾᴼ_k
  
where:
  CE⁻ᴼᴼ_k = average of org-objective cross-efficiencies for k
  CE⁻ᴾᴼ_k = average of personal-objective cross-efficiencies for k
  α = weight on org (typically 0.5 for balance)
```

---

## PART 5: AGGREGATE CROSS-EFFICIENCY SCORES

### 5.1 Compute Average Cross-Efficiency for Each DMU

**Definition:**  
For each DMU j, aggregate all peer evaluations plus self-evaluation.

**Formula (for organizational objective OO):**

```
CE⁻ᴼᴼ_j = (1/n) × [θⱼ + ∑_{k≠j} e⁻ᴼᴼ_{jk}]

where:
  θⱼ = self-evaluation (from CCR)
  e⁻ᴼᴼ_{jk} = cross-efficiency when k evaluates j under OO
  n = total number of DMUs
```

**Intuition:**
- Each DMU gets evaluated by (n-1) peers + itself.
- The average smooths out quirky peer evaluations.
- DMUs that perform well under multiple peers' "óculos" (weights) score higher.

### 5.2 Final Ranking

**Steps:**
1. Compute CE scores for all DMUs under your chosen objective (OO, PO, or CO).
2. **Sort in descending order** by CE score.
3. Assign rank 1 (best) to highest CE, rank n (worst) to lowest CE.

**Example output table:**

```
Rank  DMU    θ (Self)   CE Score   Status
─────────────────────────────────────────
  1   Alice   0.67      0.72       ★★★ High performer
  2   Charlie 0.89      0.71       ★★★ Consistent
  3   Bob     0.35      0.48       ★☆☆ Needs improvement
  4   Diana   0.55      0.42       ★☆☆ Below target
```

---

## PART 6: INTERPRET RESULTS (Bounded Rationality Insights)

### 6.1 What Does Cross-Efficiency Reveal?

**Self-evaluation vs Cross-evaluation gap:**

```
If θⱼ > CE_j:
  → DMU j chose weights that favor itself (self-interested).
  → Other peers don't rate j as highly.
  → Suggests potential bias in j's weight selection.

If θⱼ ≈ CE_j:
  → DMU j's weights are broadly accepted by peers.
  → More "fair" or "robust" evaluation.
  → Lower risk of gaming the system.

If θⱼ < CE_j:
  → Rare, but could indicate j undervalued itself.
  → Peers see j's strengths better than j does itself.
```

### 6.2 Impact of Objectives on Ranking

**Organizational objective impact:**

- DMUs **below OO** face **aggressive evaluation** (peers magnify weaknesses).
  - Large ranking swings as OO changes.
  - Indicates "problem areas" needing attention.

- DMUs **above OO** receive **benevolent evaluation** (peers suppress downsides).
  - Stable rankings across different OO levels.
  - Indicates "solid performers" meeting bar.

**Personal objective impact:**

- DMUs with **realistic PO** (close to current θ) show stable CE.
- DMUs with **ambitious PO** (far above θ) show more variation.
  - Depends on whether they're in gain or loss domain relative to PO.

**Composite objective:**

- Balances org expectations (top-down) with individual ambitions (bottom-up).
- More flexible and psychologically realistic.

---

## PART 7: IMPLEMENTATION CHECKLIST

### Pre-Evaluation
- [ ] Define DMU population (e.g., all sales reps, all engineers).
- [ ] Select 2–5 inputs (effort/resources).
- [ ] Select 2–5 outputs (results/value).
- [ ] Collect and validate data.
- [ ] Preprocess data (remove invalids, handle endogeneity, standardize).

### Self-Evaluation
- [ ] Solve CCR model for each DMU.
- [ ] Record optimal weights (u*, v*).
- [ ] Record self-evaluation efficiency (θ).
- [ ] Check: Are any DMUs at θ = 1.0? (frontier units)

### Objectives
- [ ] Set Organizational Objective (OO) based on benchmark or policy.
- [ ] Set Personal Objectives (PO_k) for each DMU (via survey, mgmt, or formula).
- [ ] Decide composite weighting (α). Default: α = 0.5.

### Cross-Efficiency (OO)
- [ ] For each DMU k:
  - [ ] For each peer j:
    - [ ] Compare: OO vs θⱼ.
    - [ ] Select Model 6 or 7 accordingly.
    - [ ] Solve LP to get e⁻ᴼᴼ_{jk}.
  - [ ] Average: CE⁻ᴼᴼ_k = mean of {θₖ, e⁻ᴼᴼ_{k1}, e⁻ᴼᴼ_{k2}, ...}.

### Cross-Efficiency (PO)
- [ ] For each DMU k:
  - [ ] Compare: POₖ vs θₖ.
  - [ ] Select Model 8 or 9.
  - [ ] Solve LP to get e⁻ᴾᴼ_{kk}.
  - [ ] Average: CE⁻ᴾᴼ_k = mean of {θₖ, e⁻ᴾᴼ_{k1}, e⁻ᴾᴼ_{k2}, ...}.

### Cross-Efficiency (CO)
- [ ] CE⁻ᶜᴼ_k = α · CE⁻ᴼᴼ_k + (1-α) · CE⁻ᴾᴼ_k.

### Ranking & Reporting
- [ ] Sort all DMUs by final CE score (descending).
- [ ] Generate ranking table with θ, CE, rank, status.
- [ ] Identify outliers: large gaps between θ and CE.
- [ ] Prepare insights for manager review.

---

## PART 8: COMMON IMPLEMENTATION QUESTIONS

### Q: What LP solver should I use?

**A:** Any standard LP solver works:
- **Python:** SciPy (scipy.optimize.linprog), PuLP, Pyomo.
- **R:** lpSolve.
- **Commercial:** CPLEX, Gurobi (faster for large datasets).
- **Online tools:** LibreOffice Calc Solver, Excel Solver.

### Q: Should I loop Models 6/7 or solve all at once?

**A:** Loop is clearest for implementation:
```
for each DMU j:
    if objective >= theta[j]:
        solve Model 6 (minimize)
    else:
        solve Model 7 (maximize)
```

### Q: What if a DMU is on the frontier (θ = 1.0)?

**A:** Still valid. The LP will find the weights that k would use. Frontier units often have stable CE close to 1.0.

### Q: How many objective levels should I test (e.g., OO1=0.4, OO2=0.5, ...)?

**A:** 5–7 levels typically suffice to show trend. Example:
```
OO ∈ {0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0}
```
This shows how ranking shifts as you tighten the target.

### Q: Can I mix DMUs from different departments?

**A:** Technically yes, but **not recommended** for first implementation.
- Reason: inputs/outputs may be incomparable across functions (e.g., sales ops vs engineering).
- Better: run separate DEA per department, then roll up if needed.

### Q: What is the "psychological parameter" λ = 2.25?

**A:** It's from behavioral economics. Loss aversion: people feel 2.25× more pain from a loss of $100 than joy from a gain of $100.  
Use the published value (λ = 2.25, α = β = 0.88) unless you have local behavioral data.

---

## PART 9: EXAMPLE WALKTHROUGH (3 DMUs, 2 Inputs, 2 Outputs)

### Data

```
     x₁     x₂     y₁     y₂
DMU1  10    200     50     80
DMU2   8    150     40     60
DMU3  12    180     55     90
```

### Step 1: Solve CCR for each DMU

**DMU1 CCR:**
```
Max: u₁·50 + u₂·80
s.t.
  v₁·10 + v₂·200 = 1
  u₁·50 + u₂·80 ≤ v₁·10 + v₂·200  (for DMU1)
  u₁·40 + u₂·60 ≤ v₁·8 + v₂·150   (for DMU2)
  u₁·55 + u₂·90 ≤ v₁·12 + v₂·180  (for DMU3)
  u₁, u₂, v₁, v₂ ≥ ε
```

**Hypothetical solution:**
```
u₁ = 0.8, u₂ = 0.5
v₁ = 0.01, v₂ = 0.004
θ₁ = (0.8·50 + 0.5·80) / (0.01·10 + 0.004·200)
   = (40 + 40) / (0.1 + 0.8)
   = 80 / 0.9 ≈ 0.889
```

**Similarly solve for DMU2 and DMU3.**

### Step 2: Set Objectives

```
OO = 0.80  (target efficiency)
PO₁ = 0.90
PO₂ = 0.75
PO₃ = 0.95
α = 0.5 (balanced)
```

### Step 3: Organizational Cross-Efficiency (OO=0.80)

**DMU1 evaluates DMU2:**
```
θ₂ = 0.75 < OO = 0.80  → Use Model 7 (Aggressive)

Maximize: S₂² = y₂² - λ·x₂²

s.t.
  u₁·40 + u₂·60 + y₂² = 0.80·(v₁·8 + v₂·150 + x₂²)
  u₁·50 + u₂·80 = θ₁·(v₁·10 + v₂·200)  [DMU1 self-eval constraint]
  u₁·55 + u₂·90 ≤ v₁·12 + v₂·180       [DMU3 feasible]
  ...

Solution: e⁻ᴼᴼ_{21} = (u*₁·40 + u*₂·60) / (v*₁·8 + v*₂·150)  ≈ 0.72
```

**DMU1 evaluates DMU3:**
```
θ₃ = 0.95 > OO = 0.80  → Use Model 6 (Benevolent)

Minimize: S₃¹ = y₃¹ - x₃¹

... (similar setup)

Solution: e⁻ᴼᴼ_{31} ≈ 0.88
```

### Step 4: Aggregate

```
CE⁻ᴼᴼ₁ = (1/3) × [0.889 + e⁻ᴼᴼ_{12} + e⁻ᴼᴼ_{13}]
       = (1/3) × [0.889 + 0.80 + 0.78]
       ≈ 0.823

CE⁻ᴼᴼ₂ = (1/3) × [0.75 + e⁻ᴼᴼ_{21} + e⁻ᴼᴼ_{23}]
       = (1/3) × [0.75 + 0.72 + 0.70]
       ≈ 0.723

CE⁻ᴼᴼ₃ = (1/3) × [0.95 + e⁻ᴼᴼ_{31} + e⁻ᴼᴼ_{32}]
       = (1/3) × [0.95 + 0.88 + 0.92]
       ≈ 0.917
```

### Step 5: Ranking

```
Rank  DMU  CE Score  Status
───────────────────────────
  1   DMU3  0.917    ★★★ Excellence
  2   DMU1  0.823    ★★☆ Good
  3   DMU2  0.723    ★☆☆ Needs work
```

---
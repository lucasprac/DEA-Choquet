# UX Guides - Engine-Optimized Specifications

## Overview

Based on the Hybrid - Performance Evaluation Model's technical capabilities and constraints, this document provides optimized UX specifications that align with the Choquet DEA + 9-Box Grid mathematical engine.

---

## Engine Architecture Understanding

### Core Components (From Documentation)

| Component | Type | Purpose | Constraint |
|-----------|------|---------|-----------|
| **Choquet Integral DEA** | Mathematical Engine | Captures input/output interactions using Möbius Transform | Max 10 input/output variables |
| **Cross-Efficiency Matrix** | Calculation Method | Eliminates self-evaluation bias by averaging peer evaluations | Runs solver n times (once per DMU) |
| **Weight Balance (θ)** | Constraint | Prevents ignoring unfavorable variables via Shapley values | Typical θ ≈ 3.0 (prevents unbalanced weighting) |
| **9-Box Grid Matrix** | Classification | Maps Efficiency × Effectiveness to strategic profiles | Uses terciles (33rd/66th percentiles) of population |
| **Dynamic Effectiveness** | User Input | Organizational goal achievement (e.g., Revenue, Volume) | User-defined KPI, not calculated by engine |

---

## UX Implications by Engine Feature

### 1. Framework Configuration (Max 10 Variables)

**Constraint**: Computational complexity grows quadratically with variable count (C_n^2 combinations for 2-additive pairs).

**UX Impact**:
- **Framework Creation**: Warn admin if > 10 indicators selected
  - Tooltip: "Best performance with 5-8 indicators. Max 10. Keep inputs/outputs balanced."
  - Validation: Block save if > 10 indicators
  
- **Indicator Selection UI**:
  - Show current count: "5/10 Indicators selected"
  - Highlight recommended range: 5-8 (green), 9-10 (yellow), >10 (red)
  - Provide template frameworks pre-configured (Sales: 7 indicators, Logistics: 8 indicators, etc.)

- **Admin Guidance**:
  - In Settings: "Framework Optimization Guide"
    - "Too many indicators dilute the analysis"
    - "Recommended: 5-8 inputs/outputs for clear insights"
    - "Current frameworks: [list count per framework]"

### 2. Data Quality - Positive Values Only

**Constraint**: Choquet DEA requires strictly positive inputs. Zero values must be pre-processed (add small ε).

**UX Impact**:
- **Data Validation Warning**:
  - During cycle setup: "Checking data quality..."
  - Alert if zeros detected: "⚠️ Found 23 zero values in 'Calls' indicator. Will be converted to 0.001 for analysis."
  - Option: "Allow preprocessing" or "Edit data"

- **Indicator Configuration**:
  - Type field must allow: Quantitative (0.001 min) or Qualitative (scale 1-5)
  - Min value always > 0 (enforce UI minimum)
  - Tooltip: "DEA requires positive values. Zero values auto-converted."

- **Import/Export CSV**:
  - Import validation: Flag zero values before processing
  - Export includes note: "Zero values appear as 0.001 (preprocessed)"

- **Evaluation Matrix UI**:
  - Numeric inputs: Min value = 0.1 (or framework-specific minimum)
  - Visual indicator: "⚠️ Values < 0.001 may affect analysis"

### 3. Computation Time (5 Seconds for 1000+ Employees)

**Constraint**: DEA solver iterates n times. Linear scaling up to ~5 sec for 1000 DMUs.

**UX Impact**:
- **Cycle Launch**:
  - Display time estimate: "This will run ~2.5 seconds for 500 employees"
  - Progress bar during evaluation: "Running mathematical analysis... Step 3 of 5"
  - Background processing option: "Run in background, notify when complete"

- **Results Generation**:
  - If > 500 employees, show: "⏱️ Generating results (typically 2-5 seconds)..."
  - Allow cancel if needed (revert to previous results)
  - Store computation metadata: "Analysis run at 2:45 PM, 1.8 seconds"

- **Bulk Operations**:
  - Batch import: "Processing 1000 employees... ~5 seconds"
  - Export results: "Generating reports... ~3 seconds"

### 4. Efficiency Score & Cross-Efficiency

**Constraint**: Final score = average of peer evaluations (eliminates benevolence bias).

**UX Impact**:
- **Results Display**:
  - Show both:
    - **Self-Evaluation** (DMU's own chosen weights): "If all weights were optimal for you"
    - **Cross-Efficiency Score** (peer average): "✓ Official score (based on peer comparison)"
  - Transparency: "Your score reflects how you perform using others' weight frameworks"

- **Visualization**:
  - Bar chart comparing: "Self vs. Peer Average"
  - If gap > 0.2: Highlight: "Your process choices differ from peers"
  - Tooltip: "Large gaps indicate unique workflow patterns"

- **Employee Experience**:
  - Explain in tooltip: "Your score is based on how well you perform using your peers' evaluation standards, eliminating bias."

### 5. Weight Balance Constraint (Shapley Values & θ ≈ 3.0)

**Constraint**: Prevents ignoring unfavorable variables. Max Shapley / Min Shapley ≤ 3.0.

**UX Impact**:
- **Admin Insight Dashboard**:
  - Add section: "Indicator Importance Distribution"
  - Show Shapley values for each indicator as:
    - Bar chart: "Importance Ratio" (visual fairness)
    - Highlight if any indicator near 0: ⚠️ "Close to being ignored"
    - Explain: "Weight balance ensures no variable is neglected"

- **Interaction Weights Display**:
  - In Results → Detailed Analysis:
    - "Input Synergies Detected:"
      - "Visits × Sales: +0.15 (positive synergy - they reinforce each other)"
      - "Time × Experience: -0.08 (negative - redundant effects)"
    - Visualize as network: Nodes = indicators, edges = interaction weights (thickness = magnitude)

- **Admin Configuration**:
  - Advanced setting: "Weight Balance Strictness (θ)"
    - Slider: 1.5 (strict, forces equality) → 5.0 (permissive)
    - Default: 3.0 (recommended)
    - Tooltip: "Higher θ allows more variation in importance; lower forces fairness"

### 6. 9-Box Grid Classification

**Constraint**: Uses terciles (33rd/66th percentiles) of population, not fixed thresholds.

**UX Impact**:
- **Dynamic Thresholds**:
  - Results page shows: "Population distribution: Low (bottom 33%), Medium (33-66%), High (top 33%)"
  - Admin can see actual thresholds: "Low: 0-6.2 | Medium: 6.2-7.8 | High: 7.8-10"
  - Explains why threshold changes with population: "Relative to your current group"

- **9-Box Grid UI**:
  - **Y-axis (Effectiveness)**: User-defined KPI terciles
  - **X-axis (Efficiency)**: Calculated DEA efficiency terciles
  - Each cell shows:
    - **Count**: "3 employees"
    - **Profile name**: "★ Star / Benchmark" or "Workhorse" or "Underperformer"
    - **Action recommendation**: "Ready to scale" or "Needs training" or "Restructure"
  - Color coding: Green (high potential) → Yellow (development needed) → Red (critical)

- **Individual Employee Card**:
  - Display: "Position: Strong Performer (Medium Efficiency, High Effectiveness)"
  - Show on grid: Plotted point with name, hoverable for details
  - Explanation: "You're in the middle tier for efficiency but delivering high results"

- **Trends Over Cycles**:
  - Track movement: "Last cycle: Core Player → This cycle: High Potential ✓"
  - Visualize as scatter: Each cycle a different colored point on 9-box

---

## Optimized Admin Workflows

### Framework Creation (Engine-Aware)

**Current Flow** → **Optimized Flow**

```
Before:
Admin adds unlimited indicators → Later discovers performance issues

After (Engine-Optimized):
1. Framework template selection
   "Sales Performance Framework (Recommended 7 indicators)"
   
2. Indicator selection with constraint display
   ✓ Calls Made (Quantitative, Min: 1)
   ✓ Conversion Rate (Quantitative, Min: 0.001)
   ✓ Revenue Generated (Quantitative, Min: 1)
   ✓ Customer Satisfaction (Quantitative, Min: 1-10)
   ✓ Response Time (Quantitative, Min: 0.1 hrs)
   ✓ Deals Closed (Quantitative, Min: 1)
   ✓ Retention Rate (Quantitative, Min: 0.001)
   
   Status: 7/10 indicators (Optimal range) ✓
   
3. Preview synergies
   "System will analyze these interactions:"
   - Calls × Conversion Rate (likely positive)
   - Revenue × Deals Closed (likely dependent)
   - Customer Satisfaction × Retention (likely positive)
   
4. Confirm & Save
```

---

### Cycle Evaluation (DEA-Optimized UI)

**Before**: Generic input form

**After**: Smart form with engine context

```
CYCLE EVALUATION - Employee: John Smith
Framework: Sales Performance (7 indicators)

Evaluation Status:
Indicator               Value    Expected Range    Context
─────────────────────────────────────────────────────────
Calls Made             145       [50-300]          ✓ Within range
Conversion Rate        0.18      [0.05-0.35]       ✓ Solid
Revenue Generated      $45,000   [$20K-$100K]      ✓ Strong
Customer Satisfaction  8.5/10    [1-10]            ✓ High
Response Time          2.1 hrs   [0.5-8 hrs]       ✓ Good
Deals Closed          12         [5-30]             ✓ Solid
Retention Rate         0.92      [0.001-1.0]       ✓ Excellent

Analysis Preview (Real-time):
• Synergy detected: Calls × Conversion = Strong
• Likely ranking: Top 25% on efficiency
• Classification: Likely "High Potential" or "Star"

[Save]  [Save & Next]  [Submit Evaluation]
```

---

### Results Dashboard (9-Box + Engine Insights)

**Before**: Generic score + list

**After**: Actionable 9-box with interaction insights

```
CYCLE RESULTS - Annual 2024 (210 employees evaluated)

┌─────────────────────────────────────────────────────┐
│ 9-BOX GRID: Efficiency × Effectiveness              │
│                                                      │
│ HIGH    ┌──────────┬──────────┬──────────┐          │
│ EFFEC   │ Workhorse│  Strong  │   ★Star  │ 12 people│
│ TIVE    │ 8 people │ 34 people│(Role Models)       │
│ NESS    ├──────────┼──────────┼──────────┤          │
│         │ Inconsist│ Core     │ High     │ 67 people│
│ MED     │ 15 people│ Player   │Potential │          │
│         │          │ 52 people│ 0 people │          │
│         ├──────────┼──────────┼──────────┤          │
│ LOW     │ Critical │Underper  │ Enigma   │ 61 people│
│ EFFEC   │Bottleneck│ former   │Misaligned│          │
│ TIVE    │ 3 people │ 25 people│ 3 people │          │
│         └──────────┴──────────┴──────────┘          │
│                                                      │
│ Distribution: Healthy spread. Minor concerns.       │
└─────────────────────────────────────────────────────┘

TERCILE THRESHOLDS (Based on population):
Efficiency:     Low: 0.00-6.21 | Medium: 6.21-7.44 | High: 7.44-10.0
Effectiveness:  Low: 0.00-0.52 | Medium: 0.52-0.78 | High: 0.78-1.00

KEY INSIGHTS (From Engine):

✓ INPUT SYNERGIES DETECTED:
  • Calls × Conversion Rate: +0.18 (strong synergy)
    "Agents who make more calls convert more efficiently"
  • Revenue × Deals Closed: +0.12 (positive synergy)
    "These metrics reinforce each other"
  
⚠️ REDUNDANCIES FOUND:
  • Customer Satisfaction × Retention: -0.08 (slight redundancy)
    "Consider: Do you need both metrics for evaluation?"

📊 EFFICIENCY LEADERS (Cross-Efficiency Top 5):
1. Sarah Chen - 9.2/10 (★ Star)
2. Michael Chang - 8.9/10 (★ Star)
3. Jennifer Lee - 8.7/10 (High Potential)
4. David Brown - 8.4/10 (Strong Performer)
5. Lisa Wong - 8.3/10 (Strong Performer)

⚡ OUTLIERS:
• The Enigmas: 3 employees highly efficient but low results
  Action: Review market conditions or role fit
• Critical Bottlenecks: 3 employees high cost, no results
  Action: Immediate intervention needed

[View Individual Profiles]  [Compare Across Cycles]  [Export]
```

---

## Data Model Optimization

### Indicator Schema (Engine-Aware)

```json
{
  "indicator": {
    "id": "ind_123",
    "name": "Calls Made",
    "framework_id": "fw_sales",
    "type": "quantitative",
    "unit": "calls",
    "min_value": 1,                    // Min allowed (> 0 always)
    "max_value": 500,                  // Target max
    "is_input": true,                  // vs output
    "is_effectiveness": false,         // vs efficiency
    "scaling": "linear",               // vs log, categorical
    "preprocessing": {
      "handle_zeros": "add_epsilon",   // Convert 0 → 0.001
      "outlier_method": "none"         // vs winsorize, remove
    },
    "description": "Number of outbound calls made",
    "interaction_hint": {
      "synergies_with": ["Conversion Rate"],  // Expected positive
      "redundancies_with": []                  // Expected negative
    }
  }
}
```

### Evaluation Schema (Engine-Aware)

```json
{
  "evaluation": {
    "id": "eval_456",
    "cycle_id": "cyc_789",
    "employee_id": "emp_123",
    "status": "completed",
    "created_at": "2024-01-28T10:00:00Z",
    "submitted_at": "2024-01-28T10:15:00Z",
    "scores": {
      "calls_made": 145,
      "conversion_rate": 0.18,
      "revenue": 45000,
      // ... all indicator values (must be > 0)
    },
    "data_quality": {
      "all_positive": true,
      "zeros_found": 0,
      "values_below_epsilon": false
    }
  }
}
```

### Results Schema (Engine-Output Aware)

```json
{
  "cycle_results": {
    "id": "cyc_789",
    "status": "completed",
    "computation_time_ms": 1843,
    "efficiency_scores": {
      "emp_123": {
        "self_evaluation": 0.87,        // DMU's own optimal
        "cross_efficiency": 0.82,       // ← Official score
        "percentile": 0.68
      }
    },
    "shapley_values": {
      "calls_made": 0.35,
      "conversion_rate": 0.42,
      "revenue": 0.28,
      // ... importance weights
      "balance_ratio": 1.5  // max/min, < 3.0 ✓
    },
    "interaction_weights": {
      "calls_made_x_conversion": +0.18,
      "revenue_x_deals": +0.12,
      "satisfaction_x_retention": -0.08
    },
    "tercile_thresholds": {
      "efficiency": [6.21, 7.44],
      "effectiveness": [0.52, 0.78]
    },
    "nine_box_matrix": {
      "high_high": {
        "count": 12,
        "profile": "Star",
        "employees": ["emp_001", "emp_002", ...]
      },
      // ... all 9 cells
    },
    "population_stats": {
      "total_dmus": 210,
      "mean_efficiency": 7.14,
      "std_efficiency": 0.89
    }
  }
}
```

---

## Performance Optimization Strategies

### Frontend Optimizations

1. **Framework Validation** (Real-time)
   ```javascript
   // Warn if > 8 indicators
   const validateFramework = (indicators) => {
     if (indicators.length > 8) {
       return {
         level: 'warning',
         message: `${indicators.length} indicators detected. Optimal range: 5-8. Performance may degrade.`
       }
     }
   }
   ```

2. **Data Preprocessing** (On Import)
   ```javascript
   // Auto-convert zeros to epsilon
   const preprocessValues = (values) => {
     return values.map(v => v === 0 ? 0.001 : v)
   }
   ```

3. **Async DEA Calculation** (Background)
   ```javascript
   // Don't block UI during 5-second DEA run
   const runDEA = async (cycleId) => {
     showProgressBar("Running analysis...")
     const results = await api.post(`/api/cycles/${cycleId}/evaluate`)
     // Store results + notify user
   }
   ```

### Backend Optimizations

1. **Limit Solver Iterations**
   - Only run for non-zero evaluations
   - Cache Cross-Efficiency matrix if re-running
   - Option: Approximate for very large datasets (> 2000 DMUs)

2. **Data Validation Pipeline**
   ```python
   # FastAPI validation
   @app.post("/api/cycles/{id}/evaluate")
   async def run_dea(cycle_id: str):
       # 1. Validate all values > 0
       # 2. Check indicator count < 10
       # 3. Run solver (n iterations)
       # 4. Calculate cross-efficiency
       # 5. Compute terciles + 9-box
       # 6. Store results
   ```

3. **Caching Strategy**
   - Cache tercile thresholds (change rarely)
   - Cache Shapley values per framework
   - Invalidate on new evaluations only

---

## Recommendations by Phase

### Phase 2 (Admin Essentials)

✓ **Implement**:
- Framework builder with 10-variable limit & warning
- Indicator type selection (quantitative with min > 0)
- Data quality checks (zero detection, preprocessing)

⊘ **Defer**:
- Interaction weight visualization
- Shapley value display
- Detailed synergy analysis

### Phase 3 (Results & DEA)

✓ **Implement**:
- 9-box grid with dynamic terciles
- Cross-efficiency score display
- Basic synergy detection (interaction weights visualization)
- Employee classification (Star, Workhorse, etc.)

⊘ **Defer**:
- Advanced network visualization of interactions
- Predictive analytics (if scale changes, what happens?)

### Phase 4 (Polish)

✓ **Implement**:
- Full interaction weight network graph
- Shapley value importance bars
- Detailed "Why am I in this box?" explanations
- Anomaly detection and alerts

---

## Key UX Principles (Engine-Aligned)

1. **Constraints as Features**
   - Max 10 variables → "Keep frameworks focused"
   - Positive values only → "Ensure data quality"
   - 5-second compute → "Real-time results"

2. **Transparency First**
   - Show Cross-Efficiency vs Self-Evaluation
   - Display tercile thresholds
   - Explain 9-box placement

3. **Actionability Over Complexity**
   - 9-box provides clear actions ("Ready to scale", "Needs training")
   - Synergies explain "why" (not just "what")
   - Admin gets Shapley values to inform framework design

4. **Progressive Disclosure**
   - Basic view: 9-box classification + top insights
   - Advanced view: Shapley values, interaction weights, cross-efficiency matrix
   - Expert view: Raw solver output, tercile calculations

---

## Success Metrics (Engine-Specific)

### Technical Metrics
- ✓ All data values > 0 (100% compliance)
- ✓ Framework complexity < 10 variables (90%+ compliance)
- ✓ DEA computation < 5 seconds (for < 1000 employees)
- ✓ Weight balance ratio < 3.0 (indicates fairness)
- ✓ Cross-efficiency matrix computed (no solver errors)

### UX Metrics
- ✓ Tercile thresholds understood (80%+ admin comprehension)
- ✓ 9-box classification meaningful (80%+ "makes sense for my team")
- ✓ Synergies identified (75%+ can name 2+ interactions)
- ✓ Performance explanations clear (NPS > 40 for clarity)

---

## Summary

These optimized UX Guides align with the engine's mathematical capabilities:

✓ **Respect constraints** (max 10 variables, positive data, 5 sec computation)
✓ **Leverage innovations** (Choquet integrals, cross-efficiency, weight balance)
✓ **Explain complexity** (9-box, Shapley values, interaction weights as "why")
✓ **Enable fairness** (dynamic terciles, no arbitrary thresholds, fair weighting)

The result: A platform that guides admins and employees through sophisticated mathematical analysis without overwhelming them.
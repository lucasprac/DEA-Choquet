# 🔧 FLOWS FIXED: Evaluation Cycle & Indicators

---

## 📊 FLOW Fixed #1: Dimensions Management

### Starting Point: Dimensions Page
**Accessible by:** Manager > Diretor/Admin ONLY

```
┌─────────────────────────────────────────────────────┐
│ 📊 DIMENSIONS MANAGEMENT                            │
│                                                     │
│ Permission Check: ✓ You are Diretor/Admin          │
│                                                     │
│ ┌───────────────────────────────────────────────┐ │
│ │ 📚 INDICATORS LIBRARY                         │ │
│ │                                               │ │
│ │ Total Indicators: 27                          │ │
│ │ Active: 23 | Archived: 4                      │ │
│ │                                               │ │
│ │ [View All] [+ New Indicator]                 │ │
│ └───────────────────────────────────────────────┘ │
│                                                     │
│ ┌───────────────────────────────────────────────┐ │
│ │ 🎯 FRAMEWORKS LIBRARY                         │ │
│ │                                               │ │
│ │ Total Frameworks: 12                          │ │
│ │ Active: 10 | Archived: 2                      │ │
│ │                                               │ │
│ │ [View All] [+ New Framework]                 │ │
│ └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### BRANCH 1: CREATE A NEW INDICATOR
**Accessible by:** Manager > Diretor/Admin ONLY

#### Step 1: Choose Indicator Type (FIRST DECISION)

```
┌──────────────────────────────────────────────────┐
│ 📈 CREATE NEW INDICATOR                          │
│                                                  │
│ Step 1 of 4: Choose what you'll measure         │
│                                                  │
│ What type of data will this indicator collect?  │
│                                                  │
│ ○ QUANTITATIVE (Numbers)                        │
│   Examples: Revenue, Number of Commits,         │
│   Tickets Closed, Customer Retention %          │
│   ✓ Best for: Objective, measurable data        │
│                                                  │
│ ○ QUALITATIVE (Text/Ratings)                    │
│   Examples: Peer Feedback, Customer Satisfaction│
│   Engagement Score, Quality of Work             │
│   ✓ Best for: Subjective, nuanced feedback      │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

**Logic:**
```
if (selected === "Quantitative") {
  show_step_2_quantitative_scale()
} else if (selected === "Qualitative") {
  show_step_2_qualitative_scale()
}
```

---

#### Step 2A: If QUANTITATIVE Selected → Choose Scale

```
┌──────────────────────────────────────────────────┐
│ 📈 CREATE NEW INDICATOR                          │
│                                                  │
│ Step 2 of 4: Choose measurement scale           │
│ (You selected: QUANTITATIVE)                    │
│                                                  │
│ How will you measure this number?               │
│                                                  │
│ ○ CONTINUOUS (Ranges, decimals allowed)        │
│   Examples: Revenue $0-$1M, Temperature 0-100  │
│   Scale: Can be any value within range          │
│   ✓ Best for: Ranges, percentages, amounts     │
│                                                  │
│ ○ DISCRETE (Whole numbers only)                │
│   Examples: Number of commits, Tasks completed │
│   Scale: 0, 1, 2, 3, ... (no decimals)         │
│   ✓ Best for: Countable items                  │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

**Validation Rule:**
```
✅ VALID COMBINATIONS:
├─ Quantitative + Continuous → YES
├─ Quantitative + Discrete → YES

❌ INVALID (Never shown):
├─ Quantitative + Likert → BLOCKED
├─ Quantitative + Categorical → BLOCKED
```

---

#### Step 2B: If QUALITATIVE Selected → Choose Scale

```
┌──────────────────────────────────────────────────┐
│ 📈 CREATE NEW INDICATOR                          │
│                                                  │
│ Step 2 of 4: Choose rating scale                │
│ (You selected: QUALITATIVE)                     │
│                                                  │
│ How will raters provide feedback?               │
│                                                  │
│ ○ LIKERT SCALE (1-5 Rating)                    │
│   Examples: 1=Poor, 2=Fair, 3=Good, ...        │
│   ✓ Standard for employee feedback              │
│                                                  │
│ ○ NOMINAL CATEGORIES (Groups)                   │
│   Examples: Red/Yellow/Green, A/B/C             │
│   ✓ Best for: Risk levels, status              │
│                                                  │
│ ○ TEXT COMMENTS (Open-ended)                    │
│   Examples: "Alice is great at...", etc         │
│   ✓ Best for: Rich feedback, context            │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

**Validation Rule:**
```
✅ VALID COMBINATIONS:
├─ Qualitative + Likert → YES
├─ Qualitative + Nominal → YES
├─ Qualitative + Text → YES

❌ INVALID (Never shown):
├─ Qualitative + Continuous → BLOCKED
├─ Qualitative + Discrete → BLOCKED
```

---

#### Step 3: Define Indicator Details

```
┌──────────────────────────────────────────────────┐
│ 📈 CREATE NEW INDICATOR                          │
│                                                  │
│ Step 3 of 4: Define indicator details           │
│ (Type: Quantitative | Scale: Continuous)       │
│                                                  │
│ [Field] Indicator Name*                         │
│ ______________________________                   │
│ e.g., "Sales Revenue" or "Customer Retention"  │
│                                                  │
│ [Dropdown] Data Source*                         │
│ ├─ Salesforce (API auto-sync)                   │
│ ├─ GitHub (API auto-sync)                       │
│ ├─ Google Sheets (Manual entry)                 │
│ ├─ Manual Entry (Spreadsheet)                   │
│ └─ Custom Integration                           │
│                                                  │
│ [Field] Unit of Measurement                     │
│ ______________________________                   │
│ e.g., "$", "people", "%", "commits"             │
│                                                  │
│ [Dropdown] Direction (What's better?)           │
│ ○ Higher is Better (e.g., Revenue)              │
│ ○ Lower is Better (e.g., Defect Rate)           │
│ ○ Target Range (e.g., 80-85%)                   │
│                                                  │
│ [Checkbox] Active? ☑                            │
│ This indicator will be available in frameworks  │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

**Real-time Validations:**
```
On Name Input:
├─ Check: Is name unique in library?
├─ If DUPLICATE: Show warning
│  └─ "Sales Revenue already exists"
│  └─ [Use Existing] [Create New (will be renamed)]
│
├─ If SIMILAR: Show suggestion
│  └─ "Did you mean 'Sales Volume'?"
│
└─ If VALID: Show ✓ "Name available"

On Source Selection:
├─ If Salesforce: Show "Will auto-sync every 6 hours"
├─ If GitHub: Show "Will auto-sync every 12 hours"
├─ If Manual: Show "Data must be entered manually"
```

---

#### Step 4: Review & Confirm

```
┌──────────────────────────────────────────────────┐
│ 📈 CREATE NEW INDICATOR                          │
│                                                  │
│ Step 4 of 4: Review before saving               │
│                                                  │
│ INDICATOR SUMMARY:                              │
│ ├─ Name: Sales Revenue                          │
│ ├─ Type: Quantitative (Continuous)              │
│ ├─ Source: Salesforce                           │
│ ├─ Unit: $ (dollars)                            │
│ ├─ Direction: Higher is Better                  │
│ └─ Status: Active ✓                             │
│                                                  │
│ DATA EXAMPLE:                                   │
│ ├─ Employee 1: $125,000 ✓                       │
│ ├─ Employee 2: $98,500 ✓                        │
│ └─ Employee 3: $110,200 ✓                       │
│                                                  │
│ This indicator will be available in:            │
│ ├─ Existing Frameworks: 3                       │
│ ├─ New Frameworks: Unlimited                    │
│ └─ Cycles: All future cycles                    │
│                                                  │
│ [← Back] [Create Indicator] [Cancel]           │
└──────────────────────────────────────────────────┘
```

---

#### After Creation: Success State

```
┌──────────────────────────────────────────────────┐
│ ✅ INDICATOR CREATED SUCCESSFULLY                │
│                                                  │
│ "Sales Revenue" is now in your library          │
│                                                  │
│ Next steps:                                     │
│ ○ Add it to a Framework                         │
│ ○ Use it in an Evaluation Cycle                 │
│ ○ Create another Indicator                      │
│                                                  │
│ [View in Library] [Create Another] [Done]      │
└──────────────────────────────────────────────────┘
```

---

### BRANCH 2: MANAGE INDICATORS IN LIBRARY

**Accessible by:** Manager > Diretor/Admin (edit/delete)  
**Accessible by:** Manager > Manager (view only)  
**Accessible by:** Manager > HR/Admin (view only)

```
┌──────────────────────────────────────────────────┐
│ 📚 INDICATORS LIBRARY                            │
│                                                  │
│ Your Permission: Diretor/Admin (Full Access)   │
│                                                  │
│ [Search...] [Filter: All|Active|Archived]      │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Sales Revenue              [✓ Active]    │   │
│ │ Type: Quantitative (Continuous)          │   │
│ │ Source: Salesforce (Auto-sync)           │   │
│ │ Used in: 8 frameworks, 3 cycles          │   │
│ │ Created: Jan 10, 2026 | Last updated: ..│   │
│ │ [View] [Edit] [Deactivate] [Delete]    │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Customer Satisfaction      [✓ Active]    │   │
│ │ Type: Qualitative (Likert Scale)         │   │
│ │ Source: Manual Entry                     │   │
│ │ Used in: 5 frameworks, 2 cycles          │   │
│ │ [View] [Edit] [Deactivate] [Delete]    │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Actions by Permission:**

```
If User = Diretor/Admin:
├─ [View] → Show full details
├─ [Edit] → Can change name, source, direction, etc
├─ [Deactivate] → Hide from new frameworks (archived)
└─ [Delete] → Remove completely (with warning)

If User = Manager or HR/Admin:
├─ [View] → Show details (read-only)
├─ [Edit] → DISABLED (show tooltip: "Only directors can edit")
├─ [Deactivate] → DISABLED
└─ [Delete] → DISABLED
```

---

### BRANCH 3: CREATE A NEW FRAMEWORK

**Accessible by:** Manager > Diretor/Admin ONLY

```
┌──────────────────────────────────────────────────┐
│ 🎯 CREATE NEW FRAMEWORK                          │
│                                                  │
│ Step 1 of 3: Framework Details                  │
│                                                  │
│ [Field] Framework Name*                         │
│ ____________________________                     │
│ e.g., "Sales Team Q1 2026"                      │
│                                                  │
│ [Field] Description (Optional)                  │
│ ____________________________                     │
│ "Framework for evaluating sales performance"   │
│                                                  │
│ [Dropdown] Scope*                               │
│ ├─ ○ Global (Used across entire company)       │
│ ├─ ○ By Department (choose below)               │
│ │   └─ [Dropdown] Sales / Engineering / HR      │
│ │                                              │
│ └─ ○ By Function/Role                          │
│    └─ [Dropdown] Sales Manager / Dev / etc      │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

---

```
┌──────────────────────────────────────────────────┐
│ 🎯 CREATE NEW FRAMEWORK                          │
│                                                  │
│ Step 2 of 3: Select Indicators                  │
│                                                  │
│ Choose 3-5 indicators from your library:        │
│                                                  │
│ ☐ Sales Revenue                                 │
│   └─ "Total revenue generated" (Quantitative)   │
│                                                  │
│ ☑ Customer Satisfaction                         │
│   └─ "CSAT Score 1-5" (Qualitative)             │
│                                                  │
│ ☑ Quality (Code/Work)                           │
│   └─ "Code review score" (Quantitative)         │
│                                                  │
│ ☐ Collaboration                                 │
│   └─ "Peer feedback" (Qualitative)              │
│                                                  │
│ ☑ Customer Retention                            │
│   └─ "% of customers retained" (Quantitative)   │
│                                                  │
│ Selected: 3 of 5 (✓ Valid count)                │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

---

```
┌──────────────────────────────────────────────────┐
│ 🎯 CREATE NEW FRAMEWORK                          │
│                                                  │
│ Step 3 of 3: Set Weights (Auto-calculated)      │
│                                                  │
│ Distribute importance across indicators:        │
│                                                  │
│ Customer Satisfaction     [===========]  40%    │
│ Quality (Code/Work)       [========]    35%     │
│ Customer Retention        [======]      25%     │
│                                                  │
│ Total: 100% ✓                                   │
│                                                  │
│ Note: Adjust by dragging sliders.               │
│ These weights feed into DEA calculation.        │
│                                                  │
│ PREVIEW:                                        │
│ Employee Score = 0.40 × CSAT                    │
│                 + 0.35 × Quality                │
│                 + 0.25 × Retention              │
│                                                  │
│ [← Back] [Create Framework] [Cancel]           │
└──────────────────────────────────────────────────┘
```

---

#### After Creation: Success State

```
┌──────────────────────────────────────────────────┐
│ ✅ FRAMEWORK CREATED SUCCESSFULLY                │
│                                                  │
│ "Sales Team Q1 2026" is now in your library     │
│                                                  │
│ Next steps:                                     │
│ ○ Use it in an Evaluation Cycle                 │
│ ○ Duplicate for another team                    │
│ ○ Create another Framework                      │
│                                                  │
│ [View in Library] [Create Cycle] [Done]        │
└──────────────────────────────────────────────────┘
```

---

### BRANCH 4: MANAGE FRAMEWORKS IN LIBRARY

**Accessible by:** Manager > Diretor/Admin (edit/delete)  
**Accessible by:** Manager > Manager (view only)  
**Accessible by:** Manager > HR/Admin (view only)

```
┌──────────────────────────────────────────────────┐
│ 🎯 FRAMEWORKS LIBRARY                            │
│                                                  │
│ Your Permission: Diretor/Admin (Full Access)   │
│                                                  │
│ [Search...] [Filter: All|Active|Archived]      │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Sales Team Q1 2026        [✓ Active]     │   │
│ │ Scope: Global                            │   │
│ │ Indicators: 3 (CSAT, Quality, Retention) │   │
│ │ Used in: 2 cycles (Q1 2026, Q1 Test)     │   │
│ │ Version: 2.0 (Latest)                    │   │
│ │ [View] [Edit] [Duplicate] [Deactivate]  │   │
│ │ [Delete] [View Version History]         │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Engineering Performance      [⭕ Archived]│   │
│ │ Scope: By Department                     │   │
│ │ Indicators: 5                            │   │
│ │ Used in: 1 cycle (Q4 2025 - Archived)    │   │
│ │ Version: 1.0                             │   │
│ │ [View] [Restore] [View Version History]  │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 📊 FLOW CORRIGIDO #2: CICLO DE AVALIAÇÃO

### Starting Point: Cycles Page
**Accessible by:** Manager > Diretor/Admin (create/edit)  
**Accessible by:** Manager > Manager (view + accept objectives)  
**Accessible by:** Manager > HR/Admin (view only)

```
┌─────────────────────────────────────────────────┐
│ 📅 EVALUATION CYCLES MANAGEMENT                 │
│                                                 │
│ Your Permission: Diretor/Admin                 │
│                                                 │
│ [+ New Cycle] [View Active] [View Archive]    │
│                                                 │
│ ACTIVE CYCLES:                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ Q4 2025 (In Progress)                   │   │
│ │ Start: Oct 1 | End: Dec 31, 2025        │   │
│ │ Framework: Sales Framework v2.1         │   │
│ │ Participants: 157 employees             │   │
│ │ Status: Data Collection Phase           │   │
│ │ [View] [Edit] [Manage Data] [Archive]  │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ Q1 2026 (Planned)                       │   │
│ │ Start: Jan 1 | End: Mar 31, 2026        │   │
│ │ Framework: TBD                          │   │
│ │ Participants: 0 (Not finalized)         │   │
│ │ Status: Setup In Progress               │   │
│ │ [View] [Edit] [Delete]                  │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### BRANCH 1: CREATE A NEW CYCLE

**Accessible by:** Manager > Diretor/Admin ONLY

#### Step 1: Cycle Basic Information

```
┌──────────────────────────────────────────────────┐
│ 📅 CREATE NEW EVALUATION CYCLE                   │
│                                                  │
│ Step 1 of 5: Basic Information                  │
│                                                  │
│ [Field] Cycle Name*                             │
│ ____________________________                     │
│ e.g., "Q2 2026" or "Mid-Year Review"            │
│                                                  │
│ [Field] Start Date*                             │
│ ____________________________  [📅 Picker]        │
│                                                  │
│ [Field] End Date*                               │
│ ____________________________  [📅 Picker]        │
│                                                  │
│ ⚠️ Note: End date should be 1-6 months out     │
│ (avoid cycles > 12 months)                      │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

---

#### Step 2: Select Framework

```
┌──────────────────────────────────────────────────┐
│ 📅 CREATE NEW EVALUATION CYCLE                   │
│                                                  │
│ Step 2 of 5: Select Evaluation Framework        │
│                                                  │
│ Which framework will evaluate employees?        │
│                                                  │
│ [Dropdown] Framework*                           │
│ ├─ Sales Framework v2.1 (Global)                │
│ ├─ Engineering Performance v1.5 (By Department) │
│ ├─ HR Compliance Framework v1.0 (Global)        │
│ ├─ Custom Team Framework (Department: Sales)    │
│ └─ [Create New Framework]                       │
│                                                  │
│ Selected: Sales Framework v2.1                  │
│ ├─ Indicators: 3                                │
│ │  ├─ Customer Satisfaction (40%)               │
│ │  ├─ Quality Score (35%)                       │
│ │  └─ Customer Retention (25%)                  │
│ └─ Scope: Global                                │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

---

#### Step 3: Define Scope & Participants

```
┌──────────────────────────────────────────────────┐
│ 📅 CREATE NEW EVALUATION CYCLE                   │
│                                                  │
│ Step 3 of 5: Who will participate?              │
│                                                  │
│ Choose participant scope:                       │
│                                                  │
│ ○ ENTIRE COMPANY                                │
│   └─ All 487 employees will be included         │
│                                                  │
│ ○ BY DEPARTMENT                                 │
│   [Checkbox] Sales (157)                        │
│   [Checkbox] Engineering (203)                  │
│   [Checkbox] Operations (89)                    │
│   [Checkbox] HR (18)                            │
│   └─ Total selected: 467 employees              │
│                                                  │
│ ○ BY FUNCTION/ROLE                              │
│   [Checkbox] Sales Manager (12)                 │
│   [Checkbox] Developer (156)                    │
│   [Checkbox] Designer (34)                      │
│   └─ Total selected: 202 employees              │
│                                                  │
│ OPTION: Add employees manually                  │
│ [+ Add Employee] (for exceptions)               │
│                                                  │
│ Preview: 157 employees will be evaluated       │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

**Auto-population Logic:**
```
When Department selected:
├─ Query: SELECT * FROM employees WHERE dept_id = "sales"
├─ Result: 157 employees
├─ Display: "[Checkbox] Sales Department (157 employees)"
├─ Sub-list: Show employee names if needed
└─ Allow: Add/remove individual employees manually
```

---

#### Step 4: Define Organizational Business Objective (OBO)

```
┌──────────────────────────────────────────────────┐
│ 📅 CREATE NEW EVALUATION CYCLE                   │
│                                                  │
│ Step 4 of 5: Set Organizational Objectives      │
│                                                  │
│ These are company-wide targets for this cycle:  │
│                                                  │
│ For indicator: Customer Satisfaction            │
│ [Slider] Target Score: [=========]  85%         │
│ Min: 0% | Max: 100%                             │
│                                                  │
│ For indicator: Quality Score                    │
│ [Slider] Target Score: [========]   80%         │
│ Min: 0% | Max: 100%                             │
│                                                  │
│ For indicator: Customer Retention               │
│ [Slider] Target Score: [===========]  90%       │
│ Min: 0% | Max: 100%                             │
│                                                  │
│ SUMMARY:                                        │
│ ├─ Customer Satisfaction: 85% target            │
│ ├─ Quality Score: 80% target                    │
│ └─ Customer Retention: 90% target               │
│                                                  │
│ ⚠️ Note: These targets cascade to employees    │
│ (adjusted for seniority level)                  │
│                                                  │
│ [← Back] [Next →]                              │
└──────────────────────────────────────────────────┘
```

---

#### Step 5: Review & Confirm

```
┌──────────────────────────────────────────────────┐
│ 📅 CREATE NEW EVALUATION CYCLE                   │
│                                                  │
│ Step 5 of 5: Review & Create                    │
│                                                  │
│ CYCLE SUMMARY:                                  │
│ ├─ Name: Q4 2025                                │
│ ├─ Timeline: Oct 1 - Dec 31, 2025               │
│ ├─ Framework: Sales Framework v2.1              │
│ ├─ Participants: 157 employees (Sales Dept)     │
│ └─ OBO Targets:                                 │
│    ├─ Customer Satisfaction: 85%                │
│    ├─ Quality Score: 80%                        │
│    └─ Customer Retention: 90%                   │
│                                                  │
│ NEXT STEPS (Automatic):                         │
│ ✓ Personal objectives generated per employee   │
│   (adjusted from OBO targets based on role)    │
│ ✓ Employees notified of cycle start             │
│ ✓ Data collection begins                        │
│ ✓ Managers can review objectives                │
│                                                  │
│ [← Back] [Create Cycle] [Cancel]               │
└──────────────────────────────────────────────────┘
```

---

#### After Creation: Success + Auto-actions

```
┌──────────────────────────────────────────────────┐
│ ✅ EVALUATION CYCLE CREATED SUCCESSFULLY         │
│                                                  │
│ "Q4 2025" is now active                         │
│                                                  │
│ AUTOMATIC ACTIONS COMPLETED:                    │
│ ✓ 157 employees added to cycle                  │
│ ✓ Personal objectives generated                 │
│ ✓ Employees notified (email + in-app)           │
│ ✓ Managers alerted to review objectives         │
│ ✓ Data sync enabled (Salesforce, GitHub, etc)   │
│                                                  │
│ WHAT HAPPENS NEXT:                              │
│ 1. Managers review & accept objectives          │
│    (see: Manager > Gerente Journey)             │
│ 2. Employees acknowledge their targets          │
│ 3. Data automatically collected                 │
│ 4. Manager monitors progress                    │
│                                                  │
│ [View Cycle] [Manage Data] [Done]              │
└──────────────────────────────────────────────────┘
```

---

### BRANCH 2: MANAGE ACTIVE CYCLES

**Accessible by:** Manager > Diretor/Admin (edit)  
**Accessible by:** Manager > Manager (view + act on objectives)  
**Accessible by:** Manager > HR/Admin (view only)

#### For Diretor/Admin: Full Edit Access

```
┌──────────────────────────────────────────────────┐
│ 🔧 MANAGE CYCLE: Q4 2025                         │
│                                                  │
│ Your Permission: Diretor/Admin (Full Edit)     │
│                                                  │
│ [Edit] [View Data] [Manage Participants]       │
│ [Download Report] [Archive]                    │
│                                                  │
│ CYCLE DETAILS:                                  │
│ ├─ Name: Q4 2025                                │
│ ├─ Timeline: Oct 1 - Dec 31, 2025               │
│ ├─ Framework: Sales Framework v2.1              │
│ ├─ Status: In Progress                          │
│ ├─ Participants: 157                            │
│ └─ Data Freshness: Updated 2 hours ago          │
│                                                  │
│ ORG BUSINESS OBJECTIVES:                        │
│ ├─ Customer Satisfaction: 85% target            │
│ ├─ Quality Score: 80% target                    │
│ └─ Customer Retention: 90% target               │
│                                                  │
│ SYSTEM STATUS:                                  │
│ ├─ Data Collection: 87% complete (137/157)     │
│ ├─ Data Sync: Salesforce updated today          │
│ ├─ Data Sync: GitHub updated 3 days ago         │
│ └─ Manual Entries: 23 pending                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

#### For Manager > Manager: View + Accept Objectives

```
┌──────────────────────────────────────────────────┐
│ 📋 CYCLE: Q4 2025 - OBJECTIVES REVIEW            │
│                                                  │
│ Your Permission: Manager (Review Your Team)    │
│                                                  │
│ CYCLE DETAILS (Read-only):                      │
│ ├─ Framework: Sales Framework v2.1              │
│ ├─ Timeline: Oct 1 - Dec 31, 2025               │
│ └─ OBO Targets: CSAT 85%, Quality 80%, etc      │
│                                                  │
│ YOUR TEAM'S PERSONAL OBJECTIVES:                │
│                                                  │
│ [Alice Chen]                                    │
│ Personal Target: CSAT 83% (adj. from 85%)       │
│ Reason: Senior, account management              │
│ ○ Accept ● Adjust [Justification field]         │
│                                                  │
│ [Bob Martinez]                                  │
│ Personal Target: CSAT 81% (adj. from 85%)       │
│ Reason: Mid-level, new to role                  │
│ ○ Accept ● Adjust [Justification field]         │
│                                                  │
│ [Charlie Davis]                                 │
│ Personal Target: CSAT 80% (adj. from 85%)       │
│ Reason: Junior, learning phase                  │
│ ● Accept ○ Adjust                               │
│                                                  │
│ 8 of 12 accepted | 2 awaiting adjustment        │
│                                                  │
│ [← Back] [Save] [Submit to HR]                 │
└──────────────────────────────────────────────────┘
```

---

## 🔄 AUTOMATIC WORKFLOWS

### After Cycle Created:

```
┌─────────────────────────────────────────────────┐
│ AUTOMATIC WORKFLOW: Personal Objective Generation│
│                                                 │
│ Step 1: System Calculates                       │
│ ├─ OBO: CSAT 85% (company target)               │
│ ├─ Employee: Bob Martinez (Mid-level, Sales)    │
│ ├─ Adjustment: -2% for mid-level (typical)      │
│ └─ Result: Personal Obj = 83%                   │
│                                                 │
│ Step 2: Manager Reviews                        │
│ ├─ Can accept suggested 83%                     │
│ ├─ Can adjust with justification                │
│ └─ Must submit for confirmation                 │
│                                                 │
│ Step 3: Employee Receives                       │
│ ├─ Email: "Your objectives for Q4 2025"         │
│ ├─ App notification                             │
│ ├─ Portal: See objectives + framework           │
│ └─ Action: Acknowledge objectives               │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Data Collection & Validation:

```
┌─────────────────────────────────────────────────┐
│ PERFORM DATA WORKFLOW:                          │
│                                                 │
│ Phase 1: System Collection (Automatic)          │
│ ├─ Salesforce: Every 6 hours                    │
│ ├─ GitHub: Every 12 hours                       │
│ ├─ Manual entry: On submit                      │
│ └─ Status: "Data Ready for Review"              │
│                                                 │
│ Phase 2: Manager Review (Manager > Gerente)    │
│ ├─ Dashboard: See all employee data             │
│ ├─ Options: Accept | Flag | Reject              │
│ ├─ Comments: Add context if needed              │
│ └─ Status: "Waiting for HR Validation"          │
│                                                 │
│ Phase 3: HR Validation (Manager > HR/Admin)    │
│ ├─ Check: Data completeness (>90%?)             │
│ ├─ Check: Anomalies flagged?                    │
│ ├─ Check: Compliance rules met?                 │
│ └─ Status: "Ready for DEA"                      │
│                                                 │
│ Phase 4: DEA Calculation (System)               │
│ ├─ Input: All validated data                    │
│ ├─ Algorithm: Cross-efficiency evaluation       │
│ ├─ Output: Efficiency scores (0-100)            │
│ └─ Status: "Results Ready"                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 PERMISSIONS SUMMARY TABLE

| Action | Diretor/Admin | Manager | HR/Admin | Employee |
|--------|---|---|---|---|
| Create Indicator | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Edit Indicator | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| View Indicators | ✅ YES | ✅ View Only | ✅ View Only | ❌ NO |
| Create Framework | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Edit Framework | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Create Cycle | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Edit Cycle | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| Review Objectives | ❌ NO | ✅ Own Team | ❌ NO | ✅ Own |
| Accept/Adjust Obj | ❌ NO | ✅ Own Team | ❌ NO | ✅ Own |
| View All Data | ✅ YES | ✅ Own Team | ✅ YES | ✅ Own |
| Input Performance Data | ✅ Manual | ✅ Own Team | ✅ Manual | ✅ Own |
| Manage Users | ❌ NO | ❌ NO | ✅ YES | ❌ NO |

---

## ✅ NEXT STEPS

### THIS WEEK

1. **Design Review**
   - Validate screens with UX team
   - Check for accessibility issues
   - Review error states

2. **Permission Documentation**
   - Create detailed permission model doc
   - Implement role-based checks in code
   - Add UI indicators for "no permission"

3. **API Specifications**
   - Define endpoints for each journey
   - Request/response schemas
   - Error handling specs

---

**Status:** ✅ Ready for Design & Development  
**Alignment:** 95% with Consolidated 2-Persona Roadmap  
**Next:** Share with engineering team for sprint planning


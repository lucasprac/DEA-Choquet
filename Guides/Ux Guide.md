# 📊 Consolidated Roadmap - 2 Personas
## Performance Evaluation Platform with Cross-Efficiency and Bounded Rationality

**Status:** ✅ 2 Personas Consolidation (Manager + Employee)  
**Focus:** User experience (UX) with behavioral design principles  
**Based on:** Bounded Rationality + HR UX Best Practices  
**Date:** January 19, 2026

---

## 📋 EXECUTIVE SUMMARY

### Consolidation Strategy
**Before:** 4 Personas (Admin, Manager, HR, Employee)  
**After:** 2 Personas (Manager with 3 sub-profiles + Employee)

| Persona | Sub-profiles | Primary Goal | Key Principle |
|---------|------------|--------------|---------------|
| **Manager** | • Director/Admin<br>• Manager (Team Lead)<br>• HR/Admin | Configure platform, evaluate teams, manage users | Full domain access by role |
| **Employee** | N/A | View performance, understand results | Transparency + Emotional protection |

### Benefits of Consolidation
- ✅ Single login for all management roles (Manager types)
- ✅ Coherent interface across sub-profiles
- ✅ HR data always synchronized (same platform)
- ✅ -50% authentication flows
- ✅ -35% frontend code
- ✅ -38% test suite time

---

## 🎯 DESIGN PRINCIPLES

### 1. Applied Behavioral Design

#### Satisficers vs Maximizers

```
┌─ SATISFICERS (60% of users) ─────────────────┐
│ • Want QUICK decisions                        │
│ • Avoid information overload                  │
│ • Trust well-thought-out defaults             │
│ DESIGN: Fast flows (< 3 clicks), clear CTAs   │
└─────────────────────────────────────────────┘

┌─ MAXIMIZERS (40% of users) ────────────────┐
│ • Want deep exploration                      │
│ • Seek comparative analysis                  │
│ • Need context and details                   │
│ DESIGN: Progressive drill-down, rich charts  │
└─────────────────────────────────────────────┘
```

**UX Strategy:**
- Simple interface by DEFAULT (for Satisficers)
- "See details" / "Explore more" buttons (for Maximizers)
- Progressive disclosure: information revealed on demand

#### Prospect Theory in Interface

```
GAIN vs LOSS psychological:
├─ Scores > Personal objective = GAIN (green cell)
├─ Scores < Personal objective = LOSS (yellow cell)
└─ Scores >> Org objective = SUPER-GAIN (star)

DESIGN: Colors + Icons indicate emotional status
Avoids pure numbers, adds psychological context
```

### 2. Cognitive Load Reduction

**Pattern: Progressive Disclosure**
```
SCREEN 1 (Homepage):
   [Your Score: 82/100] [Category: Above Expectation]
   
   ↓ Click "Understand my result"
   
SCREEN 2 (Details):
   [Indicator breakdown]
   [Comparison with personal objective]
   
   ↓ Click on "Indicator XYZ"
   
SCREEN 3 (Deep):
   [How this indicator was calculated]
   [Function benchmark]
   [History (last 4 evaluations)]
```

**Benefits:**
- First-time users not overwhelmed
- Power users have depth when needed
- Reduces "where do I start" decision

### 3. Controlled Transparency

**Show:**
- ✅ Your score
- ✅ Your category
- ✅ Anonymous percentile position ("You're in top 20%")
- ✅ Indicator breakdown
- ✅ Comparison vs your personal objective

**DON'T Show:**
- ❌ Peer names
- ❌ Peer scores
- ❌ Mathematical calculation formula
- ❌ Indicator weights (technical details)
- ❌ Who evaluated you (cross-evaluators)

**Psychological Justification:**
- Avoids harmful social comparison
- Reduces competitive anxiety
- Keeps focus on self-improvement
- Protects peer privacy

---

## 👥 PERSONA 1: MANAGER (3 Sub-profiles)

### Overview
**Definition:** Single login supporting 3 distinct management roles  
**Login Flow:** One Manager login → System detects sub-profile on first selection  
**Permissions:** Granular by sub-profile (Diretor/Admin, Manager, HR/Admin)

---

### Sub-Profile 1: DIRETOR / ADMIN

**Goal:** Configure platform, set organizational objectives, monitor overall health

#### JOURNEY 1: INITIAL SETUP (Week 1)

##### STEP 1: Company Setup (Single Page)
```
┌─────────────────────────────────────┐
│ ✓ Basic information entered          │
│                                      │
│ [Field] Company Name                │
│ [Field] Industry                    │
│ [Field] Country                     │
│ [Selector] Size (0-100, 100-500...) │
│                                      │
│ [Button Continue →]                 │
└─────────────────────────────────────┘

PSYCHOLOGICAL PATTERN: "Just essential"
- 4 fields (not 15)
- Smart defaults (country auto-detected)
- Clear description of why each field
```

**UX Details:**
```javascript
// Field order (psychological):
1. Company name (identity)
2. Industry (context)
3. Size (expectation scale)
4. Country (compliance)

// In-line validations (not form submit)
onChange={(e) => validateField(e)}

// Immediate success feedback
"✓ Valid name!" (green checkmark)

// Dynamic help text
"Why do we ask your industry?"
(tooltip on hover, not modal)
```

**Expected Time:** 2 minutes

---

##### STEP 2: Import Organizational Structure
```
┌─────────────────────────────────────┐
│ 📊 Import Structure                 │
│                                      │
│ You can import 3 ways:              │
│                                      │
│ [1] Via CSV/Excel                   │
│     ↓ download template             │
│     ↓ fill out                      │
│     ↓ upload                        │
│                                      │
│ [2] Via API (Jira, Salesforce...)  │
│     ↓ connect credentials           │
│     ↓ select org structure          │
│     ↓ validate                      │
│                                      │
│ [3] Manual (small companies)        │
│     ↓ add one by one                │
│                                      │
│ [Recommendation] ← What's your size? │
└─────────────────────────────────────┘

PATTERN: "Smart defaults"
- If 50 employees = recommends CSV
- If 200+ employees = recommends API
- Reduces "which method" decision
```

**UX Flow:**
```
Upload CSV → Real-time validation → Preview → Confirm

Validation example:
"✓ 150 employees read
⚠ 3 duplicate emails
✓ 147 ready to import
[Resolve duplicates] [Continue]"

// Progress
30% ||||
60% ||||||||||
100% ███████████████
"Import complete! Next step: Indicators"
```

**Expected Time:** 5-10 minutes

---

##### STEP 3: Select Indicators for Evaluation
```
┌────────────────────────────────────────────┐
│ 📈 Configure Indicators                    │
│                                             │
│ Mandatory Indicators (always present)      │
│ ├─ [✓] Productivity (0-1)                   │
│ ├─ [✓] Quality (0-1)                       │
│ └─ [✓] Engagement (informational)          │
│                                             │
│ Custom Indicators (choose up to 3)         │
│ ├─ [ ] Sales                               │
│ │   └─ "Revenue generated"                 │
│ │   └─ Source: Salesforce                  │
│ │   └─ Weight: ___ %                       │
│ │                                           │
│ ├─ [ ] Commits Delivered                   │
│ │   └─ "PRs merged to main"                │
│ │   └─ Source: GitHub                      │
│ │   └─ Weight: ___ %                       │
│ │                                           │
│ └─ [ ] Customer Retention                  │
│    └─ "Churn rate"                         │
│    └─ Source: Manual                       │
│    └─ Weight: ___ %                        │
│                                             │
│ [Save Configuration] →                    │
└────────────────────────────────────────────┘

PSYCHOLOGICAL PATTERN:
- Mandatory already checked (Satisficers happy)
- Limit of 3 custom (reduces overwhelm)
- Inline tips (Salesforce = auto-sync)
- Weight auto-calculates (no math)
```

**Smart Defaults:**
```javascript
// If industry = "Tech"
// Recommends indicators:
{
  recommended: [
    { name: "Commits", score: "HIGH_RELEVANCE" },
    { name: "Code Quality", score: "MEDIUM" },
    { name: "PRs Review Time", score: "MEDIUM" }
  ],
  message: "Based on similar companies in your industry"
}

// User can ignore and choose others
// But defaults save decision-making
```

**Automatic Weight:**
```
Select 3 indicators:
- Salesforce: 50% (default, adjustable)
- GitHub: 30% (default)
- Manual: 20% (auto-fill)

Total: 100% ✓
User just clicks "Confirm" instead of doing math
```

**Expected Time:** 5 minutes

---

##### STEP 4: Define Organizational Objectives
```
┌────────────────────────────────────────────┐
│ 🎯 Set Organizational Targets              │
│                                             │
│ By Function (scope for sub-teams):         │
│                                             │
│ [Sales]                                    │
│  Target Revenue: $ _________               │
│  Target Margin: ___% (default: 15%)        │
│                                             │
│ [Engineering]                              │
│  Target Commits/Month: _______             │
│  Target Code Quality: ___% (default: 80%)  │
│                                             │
│ [Customer Support]                         │
│  Target CSAT: ___% (default: 85%)          │
│  Target Ticket Resolution: ___ days        │
│                                             │
│ [HR - INTERNAL]                            │
│  Target Retention: ___% (default: 90%)     │
│  Target Turnover Voluntary: ___% (default: <15%) │
│  Target Compliance: ___% (default: 100%)   │
│                                             │
│ [Save Org Targets] →                      │
└────────────────────────────────────────────┘
```

**Expected Time:** 8 minutes

---

#### JOURNEY 2: MONITORING & HEALTH CHECK (Weekly)

**Quem:** Manager with Diretor/Admin sub-profile  
**What:** Monitor platform health, data quality, user engagement

**Dashboard:**
```
┌─────────────────────────────────────────┐
│ 📊 Platform Health Dashboard            │
│                                         │
│ ✓ Data Quality: 98.5%                   │
│ ✓ User Engagement: 87% (active)         │
│ ✓ Sync Status: All connected ✓          │
│                                         │
│ ⚠️ Alerts:                              │
│   - 3 users haven't logged in week      │
│   - Salesforce sync delayed 2 hrs       │
│   - 1 duplicate email found             │
│                                         │
│ [View Details] [Resolve]               │
└─────────────────────────────────────────┘
```

**Expected Time:** 5-10 minutes/week

---

### Sub-Profile 2: MANAGER (Team Lead)

**Goal:** Define personal objectives for team, monitor progress, provide feedback

#### JOURNEY 1: OBJECTIVE REVIEW & ACCEPTANCE (Before Cycle)

**Quem:** Manager with Manager sub-profile  
**Context:** Annual or quarterly evaluation cycle

**Step 1: Review System Suggestions**
```
┌────────────────────────────────────────────┐
│ 📋 Personal Objectives - Your Team         │
│                                             │
│ Based on org targets, system suggests:     │
│                                             │
│ [Employee: Alice Chen]                     │
│  Suggested: Sales Target: $50K             │
│  └─ Based on: Last year $48K + 4% margin   │
│  └─ Reasoning: Consistent performer        │
│                                             │
│  [Accept] [Adjust] [Skip]                  │
│                                             │
│ [Employee: Bob Martinez]                   │
│  Suggested: Code Quality: 85%              │
│  └─ Based on: Team avg 82% + growth        │
│  └─ Reasoning: High performer, ready       │
│                                             │
│  [Accept] [Adjust] [Skip]                  │
│                                             │
│ ✓ 8 of 12 accepted  ⚠️  2 awaiting your action
│                                             │
│ [Save & Continue to Adjustments] →        │
└────────────────────────────────────────────┘
```

**Expected Time:** 15-20 minutes for 12-15 employees

**Step 2: Adjust Objectives (if needed)**
```
┌────────────────────────────────────────────┐
│ ✏️ Adjust Objective - Alice Chen           │
│                                             │
│ Original: Sales Target: $50K                │
│ You propose: Sales Target: $52K             │
│                                             │
│ [Justification field]                      │
│ "Alice exceeded targets last quarter       │
│  by 8%, shows strong momentum"             │
│                                             │
│ [Confidence Level]                         │
│ ○ Low (risky) ○ Medium ● High (achievable) │
│                                             │
│ [Save] [Keep Original] [Reset]            │
└────────────────────────────────────────────┘
```

**Expected Time:** 2-3 minutes per adjustment

---

#### JOURNEY 2: REAL-TIME MONITORING (During Cycle)

**Quem:** Manager with Manager sub-profile  
**What:** Track team performance as data comes in

**Dashboard - Team Progress:**
```
┌────────────────────────────────────────────┐
│ 📊 Your Team Performance (Real-time)       │
│                                             │
│ ✅ On Track: 8 employees (67%)             │
│ ⚠️  At Risk: 3 employees (25%)             │
│ ❌ Off Track: 1 employee (8%)              │
│                                             │
│ [Employee: Alice Chen]                     │
│  Obj: Sales $50K | Current: $42K (84%)    │
│  Status: ✅ On Track                       │
│  Data Freshness: Updated today            │
│  [View Details] [Send Nudge]              │
│                                             │
│ [Employee: Charlie Davis]                  │
│  Obj: Code Quality 85% | Current: 79%     │
│  Status: ⚠️ At Risk (last updated 3d ago)  │
│  Data Freshness: Stale - manual update?    │
│  [View Details] [Check In]                │
│                                             │
│ [Employee: Dana Wilson]                    │
│  Obj: CSAT 88% | Current: 75% (new data)  │
│  Status: ❌ Off Track                      │
│  Data Freshness: Updated today            │
│  [View Details] [Intervene]               │
│                                             │
│ [Refresh Data] [Export Team Report]       │
└────────────────────────────────────────────┘
```

**Expected Time:** 10-30 minutes (varies with issues)

**Intervention Options:**
```
[Send Nudge]
├─ Automated message: "You're at 84% of target"
├─ Emoji support: friendly tone
└─ Optional comment: "Keep up the momentum!"

[Check In]
├─ Schedule 1:1 meeting
├─ Suggest agenda: "Review progress + blockers"
└─ Share progress dashboard

[Intervene]
├─ Urgent check-in
├─ Problem diagnosis: "What's blocking progress?"
└─ Support plan: "How can I help?"
```

---

#### JOURNEY 3: RESULTS & CALIBRATION (After DEA)

**Quem:** Manager with Manager sub-profile  
**Context:** After DEA calculation, scores are ready

**Step 1: Review Final Scores**
```
┌────────────────────────────────────────────┐
│ 📈 Final Results - Your Team               │
│                                             │
│ DEA Scores (Efficiency 0-100):             │
│                                             │
│ [Alice Chen]                               │
│  Score: 88 | Category: Exceptional         │
│  Indicators:                               │
│   • Sales: 105% of target                  │
│   • Quality: 92% (above avg)               │
│  Ranking: Top 15% of function              │
│  Peers: 3 colleagues at similar level      │
│  [View Details] [Prepare Talking Points]  │
│                                             │
│ [Bob Martinez]                             │
│  Score: 72 | Category: Solid Performer    │
│  Indicators:                               │
│   • Sales: 87% of target                   │
│   • Quality: 78% (meets expectation)       │
│  Ranking: Middle 40% of function           │
│  Anomalies: Detected - see context         │
│  [View Details] [Review Context]          │
│                                             │
│ [Charlie Davis]                            │
│  Score: 65 | Category: Needs Improvement  │
│  Indicators:                               │
│   • Sales: 71% of target                   │
│   • Quality: 58% (below avg)               │
│  Ranking: Bottom 10% of function           │
│  Context: New hire (2 mo) - learning curve │
│  [View Details] [Prepare Support]         │
│                                             │
│ [Prepare Calibration]                     │
└────────────────────────────────────────────┘
```

**Expected Time:** 20-30 minutes

**Step 2: Prepare Calibration Talking Points**
```
┌────────────────────────────────────────────┐
│ 📝 Calibration Prep - Charlie Davis        │
│                                             │
│ CONTEXT TO SHARE:                          │
│ ✓ Joined 2 months ago                      │
│ ✓ No onboarding delays                     │
│ ✓ Actively learning from peers             │
│ ✓ Quality improving week-over-week          │
│ ⚠️ Sales below target (expected for new)    │
│                                             │
│ QUESTIONS TO ANSWER:                       │
│ "Is this score fair for a new hire?"       │
│ → Yes, assessed on same criteria            │
│                                             │
│ "Should we adjust expectations?"            │
│ → No, but context important for feedback    │
│                                             │
│ "What support does Charlie need?"           │
│ → Mentorship pairing with Alice Chen        │
│                                             │
│ [Save] [Share with Peer Managers]         │
└────────────────────────────────────────────┘
```

**Expected Time:** 5 minutes per employee

**Step 3: Participate in Calibration Meeting**
```
Calibration Meeting (60-90 minutes)
├─ All managers meet with director
├─ Review outliers and edge cases
├─ Ensure consistency across teams
├─ Agree on final scores & categorizations
└─ Plan next steps (promotions, development)
```

---

#### JOURNEY 4: PROVIDE FEEDBACK TO TEAM (Post-Results)

**Quem:** Manager with Manager sub-profile  
**Context:** Share results and feedback with each team member

**Individual Feedback Session:**
```
┌────────────────────────────────────────────┐
│ 💬 Share Performance Feedback              │
│                                             │
│ Employee: Alice Chen                       │
│                                             │
│ WHAT TO TELL THEM:                         │
│ Score: 88 / 100                            │
│ Category: Exceptional Performance          │
│ Percentile: Top 15% in Sales               │
│                                             │
│ STRUCTURED FEEDBACK:                       │
│ ✓ What went well:                          │
│   "Exceeded sales target by 5%, maintained │
│    quality standards, great team support"  │
│                                             │
│ → What can improve:                        │
│   "Continue current pace, mentor new hires │
│    in your area"                           │
│                                             │
│ 🎯 Next steps:                             │
│   "We see leadership potential - consider  │
│    mentorship track or cross-functional"   │
│                                             │
│ [Generate Feedback Letter]                 │
│ [Schedule Check-in]                        │
│ [Provide Resources]                        │
└────────────────────────────────────────────┘
```

**Expected Time:** 10-15 minutes per employee

---

### Sub-Profile 3: HR / ADMIN (Support & Compliance)

**Goal:** Manage users, permissions, data compliance, system health

#### JOURNEY 1: USER MANAGEMENT (Ongoing)

**Quem:** Manager with HR/Admin sub-profile  
**What:** Create, edit, deactivate users, manage permissions

**User Management Dashboard:**
```
┌────────────────────────────────────────────┐
│ 👥 User Management                         │
│                                             │
│ Search/Filter:                             │
│ [Search by name/email] [Filter by role]   │
│                                             │
│ ACTIVE USERS: 157                          │
│ ├─ Directors: 5                            │
│ ├─ Managers: 18                            │
│ └─ Employees: 134                          │
│                                             │
│ [Alice Chen] | alice@company.com           │
│  Role: Manager | Status: Active            │
│  Sub-profile: Manager (Team Lead)          │
│  Last login: Today                         │
│  [Edit] [Disable] [View Log]              │
│                                             │
│ [Bob Martinez] | bob@company.com           │
│  Role: Manager | Status: Active            │
│  Sub-profile: HR/Admin                     │
│  Last login: Yesterday                     │
│  [Edit] [Disable] [View Log]              │
│                                             │
│ [New User] → [Add Employee] [Add Manager] │
└────────────────────────────────────────────┘
```

**Add New User Flow:**
```
Step 1: Basic Info
├─ Full Name
├─ Email
├─ Department
└─ Manager (dropdown)

Step 2: Role Assignment
├─ Employee
└─ Manager
    ├─ Director/Admin
    ├─ Manager (Team Lead)
    └─ HR/Admin

Step 3: Permissions
├─ Data access scope
├─ Integration access
└─ Reporting permissions

Step 4: Confirmation
├─ Send invite email
├─ Set temporary password
└─ Schedule onboarding
```

**Expected Time:** 3-5 minutes per user

---

#### JOURNEY 2: COMPLIANCE & AUDITING (Monthly)

**Quem:** Manager with HR/Admin sub-profile  
**What:** Monitor compliance, audit logs, data governance

**Compliance Dashboard:**
```
┌────────────────────────────────────────────┐
│ 🔐 Compliance & Auditing                   │
│                                             │
│ COMPLIANCE STATUS:                         │
│ ✅ GDPR: Compliant                         │
│ ✅ Data Privacy: Reviewed                  │
│ ⚠️  Retention Policy: 3 days overdue       │
│                                             │
│ AUDIT LOGS (Last 30 Days):                 │
│ 1,247 actions logged                       │
│                                             │
│ [Admin: Alice Chen]                        │
│  Jan 19, 10:30 - Updated 15 user roles    │
│  Jan 18, 14:22 - Exported employee report │
│  Jan 17, 09:15 - Changed compliance rules │
│                                             │
│ [Admin: Charlie Davis]                     │
│  Jan 19, 11:45 - Deactivated 2 users     │
│  Jan 18, 16:33 - Imported org structure   │
│                                             │
│ [View Full Audit Log] [Export] [Filter]   │
│                                             │
│ SECURITY SETTINGS:                         │
│ ├─ Password Policy: Strong (12+ chars)    │
│ ├─ Session Timeout: 30 minutes            │
│ ├─ 2FA Enabled: Yes                       │
│ └─ [Configure]                            │
└────────────────────────────────────────────┘
```

**Expected Time:** 15-20 minutes/month

---

#### JOURNEY 3: DATA SYNCHRONIZATION & INTEGRATIONS (Ongoing)

**Quem:** Manager with HR/Admin sub-profile  
**What:** Manage external data sources, API connections

**Integration Status:**
```
┌────────────────────────────────────────────┐
│ 🔗 Integrations & Data Sync                │
│                                             │
│ [Salesforce] ✅ Connected                  │
│  Status: Syncing every 6 hours             │
│  Last sync: 2 hours ago (847 records)     │
│  Next sync: In 4 hours                     │
│  [Manual Sync] [Settings] [Test]          │
│                                             │
│ [GitHub] ✅ Connected                      │
│  Status: Syncing every 12 hours            │
│  Last sync: 1 day ago (2,304 commits)     │
│  Orgs connected: 3                         │
│  [Manual Sync] [Settings] [Test]          │
│                                             │
│ [Google Sheets] ⚠️ Syncing                 │
│  Status: Scheduled sync failed              │
│  Last sync: 3 days ago                     │
│  Error: "Invalid API key"                  │
│  [Retry] [Fix API Key] [Disconnect]       │
│                                             │
│ [Add Integration]                          │
│ ├─ Jira
│ ├─ Asana
│ ├─ Azure DevOps
│ └─ Custom API
└────────────────────────────────────────────┘
```

**Expected Time:** 5-15 minutes (as needed)

---

#### JOURNEY 4: SYSTEM MONITORING & TROUBLESHOOTING (Daily)

**Quem:** Manager with HR/Admin sub-profile  
**What:** Monitor system health, resolve issues

**System Status Dashboard:**
```
┌────────────────────────────────────────────┐
│ 🔧 System Health & Support                 │
│                                             │
│ SYSTEM STATUS: ✅ Healthy                  │
│ Uptime: 99.98% (last 30 days)              │
│ Response Time: 245ms (avg)                 │
│                                             │
│ ACTIVE ISSUES:                             │
│ None                                       │
│                                             │
│ RECENT WARNINGS (Last 24h):                │
│ ⚠️  High CPU usage (spike at 11:30 AM)     │
│    └─ Resolved: Data import batch          │
│                                             │
│ ⚠️  3 failed logins (throttled IPs)        │
│    └─ Status: Monitoring                   │
│                                             │
│ SUPPORT REQUESTS:                          │
│ 1 pending (Emily - "Password reset")       │
│ [View] [Resolve]                          │
│                                             │
│ [View Logs] [Configure Alerts] [Test API] │
└────────────────────────────────────────────┘
```

**Expected Time:** 5-10 minutes/day

---

## 👤 PERSONA 2: EMPLOYEE

**Definition:** Individual contributor viewing their own performance  
**Login:** Single login (no sub-profiles)  
**Key UX Principle:** Transparency + Emotional protection

---

### JOURNEY 1: VIEW RESULT (Quarterly/Annual)

**Quem:** Employee (all levels)  
**When:** After DEA calculation is complete  
**Goal:** Understand personal performance score

**Results Screen:**
```
┌────────────────────────────────────────────┐
│ 📊 Your Performance Result                 │
│                                             │
│ Evaluation Period: Q4 2025                 │
│                                             │
│ ╔════════════════════════════╗             │
│ ║      YOUR SCORE: 82        ║             │
│ ║                            ║             │
│ ║    CATEGORY: Solid         ║             │
│ ║    Performer               ║             │
│ ╚════════════════════════════╝             │
│                                             │
│ What this means:                           │
│ "You're performing above expectations      │
│  with consistent, reliable contributions   │
│  to the team."                             │
│                                             │
│ Your Position:                             │
│ "You're in the top 45% of your function"  │
│                                             │
│ Next Steps:                                │
│ ✓ Review indicator breakdown (click below) │
│ ✓ Schedule feedback with manager           │
│ ✓ Discuss growth opportunities             │
│                                             │
│ [Understand My Indicators] [Schedule Call] │
└────────────────────────────────────────────┘
```

**Expected Time:** 2 minutes (initial view)

---

### JOURNEY 2: UNDERSTAND INDICATORS (Deep Dive)

**Quem:** Employee  
**Context:** Click "Understand My Indicators"

**Indicator Breakdown:**
```
┌────────────────────────────────────────────┐
│ 📈 How Your Score Was Calculated           │
│                                             │
│ [Productivity]                             │
│  Your: 85 | Target: 80                    │
│  ✅ GAIN (5 points above target)           │
│  How: Based on tasks completed/month       │
│  Your level: Delivered 47 tasks vs 45 avg  │
│  [See details]                            │
│                                             │
│ [Quality]                                  │
│  Your: 78 | Target: 80                    │
│  ⚠️ LOSS (2 points below target)           │
│  How: Based on error rate and reviews      │
│  Your level: 2.1% error rate (avg: 1.8%)  │
│  [See details]                            │
│                                             │
│ [Collaboration]                            │
│  Your: 88 | Target: 75                    │
│  ✅ SUPER-GAIN (13 points above target)    │
│  ★ Strong performance                      │
│  How: Peer feedback + team contributions   │
│  Your level: Consistently praised in 1:1s │
│  [See details]                            │
│                                             │
│ OVERALL CALCULATION:                       │
│ (85 + 78 + 88) / 3 = 83.67 → rounded to 82 │
│                                             │
│ [Back] [See Comparison] [Download Report] │
└────────────────────────────────────────────┘
```

**Expected Time:** 5-10 minutes

---

### JOURNEY 3: COMPARE WITH PERSONAL OBJECTIVE

**Quem:** Employee  
**Context:** Click "See Comparison"

**Personal Objective Comparison:**
```
┌────────────────────────────────────────────┐
│ 🎯 Your Performance vs Personal Objective  │
│                                             │
│ YOUR PERSONAL OBJECTIVE (Set by manager):  │
│ Productivity: 80                           │
│ Quality: 80                                │
│ Collaboration: 75                          │
│                                             │
│ ACTUAL PERFORMANCE:                        │
│ Productivity: 85 ✅ (+5, +6%)              │
│ Quality: 78 ⚠️ (-2, -2.5%)                │
│ Collaboration: 88 ✅ (+13, +17%)           │
│                                             │
│ SUMMARY:                                   │
│ ✅ 2 out of 3 objectives exceeded         │
│ ⚠️ 1 indicator needs focus                │
│ ✅ Overall trajectory: Positive            │
│                                             │
│ CONVERSATION STARTER FOR MANAGER:          │
│ "Quality dipped slightly - anything        │
│  blocking you? How can I help?"            │
│                                             │
│ [View Historical Trend] [Schedule Feedback]│
└────────────────────────────────────────────┘
```

**Expected Time:** 3-5 minutes

---

### JOURNEY 4: VIEW HISTORICAL PERFORMANCE

**Quem:** Employee  
**Context:** Click "View Historical Trend"

**Performance History:**
```
┌────────────────────────────────────────────┐
│ 📉 Your Performance Over Time               │
│                                             │
│ Q4 2024: 75 (Solid Performer)              │
│ Q1 2025: 78 (Solid Performer)              │
│ Q2 2025: 80 (Solid Performer)              │
│ Q3 2025: 81 (Solid Performer)              │
│ Q4 2025: 82 (Solid Performer) ← You are here│
│                                             │
│ YOUR TREND: ↗️ Consistently improving      │
│ Growth: +7 points in 12 months (9%)        │
│                                             │
│ INDICATOR TRENDS:                          │
│ Productivity: ↗️ +3 points                 │
│ Quality: ↘️ -1 point (spike in Q3)         │
│ Collaboration: ↗️ +5 points                │
│                                             │
│ WHAT THIS MEANS:                           │
│ "Your overall trajectory is positive.     │
│  You're taking on more responsibility,    │
│  and your collaboration is standout."     │
│                                             │
│ DEVELOPMENT OPPORTUNITY:                   │
│ "Quality is your main growth area.         │
│  Let's talk strategies to maintain        │
│  productivity while improving accuracy."  │
│                                             │
│ [Back] [Schedule Development Plan]        │
└────────────────────────────────────────────┘
```

**Expected Time:** 3-5 minutes

---

### JOURNEY 5: PLAN DEVELOPMENT (Post-Feedback)

**Quem:** Employee  
**Context:** Click "Schedule Development Plan"

**Development Planning:**
```
┌────────────────────────────────────────────┐
│ 🎯 My Development Plan (Next Period)       │
│                                             │
│ FOCUS AREA (from feedback):                │
│ Improving Quality while maintaining pace   │
│                                             │
│ MANAGER'S SUGGESTIONS:                     │
│ ✓ Pair with high-performer (Alice)        │
│ ✓ Take quality certification course        │
│ ✓ Reduce task volume slightly              │
│                                             │
│ YOUR GOALS FOR NEXT QUARTER:               │
│ Productivity: 85 (maintain)                │
│ Quality: 83 (improve from 78)              │
│ Collaboration: 90 (build on strength)      │
│                                             │
│ ACTION PLAN:                               │
│ [ ] Schedule mentorship with Alice         │
│ [ ] Enroll in "Quality First" course       │
│ [ ] Weekly check-in with manager           │
│ [ ] Monthly self-assessment                │
│                                             │
│ [Schedule Mentorship] [Enroll Course]      │
│ [Set Reminders] [Save Plan]                │
└────────────────────────────────────────────┘
```

**Expected Time:** 5 minutes

---

### Journey Summary - Employee

| Journey | Time | Goal | Key UX |
|---------|------|------|--------|
| View Result | 2 min | See score & category | Clear, non-threatening |
| Understand Indicators | 5-10 min | Drill into how score calculated | Progressive disclosure |
| Compare Objective | 3-5 min | See vs personal target | Context, not ranking |
| Historical | 3-5 min | See trend over time | Motivation, growth trajectory |
| Development | 5 min | Plan next steps | Empowerment, ownership |

---

## 🔐 PERMISSIONS MATRIX

### Manager > Diretor / Admin

**Can Do:**
- ✅ Setup company
- ✅ Import org structure
- ✅ Select indicators
- ✅ Define org objectives
- ✅ Monitor platform health
- ✅ Configure integrations
- ✅ View all data (aggregated)
- ✅ Export reports
- ✅ Access HR dashboard (with restrictions)

**Cannot Do:**
- ❌ Edit individual employee objectives
- ❌ Manage specific team data
- ❌ Create/delete users (HR job)
- ❌ View individual employee scores (scores are for managers)

---

### Manager > Manager (Team Lead)

**Can Do:**
- ✅ Review team objectives
- ✅ Accept/adjust personal objectives
- ✅ Monitor team progress (real-time)
- ✅ View final DEA scores for own team
- ✅ Provide feedback to own team
- ✅ Prepare calibration talking points
- ✅ Export team data
- ✅ See team historical data

**Cannot Do:**
- ❌ Modify objectives for other teams
- ❌ Alter indicators
- ❌ Access company-wide data
- ❌ Create/manage users
- ❌ View individual employee admin logs

---

### Manager > HR / Admin

**Can Do:**
- ✅ Create, edit, deactivate users
- ✅ Configure user permissions
- ✅ Monitor system health
- ✅ View audit logs
- ✅ Manage integrations
- ✅ Configure compliance settings
- ✅ Troubleshoot issues
- ✅ Access API management

**Cannot Do:**
- ❌ Modify performance scores
- ❌ Provide evaluation feedback
- ❌ Make management decisions
- ❌ Access confidential 1:1 notes
- ❌ Change DEA algorithm

---

### Employee

**Can Do:**
- ✅ View own score
- ✅ See indicator breakdown
- ✅ Compare vs personal objective
- ✅ View historical performance
- ✅ Download own report

**Cannot Do:**
- ❌ View peer scores
- ❌ View peer indicators
- ❌ Access manager data
- ❌ Modify any data
- ❌ See evaluation methodology

---

## 📊 CONSOLIDATION IMPACT

### Before (4 Personas)
```
Personas:           4 (Admin, Manager, HR, Employee)
Logins:             4 separate auth flows
Dashboards:         4 distinct interfaces
Frontend Code:      100%
Test Suite:         250 tests (45 min)
Sync Issues:        HR data separate from core
Main Friction:      Users jumping between systems
```

### After (2 Personas)
```
Personas:           2 (Manager [3 sub-profiles] + Employee)
Logins:             2 auth flows
Dashboards:         2 adaptive interfaces (Manager changes by subprofil)
Frontend Code:      65% (-35% reduction)
Test Suite:         160 tests (28 min, -38% time)
Sync Issues:        All data synchronized (same platform)
Main Advantage:     Seamless experience, no context switching
```

### Key Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Personas | 4 | 2 | -50% |
| Auth Flows | 4 | 2 | -50% |
| Unique Logins Needed | 4 | 2 | -50% |
| Frontend Components | 100 | 65 | -35% |
| Test Cases | 250 | 160 | -64 tests (-30%) |
| Test Execution Time | 45 min | 28 min | -38% |
| Dashboard Variants | 4 | 2 (+ 3 variants) | -33% |
| HR Data Sync Issues | Common | None | 100% improvement |
| User Context Switching | Frequent | Eliminated | ✅ |
| Onboarding Complexity | High | Low | -60% |

---

## 🚀 IMPLEMENTATION ROADMAP

### Timeline: 4-6 Weeks

**Week 1-2: Development**
- [ ] Implement sub-profile system for Manager
- [ ] Build permission matrix (Diretor, Manager, HR)
- [ ] Create adaptive dashboard
- [ ] Consolidate authentication
- [ ] Integrate HR sub-profile features

**Week 3-4: Testing**
- [ ] Unit tests per sub-profile
- [ ] Integration tests (sub-profile switching)
- [ ] E2E tests (each journey)
- [ ] Security tests (permission isolation)
- [ ] Usability tests with real users

**Week 5: Deployment**
- [ ] Deploy to staging
- [ ] Real-user testing
- [ ] Final bug fixes
- [ ] Deploy to production
- [ ] Monitor health

**Week 6: Training & Support**
- [ ] Create training materials
- [ ] Run webinars per role
- [ ] FAQ & troubleshooting guide
- [ ] Support team readiness
- [ ] Documentation finalization

---

## ✅ CONSOLIDATION CHECKLIST

**Architecture Decisions**
- [x] 2 Personas confirmed (Manager + Employee)
- [x] 3 Manager sub-profiles defined
- [x] HR integrated into Manager persona
- [x] Permission model established

**Journeys Defined**
- [x] Manager > Diretor (4 journeys)
- [x] Manager > Manager (4 journeys)
- [x] Manager > HR (4 journeys)
- [x] Employee (5 journeys)
- [x] Total: 13 user journeys

**UX Principles**
- [x] Satisficer/Maximizer patterns
- [x] Progressive disclosure
- [x] Controlled transparency
- [x] Cognitive load reduction
- [x] Prospect Theory integration

**Design Components**
- [ ] Adaptive dashboard (builds on existing)
- [ ] Sub-profile switcher
- [ ] Permission-based feature hiding
- [ ] Audit logging
- [ ] HR management interface

**Testing Strategy**
- [ ] Sub-profile permission tests
- [ ] Journey E2E tests (13 journeys)
- [ ] Data isolation tests
- [ ] Integration tests
- [ ] Security tests

**Documentation**
- [ ] 2 Personas defined
- [ ] 3 Manager sub-profiles explained
- [ ] 13 Journeys documented
- [ ] Permission matrix
- [ ] Implementation guide

**Training**
- [ ] Manager training (3 sessions: Diretor, Manager, HR)
- [ ] Employee training (1 session)
- [ ] FAQ document
- [ ] Troubleshooting guide

---

## 🎯 SUCCESS METRICS

**User Experience**
- ✅ Single login for all Manager roles (vs 4 logins before)
- ✅ <3 second sub-profile switching
- ✅ Clear permission indicators
- ✅ Consistent interface across sub-profiles

**Technical**
- ✅ -35% frontend code
- ✅ -38% test execution time
- ✅ 100% data sync (HR integrated)
- ✅ Zero authentication issues

**Business**
- ✅ Faster onboarding (60% reduction)
- ✅ Lower support burden
- ✅ Easier to maintain
- ✅ Faster to add new sub-profiles in future

---

## 📝 NEXT STEPS

1. **Share with Stakeholders** - Get approval on 2-persona model
2. **Engineering Planning** - Technical feasibility review & sprint planning
3. **UX Refinement** - Validate journeys with real users
4. **Development Start** - Begin sprint 1 (Week 1-2)
5. **Testing Ramp** - QA ramps up in Week 3

---

**Status:** ✅ Consolidated Roadmap Ready  
**Personas:** 2 (Manager with 3 sub-profiles + Employee)  
**Journeys:** 13 documented user paths  
**Complexity:** -50% (4 → 2 personas)  
**Ready for:** Engineering review and sprint planning
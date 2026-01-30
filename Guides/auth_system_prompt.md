# Authentication System - Complete Specification

## 📌 Overview

This document defines the complete authentication and authorization system for a **single-tenant SaaS platform** (one company per license, similar to Gupy). The system manages:
1. **Master User** (company owner/administrator)
2. **Employees** (end-users with view/response permissions)
3. **Session Management** (authentication lifecycle)

---

## 1. USER ROLES & PERMISSIONS

### 1.1 Master User
**Definition:** The user who performs the initial company setup and buys the software license.

**Responsibilities:**
- Creates the company setup (name, industry, size, country, employee list)
- Manages access for other users
- Can invite, edit, remove, or change roles of employees
- Cannot delete company setup (permanent once created)
- Full access to all platform features
- Only one master per company (non-transferable without support intervention)

**Permissions:**
- ✅ Create/Edit/Delete company setup
- ✅ View all dashboards and data
- ✅ Invite employees
- ✅ Promote employees to Manager
- ✅ Remove employees immediately
- ✅ Change employee roles
- ✅ Access audit logs
- ✅ View all survey results
- ✅ Configure indicators

---

### 1.2 Manager Role
**Definition:** Employee promoted by Master User to manage other employees and view aggregate data.

**Responsibilities:**
- Monitor team performance
- Respond to surveys
- View team-specific dashboards

**Permissions:**
- ✅ View assigned team data
- ✅ Respond to surveys
- ✅ View team members' results (aggregated)
- ❌ Cannot invite new users
- ❌ Cannot modify company setup
- ❌ Cannot create indicators
- ❌ Cannot access audit logs

---

### 1.3 Employee Role
**Definition:** Standard end-user invited by Master or Manager.

**Permissions:**
- ✅ View own dashboard
- ✅ View own performance data
- ✅ Respond to assigned surveys
- ✅ Update own profile
- ❌ Cannot see other employees' data
- ❌ Cannot invite users
- ❌ Cannot modify company setup

---

## 2. AUTHENTICATION FLOW

### 2.1 Master User Registration (First-Time Setup)

#### **Step 1: Account Creation**
```
User Action: Master user lands on /register

Inputs Required:
├─ Email (unique per license)
├─ Password (plain text, no strength requirements)
├─ Full Name
└─ Confirm Password

Validation:
✓ Email format is valid
✓ Password & Confirm Password match
✓ Email not already registered in system
✓ All fields non-empty

Success Response:
→ Account created in database
→ Session token generated
→ Redirect to /setup (Step 2)

Error Handling:
✗ Email already exists → "This email is already registered"
✗ Passwords don't match → "Passwords do not match"
✗ Invalid email format → "Please enter a valid email address"
```

#### **Step 2: Company Setup (Only Once)**
```
Page: /setup (only accessible if company_setup.status === "pending")

This step is already built (per your note), but ensure:
├─ Company Name
├─ Industry
├─ Company Size
├─ Country
├─ Employee List (CSV/Manual/API import)
└─ Select Indicators

After Completion:
→ company_setup.status = "completed"
→ company_setup.created_at = timestamp
→ master_user.is_setup_complete = true
→ Redirect to /dashboard
→ Setup button DISABLED for all users
```

#### **Step 3: Dashboard Access**
```
Page: /dashboard

First-Time Access (Post-Setup):
├─ Total Employees: [imported count]
├─ Active Surveys: 0
├─ Response Rate: 0%
├─ Average Indicators: 0
├─ Last Sync: [setup completion time]
├─ Sync Button: [Available to manually trigger]
└─ No tutorial/onboarding modal

All data except "Total Employees" shows as 0 until:
- Surveys are distributed
- Employees complete responses
- Manual data sync is triggered
```

---

### 2.2 Employee Invitation Flow

#### **Step 1: Master Invites Employee**
```
Action: Master clicks "Add Employee" → /invite-user

Inputs:
├─ Email
├─ Full Name
├─ Role (Employee / Manager)
└─ Department (optional)

Validation:
✓ Email format valid
✓ Email not already in company
✓ All required fields filled

Success Response:
→ Invitation record created (status: "pending")
→ Email sent to invitee with:
   - Unique invitation link
   - Company name
   - Role information
   - 24-hour expiration notice
→ Display "Invitation sent to [email]"
→ Add to invitee list (status: pending)

Error Handling:
✗ Email already invited → "This user was already invited"
✗ Email already in company → "This email is already an employee"
```

#### **Step 2: Employee Accepts Invitation**
```
Link: email.com/invite?token=unique_token

Before Password Creation:
├─ Verify token exists
├─ Check token not expired (24 hours from creation)
├─ Check company_id from token
├─ Display: "Complete your setup"

If Token Expired:
→ Show message: "This invitation has expired"
→ Button: "Request new invitation"
→ Master receives notification (optional)

Password Setup (New Account):
├─ Email (pre-filled, read-only)
├─ Password (plain text, no requirements)
├─ Confirm Password
└─ Full Name (can edit from invitation)

Success Response:
→ User account created
→ invitation.status = "accepted"
→ user.company_id = [company]
→ user.role = [invited_role]
→ user.created_at = timestamp
→ Session token generated
→ Redirect to /dashboard (read-only view)
```

---

## 3. LOGIN FLOW

### 3.1 Master User Login

```
URL: /login

Step 1: Email & Password Entry
├─ Email input
├─ Password input
└─ "Forgot Password?" link

Validation (backend):
✓ Email exists in database
✓ Password matches stored hash
✓ Account not deleted/suspended
✓ user.is_setup_complete === true

Success Response:
→ Authentication token generated (JWT or session)
→ Store token in secure HTTP-only cookie
→ Redirect to /dashboard
→ Display existing company data + zeros for metrics

Error Handling:
✗ Email not found → "Email or password incorrect"
✗ Password wrong → "Email or password incorrect"
✗ Setup incomplete → "Complete company setup before logging in"
   (Redirect to /setup)
```

### 3.2 Employee/Manager Login

```
Same as Master, but:
✓ Redirect to /dashboard
✓ Show only authorized data (own team/personal)
✓ Setup button not visible
```

---

## 4. SESSION MANAGEMENT

### 4.1 Session Duration
```
- Timeout: 1 hour of inactivity
- Multiple active sessions: YES (allowed)
  └─ User can be logged in on phone + desktop simultaneously
  └─ Each session has independent token
  
- Logout on inactivity:
  └─ Track last activity (API call, page view, input)
  └─ If 1 hour passes without activity → Logout
  └─ Show modal: "Your session expired. Please log in again"
  └─ Redirect to /login
  └─ Clear all tokens for that session only
  
- Manual logout:
  └─ Button: "Logout" available in top navigation
  └─ Clears current session token only
  └─ Other active sessions remain valid
```

### 4.2 Session Storage
```
Client-Side:
- Store token in HTTP-only cookie (secure flag)
- Store user_id + role in localStorage for UI logic
- No password stored anywhere

Server-Side:
- Keep session record with:
  ├─ session_id
  ├─ user_id
  ├─ token
  ├─ created_at
  ├─ last_activity
  ├─ expires_at (1 hour from last_activity)
  ├─ ip_address (for audit)
  └─ user_agent (device info)

Cleanup:
- Expired sessions deleted daily (cron job)
- No audit log retention specified (per your answer: no)
```

---

## 5. PASSWORD MANAGEMENT

### 5.1 Forgot Password Flow

```
URL: /forgot-password

Step 1: Email Entry
├─ Email input
├─ Button: "Send Reset Link"

Validation:
✓ Email exists in database
✓ Account not deleted

Response (regardless of email existence):
→ Always show: "If this email exists, you'll receive a password reset link"
   (Security: Don't reveal if email is registered)
→ Email sent with reset link (contains unique token)
→ Token expires in 24 hours
```

### 5.2 Password Reset

```
Link: email.com/reset-password?token=unique_token

Step 1: Reset Page
├─ Verify token exists and not expired
├─ Show: "Create a new password"

Inputs:
├─ New Password
├─ Confirm Password
└─ Button: "Reset Password"

Validation:
✓ Passwords match
✓ Token valid (not expired, not used before)
✓ New password different from old (optional, not required per spec)

Success Response:
→ Password updated in database
→ reset_token marked as "used"
→ All existing sessions terminated (force re-login on next activity)
→ Redirect to /login
→ Show: "Password reset successful. Please log in."

Error Handling:
✗ Token expired → "This link has expired. Request a new one."
✗ Token already used → "This link has already been used."
✗ Passwords don't match → "Passwords do not match"
```

---

## 6. MASTER USER ACCOUNT MANAGEMENT

### 6.1 Profile Management

```
URL: /settings/profile

Master can edit:
├─ Full Name
├─ Phone Number (optional)
└─ Profile Picture (optional)

Cannot edit:
❌ Email (use forgot password to change)
❌ Company Setup (permanently locked)
```

### 6.2 Account Recovery (No Master User Action)

```
Scenario: Master user forgets login or is unavailable

Resolution:
→ Employee must contact software provider (YOU)
→ Verify company identity
→ Reset master user password via email
→ No automated self-service for master transfers

(This is intentional - enterprise security best practice)
```

---

## 7. EMPLOYEE MANAGEMENT (Master User Only)

### 7.1 Invite New Employee

```
URL: /admin/employees

Form:
├─ Email (unique per company)
├─ Full Name
├─ Role dropdown (Employee / Manager)
└─ Department (optional)

Actions:
✓ Send invitation (24-hour token)
✓ View pending invitations
✓ Cancel pending invitation (expires automatically at 24h)
✓ Resend invitation email

Invitation List displays:
├─ Email
├─ Status (Pending / Accepted / Expired)
├─ Sent Date
├─ Expires Date (24h from send)
└─ Actions (Resend / Cancel)
```

### 7.2 Manage Active Employees

```
URL: /admin/employees/active

List displays all accepted employees:
├─ Email
├─ Full Name
├─ Role (Employee / Manager)
├─ Department
├─ Joined Date
└─ Actions

Actions Available:
✓ Change Role:
  └─ Employee → Manager (promote)
  └─ Manager → Employee (demote)
  └─ Changes effective immediately
  └─ No email notification (optional - suggest adding)

✓ Remove Employee:
  └─ Action: Master clicks "Remove"
  └─ Dialog: "Remove [email]? This action is immediate."
  └─ Removed immediately:
     ├─ All active sessions terminated
     ├─ Employee cannot login
     ├─ Data retained in database (not deleted)
     ├─ Can be re-invited with new link
  └─ No undo button (by design)

✓ View Employee Details:
  └─ Profile info
  └─ Survey responses (if any)
  └─ Activity history (optional feature)
```

### 7.3 Data Retention After Removal

```
When employee is removed:
├─ User account marked as deleted (soft delete)
├─ Sessions terminated
├─ Cannot login
├─ Responses to surveys: RETAINED (for reporting)
├─ Personal data: RETAINED (for GDPR compliance - 1 year retention)

If re-invited with same email:
→ New user account created (different user_id)
→ Old data remains under old user_id
```

---

## 8. DASHBOARD ACCESS CONTROL

### 8.1 Master User Dashboard
```
URL: /dashboard

Visible Content:
├─ Total Employees: [from setup]
├─ Active Surveys: [count]
├─ Response Rate: [percentage]
├─ Average Scores (all indicators): [0 until responses]
├─ Survey Results (all employees)
├─ Sync Button: [to manually trigger data refresh]
└─ Employee Management Link

NOT visible:
❌ Setup page (disabled, locked)
❌ Edit indicators (protected)
```

### 8.2 Manager Dashboard
```
Same as Master, but:
├─ Only shows data for assigned team
├─ Cannot access employee management
├─ Cannot modify indicators
```

### 8.3 Employee Dashboard
```
URL: /dashboard

Visible:
├─ Own survey responses
├─ Own performance metrics
└─ Personal profile

NOT visible:
❌ Other employees' data
❌ Company-wide metrics
❌ Employee list
❌ Admin functions
```

---

## 9. SECURITY REQUIREMENTS

### 9.1 Password Handling
```
- Hash algorithm: bcrypt (recommended) or Argon2
- Never store plain-text passwords
- Never send passwords via email
- Salt: automatic with bcrypt
- Password requirements: NONE (as per spec)
  └─ User can create "password" if they want
  └─ No complexity rules enforced
  └─ UX benefit: faster onboarding
```

### 9.2 Session Security
```
- Token type: JWT or secure session cookie
- HTTP-only cookie: YES
- Secure flag: YES (HTTPS only)
- SameSite: Strict or Lax
- CSRF protection: Implement CSRF tokens for POST/PUT/DELETE

- Token expiration: 1 hour inactivity
- Token refresh: Optional (implement for better UX)
- Multi-session: Allowed (no single-session restriction)
```

### 9.3 Email Verification
```
- Invitation links are secure tokens (random, unguessable)
- Reset password links are secure tokens
- Both expire after 24 hours
- Tokens should NOT be guessable (use crypto.randomBytes)
- Link format: unique token only, company_id in database lookup
```

### 9.4 Audit Logging (GDPR Compliance)
```
Log these events:
├─ User registration
├─ User login (success + failure)
├─ User logout
├─ Password reset request
├─ Invitation sent
├─ Invitation accepted
├─ Invitation expired
├─ Employee removed
├─ Role changed
├─ Company setup completed
└─ Session timeout

Data retained: 1 year
Retention policy: Auto-delete after 1 year
Access: Master user can view if needed (optional UI)
No retention specification for failed login attempts (suggest: 90 days)
```

---

## 10. ERROR HANDLING & MESSAGES

### 10.1 Authentication Errors

```
Login Failures:
- "Email or password incorrect" (generic, no email leak)
- "This account has been deleted"
- "Too many login attempts. Try again in 15 minutes" (rate limit)

Registration Errors:
- "This email is already registered"
- "Passwords do not match"
- "Invalid email format"

Invitation Errors:
- "Invitation expired" (after 24h)
- "Invitation already accepted"
- "Invalid invitation link"

Password Reset:
- "If this email exists, you'll receive a reset link"
- "Reset link expired"
- "Passwords do not match"
```

### 10.2 Success Messages

```
- "Account created successfully"
- "Invitation sent to [email]"
- "Invitation accepted. Welcome!"
- "Password reset successful"
- "Login successful. Welcome back"
- "Employee removed"
- "Role updated"
- "Session expired. Please log in again"
```

---

## 11. TECHNICAL SPECIFICATIONS

### 11.1 Database Schema (Minimal)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('master', 'manager', 'employee') DEFAULT 'employee',
  is_setup_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP NULL (soft delete)
);

-- Company table
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  size INT,
  country VARCHAR(100),
  setup_status ENUM('pending', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('manager', 'employee') DEFAULT 'employee',
  status ENUM('pending', 'accepted', 'expired') DEFAULT 'pending',
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP,
  last_activity TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit log (GDPR)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  user_id UUID,
  event_type VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 11.2 API Endpoints

```
Authentication:
POST   /api/auth/register          → Register master user
POST   /api/auth/login             → Login any user
POST   /api/auth/logout            → Logout
POST   /api/auth/forgot-password   → Send reset email
POST   /api/auth/reset-password    → Reset password via token
POST   /api/auth/validate-token    → Check if session valid

Invitations:
POST   /api/invitations            → Create invitation (master only)
GET    /api/invitations            → List invitations (master only)
POST   /api/invitations/:token/accept → Accept invitation
DELETE /api/invitations/:id        → Cancel invitation (master only)
POST   /api/invitations/:id/resend → Resend invitation (master only)

Employees:
GET    /api/employees              → List active employees (master only)
PATCH  /api/employees/:id/role     → Change role (master only)
DELETE /api/employees/:id          → Remove employee (master only)

Profile:
GET    /api/profile                → Get own profile
PATCH  /api/profile                → Update own profile

Company:
GET    /api/company                → Get company info (all users)
POST   /api/company/setup          → Initial setup (master, once only)

Sessions:
GET    /api/sessions               → List active sessions (user's own only)
DELETE /api/sessions/:id           → Logout from specific device
```

---

## 12. FEATURE ROADMAP (Suggestions)

Based on the spec, these features could enhance the system:

1. **Role-Based Notifications**
   - Notify manager when employee removes self
   - Notify master when invitation expires
   - Notify user when new role assigned

2. **Activity Dashboard (Master)**
   - Last login times per employee
   - Survey completion timeline
   - Data sync history

3. **Bulk Employee Management**
   - Import employees from CSV/API
   - Bulk role changes
   - Bulk email campaigns

4. **SSO Integration (Future)**
   - Google Workspace SSO
   - Microsoft Entra ID (Office 365)
   - SAML for enterprise customers

5. **Device Management**
   - View active sessions
   - "Logout from all devices"
   - Device-specific logout

6. **Email Customization**
   - Branded invitation emails
   - Custom logo/colors
   - Translated emails (i18n)

7. **API Rate Limiting**
   - Prevent brute-force attacks
   - Limit password reset requests (e.g., 3 per hour)
   - Limit login attempts (e.g., 5 failures = 15 min lockout)

---

## 13. IMPLEMENTATION PRIORITY

**Phase 1 (MVP):**
- ✅ User registration
- ✅ Company setup (existing)
- ✅ Login/logout
- ✅ Session timeout (1 hour)
- ✅ Forgot password
- ✅ Invite employees
- ✅ Manage employees (remove/role change)
- ✅ Dashboard access control

**Phase 2 (Enhancement):**
- 📋 Audit logging
- 📋 Resend invitation
- 📋 Cancel invitation
- 📋 Activity history
- 📋 GDPR data export

**Phase 3 (Future):**
- 🔮 2FA (optional)
- 🔮 SSO integration
- 🔮 IP whitelisting
- 🔮 Device management

---

## 14. TESTING CHECKLIST

```
Unit Tests:
- [ ] Password hashing & verification
- [ ] Token generation & validation
- [ ] Email uniqueness enforcement
- [ ] Role-based permission checks
- [ ] Session expiration logic

Integration Tests:
- [ ] Complete registration flow
- [ ] Complete login flow
- [ ] Invitation workflow (send → accept)
- [ ] Password reset workflow
- [ ] Employee removal & role change
- [ ] Session timeout after 1 hour inactivity
- [ ] Multiple concurrent sessions per user

E2E Tests (Selenium/Cypress):
- [ ] Master user onboarding
- [ ] Employee invitation & acceptance
- [ ] Login as different roles
- [ ] Dashboard data visibility per role
- [ ] Logout functionality
- [ ] Session persistence across page reload

Security Tests:
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] Brute-force protection on login
- [ ] Token cannot be guessed
- [ ] Invitation links expire correctly
- [ ] Deleted users cannot access system
```

---

## 15. COMPLIANCE & BEST PRACTICES

### 15.1 GDPR Compliance
```
✅ Audit logging (1 year retention)
✅ Right to be forgotten (soft delete + data retention)
✅ Data export (future feature)
✅ Consent on registration (future feature)
✅ Privacy policy (required on registration)

❌ Not required (per spec):
- Two-factor authentication
- Data encryption at rest (implement anyway)
```

### 15.2 Security Best Practices
```
✅ HTTPS only
✅ HTTP-only cookies
✅ Secure CSRF tokens
✅ Rate limiting on sensitive endpoints
✅ Input validation on all endpoints
✅ Prepared statements for SQL queries
✅ No sensitive data in logs

❌ Not required (per spec):
- Password complexity rules
- Email verification (registration)
- IP whitelisting
```

---

## 16. GLOSSARY

| Term | Definition |
|------|-----------|
| **Master User** | User who performs company setup; has all permissions |
| **Manager** | Employee promoted by master; can view team data |
| **Employee** | Standard end-user; views only own data |
| **Setup** | One-time company configuration (name, industry, size, country, employees) |
| **Invitation Token** | Unique secure link sent to new employees; expires in 24h |
| **Session** | Active login period; expires after 1h inactivity |
| **Soft Delete** | Mark as deleted in database without removing record |
| **GDPR** | General Data Protection Regulation (EU privacy law) |
| **Audit Log** | Record of all authentication/authorization events |

---

## 📝 Notes

1. This is a **single-tenant SaaS** (one company per license)
   - No need for multi-company user switching
   - No need for company invitations

2. **Setup is permanent** - Cannot be modified or deleted
   - By design, for data integrity
   - If company details change, they must contact support

3. **Master user is permanent** - Cannot be transferred
   - No "transfer ownership" feature
   - Support intervention required only

4. **Multiple active sessions** - User can be logged in on phone + desktop
   - Useful for mobile access while working on desktop
   - Each device gets independent token

5. **No 2FA** - Simpler onboarding, trade-off accepted
   - HTTPS + secure cookies + session timeout mitigates risk
   - Future enhancement option

6. **Simple password policy** - No complexity requirements
   - Reduces friction, improves adoption
   - Users can still create strong passwords if they want

7. **Email-based recovery only** - For both forgot password & master account recovery
   - Master account transfer requires support intervention
   - Prevents unauthorized access during onboarding

---

**Document Version:** 1.0  
**Last Updated:** January 20, 2026  
**Status:** Ready for Development

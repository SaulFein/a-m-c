---
name: secure-action
description: Audit all server actions for authentication, input validation, and security issues
---

# Server Action Security Audit

Audit all server actions for security issues.

## Instructions

Read every file in `web/src/actions/` and check each exported function for:

### 1. Authentication
- Every function that **mutates data** (create, update, delete, upsert) MUST call `auth()` and verify the session exists
- Public read functions (get*) do NOT need auth
- Flag any mutation without auth as **CRITICAL**

### 2. Input Validation
- Every function accepting user input MUST validate with a Zod schema before passing to Prisma
- Check that the Zod schema exists in `web/src/lib/validations/` or inline
- Flag any unvalidated input as **HIGH**

### 3. Authorization
- Auth-protected functions should check that the user's email is in the admin list (or that a valid session exists from Auth.js which already enforces this)
- Flag any function that authenticates but doesn't properly authorize as **HIGH**

### 4. Data Exposure
- Server actions returning data should not leak sensitive fields (passwords, tokens, internal IDs unnecessarily)
- Check that Prisma `select` or response shaping doesn't over-expose data
- Flag as **MEDIUM**

### 5. Injection
- Check for any raw MongoDB queries or string interpolation in queries
- Prisma parameterizes by default, but verify no `$runCommandRaw` or `$queryRaw` usage
- Flag as **CRITICAL** if found

### 6. Rate Limiting / Abuse
- Note any public-facing actions (contact forms, inquiries) that lack rate limiting
- Flag as **LOW** (informational)

### Output format:

```
## Security Audit Report

### Summary
- Critical: N
- High: N
- Medium: N
- Low: N

### Findings

#### [SEVERITY] [Finding title]
- **File**: `src/actions/[file].ts`
- **Function**: `functionName()`
- **Issue**: Description
- **Fix**: Recommended remediation

### Passing Checks
- [function]: auth check present, input validated, no data exposure
```

---
name: cleanup-legacy
description: Analyze legacy AngularJS/Express code and generate a safe removal plan
---

# Legacy Code Cleanup Assistant

Analyze the legacy AngularJS/Express code and generate a safe removal plan.

## Instructions

### Step 1: Verify no cross-references

Check that **nothing** in `web/` imports or references files from the legacy directories:
- `app/` (AngularJS)
- `routes/` (Express)
- `models/` (Mongoose)
- `lib/` (legacy auth utils)
- `config/` (legacy config)
- `server.js`

Search for any imports, requires, or path references in `web/src/` that point outside of `web/`.

### Step 2: Check deployment configuration

Read these files for references to legacy code:
- `Procfile` (Heroku process definition)
- Root `package.json` (scripts, dependencies)
- Any Heroku config files or buildpacks
- `.gitignore` at root level
- Any CI/CD configuration files

### Step 3: Identify what's safe to remove

Categorize all legacy files:

**Safe to delete** - No references from new code, no deployment dependency:
- List each file/directory

**Needs migration first** - Still referenced or needed:
- List each file with what depends on it

**Keep for reference** - Not needed but useful as documentation:
- Suggest what might be worth keeping temporarily

### Step 4: Generate removal plan

Provide a staged removal plan:

```
## Legacy Cleanup Plan

### Phase 1: Verify (before deleting anything)
- [ ] Confirm Next.js app builds and runs independently
- [ ] Confirm deployment doesn't depend on legacy files

### Phase 2: Remove dead code
- [ ] Delete: [files/dirs]
- [ ] Reason: [why safe]

### Phase 3: Update configuration
- [ ] Update Procfile to point to Next.js
- [ ] Update root package.json or remove it
- [ ] Update .gitignore

### Phase 4: Clean up
- [ ] Remove unused root dependencies
- [ ] Delete node_modules and reinstall
- [ ] Verify build still works
```

Do NOT actually delete anything. Only produce the plan and wait for user confirmation.

$ARGUMENTS

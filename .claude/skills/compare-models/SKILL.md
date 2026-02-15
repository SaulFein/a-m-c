---
name: compare-models
description: Compare legacy Mongoose models against Prisma schema to verify field-level parity
---

# Compare Mongoose vs Prisma Models

Verify that the Prisma schema accurately maps all fields from the legacy Mongoose models.

## Instructions

### Step 1: Read all Mongoose models

Read every file in the root `models/` directory:
- `models/car.js`
- `models/service.js`
- `models/storage.js`
- `models/home.js`
- `models/user.js`
- `models/index.js`

For each model, extract:
- All field names
- Field types
- Required/optional status
- Default values
- Any virtual fields or methods

### Step 2: Read the Prisma schema

Read `web/prisma/schema.prisma` and extract the same information for each model.

### Step 3: Compare field-by-field

For each model pair (Mongoose vs Prisma):

```
## Model: [Name]

### Field Comparison
| Field | Mongoose | Prisma | Match? |
|-------|----------|--------|--------|
| name  | String, required | String | Yes |
| desc  | String, optional | - | MISSING |

### Missing in Prisma
- [field]: [type] - [impact of being missing]

### Extra in Prisma (new fields)
- [field]: [type] - [purpose]

### Type Mismatches
- [field]: Mongoose=[type] vs Prisma=[type]
```

### Step 4: Check MongoDB collection mapping

Verify that Prisma's `@@map()` directives point to the correct MongoDB collection names that the legacy app uses. Read the Mongoose model to find the collection name (either explicit or auto-generated from model name).

### Step 5: Summary

Provide an overall compatibility assessment:
- Can the Next.js app read all existing data?
- Are there any fields that will be lost or corrupted?
- Any recommended schema updates?

$ARGUMENTS

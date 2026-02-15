---
name: check-build
description: Run the Next.js build and report any TypeScript or compilation errors
---

# Check Build

Run the Next.js build in the `web/` directory and report any errors.

## Instructions

1. Run `npm run build` in the `web/` directory
2. If the build succeeds, report success with a brief summary
3. If the build fails, parse the output and report:
   - Each error grouped by file
   - The specific line numbers and error messages
   - A suggested fix for each error
4. If there are warnings (but build succeeds), list them separately

Keep the output concise. Don't repeat the raw build output -- summarize it.

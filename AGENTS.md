# AGENTS.md

## Mission
Implement UI in this repository following the Digital Agency Design System (DADS) HTML example components.

## Source of truth (DADS)
The canonical reference for markup, classes, and behavior is the submodule:
- vendor/dads-html/

Primary locations to consult:
- vendor/dads-html/src/components/**   (component markup/structure)
- vendor/dads-html/src/**             (shared utilities if present)
- vendor/dads-html/src/global.css      (global styles if present)

When there is a conflict between our existing code and DADS patterns, prefer DADS unless explicitly instructed otherwise.

## Allowed / forbidden changes
You MAY modify:
- src/**
- public/**
- tests/**
- package.json, lockfiles, config files (only if needed for the task)

You MUST NOT modify:
- vendor/dads-html/**   (submodule is read-only reference)
- .gitmodules

If a change seems necessary inside vendor/dads-html, propose an alternative in our codebase instead.

## Implementation rules (DADS compliance)
- Match DADS markup structure and class names as closely as possible.
- Preserve states and interactions (hover/focus/disabled/aria).
- Accessibility is non-negotiable:
  - Use semantic HTML first.
  - Ensure keyboard operability.
  - Ensure focus is visible.
  - Use appropriate ARIA only when necessary (avoid redundant ARIA).

## Workflow for tasks
1. Locate the relevant DADS component under vendor/dads-html/src/components/.
2. Replicate the structure in our component under src/ (do not copy blindly; adapt paths/imports).
3. Add/adjust styles in our codebase (not in vendor/).
4. Add tests where reasonable (unit/integration/e2e depending on project).
5. Run formatter/linter/tests and ensure no changes occurred under vendor/.

## Attribution / licensing note
When copying code patterns, keep a short attribution comment in the destination file
(e.g., "Based on digital-go-jp/design-system-example-components-html").
Do not copy large chunks unnecessarily.

## Output expectations
- Provide a short summary of changes.
- List which DADS reference files were consulted (paths under vendor/dads-html).
- Mention any deviations from DADS and why they were necessary.

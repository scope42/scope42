## Commands

```bash
npm run dev      # Start all dev servers (app on port 3000)
npm run build    # Build all packages via Turbo
npm test         # Run all tests via Turbo
npm run lint     # Lint all packages
npm run verify   # Full CI check: lint + build + test
npm run fix      # Auto-fix prettier + eslint issues (in app/)
```

## Architecture

Turborepo monorepo with npm workspaces:

- `app/` — React 18 PWA (Create React App, port 3000)
- `packages/scope42-data/` — Core data model library (`@scope42/data`), published to npm
- `packages/scope42-tsconfig/` — Shared TypeScript config
- `packages/eslint-config-scope42/` — Shared ESLint config
- `website/` — Docusaurus docs site (built separately: `cd website && npm ci && npm run build`)
- `examples/` — Example workspaces

## Key Files

- `app/src/data/types.ts` — Central type definitions for all item types
- `app/src/features/` — Feature modules
- `app/src/pages/` — React Router pages
- `turbo.json` — Build pipeline and env var passthrough config
- `app/prepare-resources.js` — Code generation step that runs before build

## Critical Sync Rule

When adding/changing a property on any item type (issues, risks, improvements, decisions), update **all four**:

1. Type definition in `app/src/data/types.ts`
2. Item editor in `app/src/components/ItemEditor/`
3. Page header in `app/src/pages/`
4. Graph generation in `app/src/components/Graph.ts` (for relation properties only)

## Testing

- `app/`: Jest via `react-scripts test`, uses `@testing-library/react`
- `packages/scope42-data/`: Jest + ts-jest (Node environment)
- Setup file: `app/src/setupTests.ts`

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`. Scope is optional, e.g. `feat(data):`.

## Tasks

- Consider the current task and wether the information learned can be suggested in a CLAUDE.md

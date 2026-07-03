# COSMOS — Straw Hat AI Crew Agentic OS

Backend API for the COSMOS agentic OS powering the Captain Dashboard (deployed on Vercel). Manages AI agent state, mission tracking, and token budget for Robin Vanguard, Starlight, and the COSMOS system agent.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port assigned by Replit, proxied at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec (run after any change to `lib/api-spec/openapi.yaml`)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (not yet used — mission state is in-memory)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/services/tokenBudget.ts` — Token budget tracker, queue, fallback logic
- `artifacts/api-server/src/services/neuralGrid.ts` — Neural Grid: agent state + mission state + LLM integration seam
- `artifacts/api-server/src/middlewares/tokenGuard.ts` — Checks token budget before agent routes; serves 503 fallback if critical
- `artifacts/api-server/src/routes/cosmos.ts` — `GET /api/cosmos/status` — Captain Dashboard primary feed
- `artifacts/api-server/src/routes/missions.ts` — Mission CRUD endpoints
- `artifacts/api-server/src/routes/agents.ts` — Agent list, status, dispatch, token-budget endpoints
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for all routes)
- `lib/api-client-react/` — Generated React Query hooks (do not edit manually)
- `lib/api-zod/` — Generated Zod schemas (do not edit manually)
- `README.md` — Full Vercel ↔ Replit connection guide

## Architecture decisions

- **In-memory state for MVP** — Mission and agent state live in `neuralGrid.ts` maps. Swap to PostgreSQL/Drizzle when persistence is needed.
- **Token guard middleware** — `tokenGuard` runs before every agent route. At ≤2% remaining, it short-circuits with a cached 503 fallback so the dashboard never breaks.
- **Integration seam in `neuralGrid.dispatch()`** — The mock `pickMockResponse()` call is the only place that needs replacing when wiring real LLMs (LangChain, AutoGen, etc.).
- **OpenAPI-first** — All API contracts live in `lib/api-spec/openapi.yaml`. Run codegen after any spec change to keep generated hooks in sync.
- **Route order** — Static routes (`/agents/token-budget`) are registered before parameterized routes (`/agents/:agentId/status`) in `agents.ts` to avoid Express matching the static segment as a param.

## Product

Captain Dashboard on Vercel polls `/api/cosmos/status` and `/api/missions/active` to render:
- Active mission name, progress (0–100), and system resonance (0–100)
- Per-agent status (Robin Vanguard, Starlight, COSMOS System)
- Token budget health per agent

Frontend can dispatch tasks to agents via `POST /api/agents/:agentId/dispatch`.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`.
- Do not run `pnpm dev` at the workspace root — use the Replit workflow or `pnpm --filter @workspace/api-server run dev`.
- The token refill interval (5 s) is simulated. In production, wire `tokenBudget.refill()` to real billing window events.

## Pointers

- See `README.md` for the Vercel connection guide and LLM integration instructions.
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

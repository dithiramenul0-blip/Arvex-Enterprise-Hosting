# ArveX Hosting™

Enterprise hosting company website — VPS, Minecraft, Bot, VDS, and Web hosting with full client dashboard, admin panel, billing system, and support tickets.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at /api)
- `pnpm --filter @workspace/arvex run dev` — run the frontend (port 23182, served at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, TailwindCSS, Framer Motion, shadcn/ui
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Custom JWT (HMAC-SHA256, no library dependency)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — Single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle schema files (users, plans, orders, services, tickets, partners, content)
- `artifacts/api-server/src/routes/` — Express route handlers (auth, users, plans, orders, services, tickets, partners, content, admin, stats)
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify + password hashing (no external JWT library)
- `artifacts/api-server/src/middlewares/authenticate.ts` — JWT middleware + requireAdmin guard
- `artifacts/arvex/src/` — React frontend (pages, contexts, components)

## Architecture decisions

- JWT stored client-side in `localStorage` under key `arvex_token`; signed with HMAC-SHA256 using `SESSION_SECRET`
- No external JWT library — custom implementation to minimize bundle and dependency surface
- Plans store features as JSONB array in PostgreSQL
- Public stats endpoint adds a baseline offset (1247 customers, 3891 servers) to real counts for marketing purposes
- Admin-only routes protected by `requireAdmin` middleware on top of `authenticate`

## Product

ArveX Hosting™ features:
- **Homepage**: Hero with particle animation, live stat counters, partner infinite scroll, services grid, features, CTA
- **Service Pages**: VPS, Minecraft, Bot, VDS, Web — real plan data from DB with pricing tiers
- **Client Dashboard**: My Services, Orders, Tickets (with threading), Profile/Security settings
- **Admin Panel**: User management (ban/suspend), Plan CRUD, Service management, Ticket overview, Partner manager, Content CMS
- **Auth**: Register, Login, Forgot/Reset Password with JWT
- **Content Pages**: Terms, Privacy, Refund Policy, SLA, AUP

## User preferences

_Populate as you build._

## Gotchas

- After any OpenAPI spec change, always run `pnpm --filter @workspace/api-spec run codegen` before touching frontend or backend
- `plans.price` is stored as `numeric` in Postgres → comes back as a string from Drizzle; always `parseFloat()` it before sending to the client
- The `features` column is `jsonb` → pass as `string[]` when inserting

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

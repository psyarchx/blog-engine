# blog-engine

Multi-theme blog engine with a CMS, visual page builder, and Vue-based public site.

## Stack

- **Nuxt 3** (Vue 3 + Vite + Nitro) for both apps
- **NuxtUI** + Tailwind v4
- **Drizzle ORM** + Postgres
- **Tiptap** for the post editor (Phase 2)
- **GridStack** for the page builder grid (Phase 4)
- **better-auth** for multi-user auth (Phase 1)
- **pnpm workspaces** + **Turborepo**

## Layout

```
apps/
  web/       Public blog (port 3000)
  cms/       Admin (port 3001)
packages/
  db/        Drizzle schema, client, migrations, seed
  shared/    Cross-package TypeScript types (PostContent, PageLayout, ...)
```

Future packages (added per phase): `auth`, `editor`, `blocks`, `themes`, `builder`, `ui`.

## Prerequisites

- **Node.js 20.11+** (see `.nvmrc`)
- **pnpm 10+**
- **Docker Desktop** (for local Postgres)

### Windows PATH note

If you have multiple Node installations (e.g. nvm + system), make sure Node 20+ wins on PATH.
Verify with `node --version` — must be `v20.11.0` or higher.

## Setup

```sh
# 1. Install dependencies
pnpm install

# 2. Copy env and tweak if needed
cp .env.example .env

# 3. Start Postgres
pnpm docker:up

# 4. Generate & apply migrations, then seed
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Run

```sh
# Both apps in parallel
pnpm dev

# Or one at a time
pnpm dev:web    # http://localhost:3000
pnpm dev:cms    # http://localhost:3001
```

## Other commands

```sh
pnpm build           # build all apps
pnpm typecheck       # typecheck across the monorepo
pnpm lint            # lint across the monorepo
pnpm db:studio       # open Drizzle Studio
pnpm docker:down     # stop Postgres
pnpm docker:logs     # tail Postgres logs
```

## Roadmap (MVP)

- **Phase 0** — Foundation (this commit): monorepo, scaffolds, db schema, docker.
- **Phase 1** — Auth + admin shell (users, invites, audit log).
- **Phase 2** — Posts (Tiptap editor, media library, tags, scheduling).
- **Phase 3** — Themes + public blog (modern/scholar/classic).
- **Phase 4** — Page builder (sections, 12-col grid, 8 base blocks).
- **Phase 5** — Page templates with context (PostTemplate, BlogIndex, bindings).
- **Phase 6** — Polish (newsletter, search, dashboard).

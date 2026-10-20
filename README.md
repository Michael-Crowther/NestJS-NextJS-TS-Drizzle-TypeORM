Small Todo App to learn NestJS with **TypeORM or Drizzle** (switchable), Next.js on the frontend with React and TS, and PostgreSQL.

## Usage

In the root directory:

```bash
pnpm install
pnpm dev
```

You will need to set up the DB connection, create the `todo_app` database, and run migrations.

### Switch ORM (TypeORM ↔ Drizzle)

In `apps/api/.env`:

```bash
ORM_PROVIDER=typeorm   # or: drizzle
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=todo_app
```

Both ORMs talk to the **same Postgres schema**. Controllers/services stay the same; Nest binds TypeORM or Drizzle repository implementations based on `ORM_PROVIDER`.

### Migrations (TypeORM owns DDL)

From `apps/api`:

```bash
pnpm migration:run
```

Optional Drizzle practice tools:

```bash
pnpm db:drizzle:studio
```

### Domain relationships (practice)

```
Author 1 ──* Book *──0..1 Genre
Todo (standalone)
```

- TypeORM entities: `apps/api/src/{todos,authors,books,genres}/*.entity.ts`
- Drizzle schema + `defineRelations`: `apps/api/src/database/drizzle/schema.ts`

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

import { defineConfig } from "drizzle-kit";

// Only used for `drizzle-kit generate` (schema -> SQL migration files).
// Applying migrations goes through `wrangler d1 migrations apply`, not
// drizzle-kit, so no live D1 credentials are needed here.
export default defineConfig({
	out: "./migrations",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
});

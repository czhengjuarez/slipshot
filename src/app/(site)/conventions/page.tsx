import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { conventions } from "@/db/schema";
import { ConventionsView } from "./ConventionsView";

export default async function ConventionsPage() {
	const db = await getDb();
	const rows = await db.select().from(conventions).where(eq(conventions.status, "published"));

	return (
		<div style={{ padding: "var(--space-8)" }}>
			<h1
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-2xl)",
					textTransform: "uppercase",
					color: "#fff",
					marginBottom: "var(--space-4)",
				}}
			>
				Meet Us at the Next Adventure!
			</h1>
			<p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 640, marginBottom: "var(--space-8)" }}>
				Welcome to our convention hub! Here you can find details about the exciting events where the Slipshot
				team has been featured and where we&rsquo;ll be appearing next — from sci-fi fan gatherings to unique
				exhibitor experiences, we love connecting with readers and sharing the world of the Slipshot. This is
				where we show up for the comic and anime community: our booth, our people, our fans.
			</p>

			<ConventionsView conventions={rows} />
		</div>
	);
}

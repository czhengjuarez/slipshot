import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { BlogList } from "./BlogList";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

export default async function SlipLogPage() {
	const db = await getDb();
	const rows = await db
		.select()
		.from(blogPosts)
		.where(eq(blogPosts.status, "published"))
		.orderBy(desc(blogPosts.publishedAt));

	return (
		<div style={{ padding: "var(--space-8)" }}>
			<h1
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-2xl)",
					textTransform: "uppercase",
					color: "#fff",
					marginBottom: "var(--space-6)",
				}}
			>
				The Slip-Log
			</h1>

			{rows.length === 0 ? (
				<p style={{ color: "rgba(255,255,255,0.4)" }}>No posts published yet.</p>
			) : (
				<BlogList posts={rows} categories={[...BLOG_CATEGORIES]} />
			)}
		</div>
	);
}

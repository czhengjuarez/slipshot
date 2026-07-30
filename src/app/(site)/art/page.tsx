import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { artPieces } from "@/db/schema";
import { ArtGallery } from "./ArtGallery";
import { ART_CATEGORIES } from "@/lib/artCategories";

export default async function ArtPage() {
	const db = await getDb();
	const rows = await db
		.select()
		.from(artPieces)
		.where(eq(artPieces.visibility, "public"))
		.orderBy(desc(artPieces.createdAt));

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
				Slipshot Art
			</h1>

			{rows.length === 0 ? (
				<p style={{ color: "rgba(255,255,255,0.4)" }}>No art yet — check back soon.</p>
			) : (
				<ArtGallery pieces={rows} categories={[...ART_CATEGORIES]} />
			)}
		</div>
	);
}

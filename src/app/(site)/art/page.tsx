import { getDb } from "@/db";
import { artPieces } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

export default async function ArtPage() {
	const db = await getDb();
	const rows = await db.select().from(artPieces).orderBy(artPieces.createdAt);

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
				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
					{rows.map((art) => (
						<figure key={art.id} style={{ margin: 0 }}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={mediaUrl(art.imageKey) ?? undefined}
								alt={art.title}
								style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }}
							/>
							<figcaption style={{ padding: "var(--space-2) 0" }}>
								<div style={{ color: "#fff", fontSize: "var(--text-sm)" }}>{art.title}</div>
								{art.artistCredit && (
									<div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>by {art.artistCredit}</div>
								)}
							</figcaption>
						</figure>
					))}
				</div>
			)}
		</div>
	);
}

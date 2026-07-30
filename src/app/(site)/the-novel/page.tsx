import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { books } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

export default async function TheNovelPage() {
	const db = await getDb();
	const rows = await db.select().from(books).where(eq(books.status, "published")).orderBy(books.volumeNumber);

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
				Get the Novels
			</h1>

			{rows.length === 0 && <p style={{ color: "rgba(255,255,255,0.4)" }}>No books published yet.</p>}

			{rows.map((book) => {
				const coverUrl = mediaUrl(book.coverImageKey);
				return (
					<div
						key={book.id}
						className="char-card"
						style={{ minHeight: 260, marginBottom: "var(--space-6)" }}
					>
						<div
							className="char-card-art"
							style={{
								background: coverUrl ? `url(${coverUrl}) center/cover` : "var(--color-charcoal)",
							}}
						>
							{!coverUrl && (book.volumeNumber ? `Vol. ${book.volumeNumber}` : "")}
						</div>
						<div className="char-card-content">
							{book.volumeNumber != null && (
								<span className="badge badge-yellow" style={{ marginBottom: 12, color: "#000" }}>
									Vol. {book.volumeNumber}
								</span>
							)}
							<h2
								style={{
									fontFamily: "var(--font-display)",
									fontSize: "var(--text-lg)",
									color: "#fff",
									marginBottom: "var(--space-3)",
								}}
							>
								{book.title}
							</h2>
							{book.summary && <p className="char-bio">{book.summary}</p>}
							{book.releaseDate && (
								<p style={{ color: "rgba(255,255,255,0.4)", fontSize: "var(--text-sm)" }}>
									Released {book.releaseDate}
								</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

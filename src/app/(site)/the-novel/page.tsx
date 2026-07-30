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
				const buyLinks = [
					{ label: "Get it at Amazon", url: book.amazonUrl },
					{ label: "Get it at Bookshop.org", url: book.bookshopUrl },
					{ label: "Get it at B&N", url: book.bnUrl },
				].filter((link) => link.url);

				return (
					<div
						key={book.id}
						style={{
							display: "flex",
							gap: "var(--space-8)",
							background: "var(--color-dark)",
							marginBottom: "var(--space-6)",
							padding: "var(--space-6)",
						}}
					>
						{/* Book cover: real aspect ratio, no cropping — unlike char-card-art's
						    background-cover treatment, which is meant for illustration art
						    that can crop decoratively. */}
						<div style={{ width: 160, flexShrink: 0 }}>
							{coverUrl ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={coverUrl}
									alt={`${book.title} cover`}
									style={{ width: "100%", aspectRatio: "2 / 3", objectFit: "contain", display: "block" }}
								/>
							) : (
								<div
									style={{
										width: "100%",
										aspectRatio: "2 / 3",
										background: "var(--color-charcoal)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "rgba(255,255,255,0.3)",
										fontSize: "var(--text-sm)",
									}}
								>
									{book.volumeNumber ? `Vol. ${book.volumeNumber}` : "No cover"}
								</div>
							)}
						</div>

						<div style={{ flex: 1 }}>
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
							{book.summary && (
								<p
									className="char-bio"
									style={{ maxWidth: "none" }}
								>
									{book.summary}
								</p>
							)}
							{book.releaseDate && (
								<p
									style={{
										color: "rgba(255,255,255,0.4)",
										fontSize: "var(--text-sm)",
										marginBottom: "var(--space-4)",
									}}
								>
									Released {book.releaseDate}
								</p>
							)}
							{buyLinks.length > 0 && (
								<div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
									{buyLinks.map((link) => (
										<a
											key={link.label}
											className="btn-ghost"
											href={link.url!}
											target="_blank"
											rel="noopener noreferrer"
										>
											{link.label}
										</a>
									))}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { books, characters } from "@/db/schema";
import { mediaUrl } from "@/lib/media";
import { subscribeToList } from "./join-the-list/actions";

export default async function Home() {
	const db = await getDb();

	const [featuredBook] = await db
		.select()
		.from(books)
		.where(eq(books.status, "published"))
		.orderBy(desc(books.volumeNumber))
		.limit(1);

	const featuredCharacters = await db
		.select()
		.from(characters)
		.where(eq(characters.status, "published"))
		.limit(6);

	return (
		<div>
			<section className="hero-preview">
				<div className="hero-bg" />
				<div className="hero-bg-dark" />
				<div className="hero-dot-overlay" />
				<div className="hero-content">
					<h1
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "var(--text-2xl)",
							textTransform: "uppercase",
							color: "#fff",
							lineHeight: 1.2,
							marginBottom: "var(--space-4)",
						}}
					>
						{featuredBook?.title ?? "The Slipshot Universe"}
					</h1>
					{featuredBook?.summary && (
						<p style={{ color: "rgba(255,255,255,0.8)", maxWidth: 440, marginBottom: "var(--space-6)" }}>
							{featuredBook.summary}
						</p>
					)}
					<a className="btn-primary" href="/the-novel">
						Get the Novels
					</a>
				</div>
				<div className="hero-signup">
					<p className="hero-signup-label">Join the Insider List</p>
					<form action={subscribeToList}>
						<input
							className="form-input"
							type="email"
							name="email"
							placeholder="Enter your email address"
							required
						/>
						<button type="submit" className="btn-primary" style={{ display: "block", width: "100%", textAlign: "center" }}>
							Submit
						</button>
					</form>
				</div>
			</section>

			<section style={{ padding: "var(--space-16) var(--space-8)" }}>
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-xl)",
						textTransform: "uppercase",
						color: "#fff",
						marginBottom: "var(--space-6)",
					}}
				>
					Meet the Cast
				</h2>
				{featuredCharacters.length > 0 ? (
					<div className="char-grid">
						{featuredCharacters.map((character) => (
							<a key={character.id} href={`/characters/${character.slug}`} className="char-tile">
								<div
									className="char-tile-bg"
									style={{
										background: mediaUrl(character.portraitImageKey)
											? `url(${mediaUrl(character.portraitImageKey)}) center/cover`
											: character.accentColor,
									}}
								/>
								<span className="char-tile-name">{character.name}</span>
							</a>
						))}
					</div>
				) : (
					<p style={{ color: "rgba(255,255,255,0.4)" }}>Characters coming soon.</p>
				)}
				<a
					href="/characters"
					className="char-link"
					style={{ display: "inline-block", marginTop: "var(--space-6)" }}
				>
					See all characters →
				</a>
			</section>
		</div>
	);
}

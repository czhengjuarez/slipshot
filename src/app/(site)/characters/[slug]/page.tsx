import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

// Layout matches the design system's "Character Page" char-card variant:
// content column first (55%) with back-link, name, bio, and a CTA; the
// art panel second (45%). See slipshot-ds:slipshot-design-system.html#character-card.
export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const db = await getDb();
	const [character] = await db.select().from(characters).where(eq(characters.slug, slug));

	if (!character || character.status !== "published") notFound();

	const portraitUrl = mediaUrl(character.portraitImageKey);

	return (
		<div className="char-card" style={{ minHeight: 420 }}>
			<div className="char-card-content" style={{ width: "55%" }}>
				<div className="dot-overlay" />
				<a href="/characters" className="char-back-link">
					&laquo;&laquo; ALL CHARACTERS
				</a>
				{character.quote && <p className="char-quote">&ldquo;{character.quote}&rdquo;</p>}
				<h1
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-lg)",
						textTransform: "uppercase",
						color: character.accentColor,
						marginBottom: "var(--space-3)",
					}}
				>
					{character.name}
				</h1>
				{character.bio && <p className="char-bio">{character.bio}</p>}
				<a className="btn-violet" href="/the-novel" style={{ alignSelf: "flex-start" }}>
					Get the Novels
				</a>
			</div>
			<div
				className="char-card-art"
				style={{
					width: "45%",
					background: portraitUrl ? `url(${portraitUrl}) center/cover` : character.accentColor,
				}}
			>
				<div className="dot-overlay" />
				{!portraitUrl && (
					<span
						style={{
							position: "relative",
							zIndex: 1,
							fontFamily: "var(--font-display)",
							fontSize: 20,
							textTransform: "uppercase",
							color: "rgba(0,0,0,0.25)",
						}}
					>
						{character.name}
					</span>
				)}
			</div>
		</div>
	);
}

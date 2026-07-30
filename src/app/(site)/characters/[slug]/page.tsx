import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const db = await getDb();
	const [character] = await db.select().from(characters).where(eq(characters.slug, slug));

	if (!character || character.status !== "published") notFound();

	const portraitUrl = mediaUrl(character.portraitImageKey);

	return (
		<div style={{ padding: "var(--space-8)" }}>
			<a href="/characters" className="char-back-link">
				← Back to Characters
			</a>

			<div className="char-card" style={{ minHeight: 400 }}>
				<div
					className="char-card-art"
					style={{
						background: portraitUrl ? `url(${portraitUrl}) center/cover` : character.accentColor,
					}}
				>
					{!portraitUrl && character.name.charAt(0)}
					<div className="dot-overlay" />
				</div>
				<div className="char-card-content">
					{character.quote && <p className="char-quote">&ldquo;{character.quote}&rdquo;</p>}
					<h1
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "var(--text-xl)",
							textTransform: "uppercase",
							color: character.accentColor,
							marginBottom: "var(--space-4)",
						}}
					>
						{character.name}
					</h1>
					{character.bio && <p className="char-bio">{character.bio}</p>}
				</div>
			</div>
		</div>
	);
}

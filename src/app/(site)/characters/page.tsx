import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

export default async function CharactersPage() {
	const db = await getDb();
	const rows = await db.select().from(characters).where(eq(characters.status, "published")).orderBy(characters.name);

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
				The Characters
			</h1>

			{rows.length > 0 ? (
				<div className="char-grid">
					{rows.map((character) => (
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
				<p style={{ color: "rgba(255,255,255,0.4)" }}>No characters published yet.</p>
			)}
		</div>
	);
}

import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { characters, characterSections } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

// Layout: full-bleed hero (heroImageKey as a background across the whole
// width, dark gradient overlay, quote/name/CTA on the left), then bio intro
// copy, then any number of admin-managed story sections. Each section picks
// its own layout: full-width (image then copy), or a two-column split with
// the image narrow on either side.
export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const db = await getDb();
	const [character] = await db.select().from(characters).where(eq(characters.slug, slug));

	if (!character || character.status !== "published") notFound();

	const sections = await db
		.select()
		.from(characterSections)
		.where(eq(characterSections.characterId, character.id))
		.orderBy(characterSections.position);

	const heroUrl = mediaUrl(character.heroImageKey ?? character.thumbnailImageKey);

	return (
		<div>
			<div
				style={{
					position: "relative",
					minHeight: 480,
					display: "flex",
					alignItems: "center",
					background: heroUrl
						? `linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%), url(${heroUrl}) top/cover`
						: character.accentColor,
				}}
			>
				<div style={{ padding: "var(--space-8)", maxWidth: 560, position: "relative", zIndex: 1 }}>
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
							marginBottom: "var(--space-4)",
						}}
					>
						{character.name}
					</h1>
					<a className="btn-violet" href="/the-novel" style={{ alignSelf: "flex-start" }}>
						Get the Novels
					</a>
				</div>
			</div>

			{character.bio && (
				<div style={{ background: "var(--color-charcoal)", padding: "var(--space-8)" }}>
					<p
						style={{
							maxWidth: 960,
							margin: "0 auto",
							color: "rgba(255,255,255,0.85)",
							lineHeight: 1.7,
							whiteSpace: "pre-wrap",
						}}
					>
						{character.bio}
					</p>
				</div>
			)}

			{sections.map((section) => (
				<CharacterSection key={section.id} section={section} />
			))}
		</div>
	);
}

function CharacterSection({
	section,
}: {
	section: {
		id: number;
		title: string | null;
		body: string | null;
		imageKey: string | null;
		layout: "full" | "image-left" | "image-right";
	};
}) {
	const imageUrl = mediaUrl(section.imageKey);
	const hasText = Boolean(section.title || section.body);

	const textBlock = hasText && (
		<div>
			{section.title && (
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-xl)",
						color: "#fff",
						marginBottom: "var(--space-4)",
					}}
				>
					{section.title}
				</h2>
			)}
			{section.body && (
				<p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{section.body}</p>
			)}
		</div>
	);

	const imageBlock = imageUrl && (
		// eslint-disable-next-line @next/next/no-img-element
		<img src={imageUrl} alt="" style={{ width: "100%", display: "block", objectFit: "cover" }} />
	);

	if (section.layout === "image-left" || section.layout === "image-right") {
		const imageColumn = (
			<div style={{ width: "35%", flexShrink: 0, background: "var(--color-charcoal)" }}>{imageBlock}</div>
		);
		const textColumn = (
			<div style={{ flex: 1, background: "var(--color-charcoal)", padding: "var(--space-8)" }}>{textBlock}</div>
		);

		return (
			<div style={{ display: "flex" }}>
				{section.layout === "image-left" ? (
					<>
						{imageColumn}
						{textColumn}
					</>
				) : (
					<>
						{textColumn}
						{imageColumn}
					</>
				)}
			</div>
		);
	}

	// "full": image full-width, then copy below (each optional).
	return (
		<div>
			{imageBlock}
			{hasText && (
				<div style={{ background: "var(--color-charcoal)", padding: "var(--space-8)" }}>
					<div style={{ maxWidth: 960, margin: "0 auto" }}>{textBlock}</div>
				</div>
			)}
		</div>
	);
}

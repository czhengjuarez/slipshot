import { mediaUrl } from "@/lib/media";

type Character = {
	id: number;
	slug: string;
	name: string;
	accentColor: string;
	thumbnailImageKey: string | null;
};

// Shows the full character thumbnail (object-fit: contain on the accent
// color) rather than CSS background-cover, which crops portrait
// illustrations — same class of bug as the book cover fix.
export function CharacterTile({ character }: { character: Character }) {
	const thumbnailUrl = mediaUrl(character.thumbnailImageKey);

	return (
		<a href={`/characters/${character.slug}`} className="char-tile" style={{ background: character.accentColor }}>
			{thumbnailUrl && (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={thumbnailUrl}
					alt=""
					className="char-tile-bg"
					style={{ width: "100%", height: "100%", objectFit: "contain" }}
				/>
			)}
			<span className="char-tile-name">{character.name}</span>
		</a>
	);
}

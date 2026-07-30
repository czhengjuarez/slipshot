import { upsertCharacter } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../ImageUploadField";

type Character = {
	id: number;
	slug: string;
	name: string;
	accentColor: string;
	quote: string | null;
	bio: string | null;
	thumbnailImageKey: string | null;
	heroImageKey: string | null;
	status: "draft" | "published";
};

export function CharacterForm({ character }: { character?: Character }) {
	const thumbnailUrl = mediaUrl(character?.thumbnailImageKey);
	const heroUrl = mediaUrl(character?.heroImageKey);

	return (
		<form action={upsertCharacter}>
			{character && <input type="hidden" name="id" value={character.id} />}

			<div className="form-group">
				<label className="form-label" htmlFor="name">
					Name
				</label>
				<input className="form-input" id="name" name="name" defaultValue={character?.name} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="slug">
					Slug (used in the URL, e.g. /characters/cythiria-crenshaw)
				</label>
				<input className="form-input" id="slug" name="slug" defaultValue={character?.slug} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="accentColor">
					Accent color
				</label>
				<input
					type="color"
					id="accentColor"
					name="accentColor"
					defaultValue={character?.accentColor ?? "#7b3de8"}
					style={{ height: 40, width: 80, border: "none", background: "none", cursor: "pointer" }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="quote">
					Quote (short tagline shown in the hero)
				</label>
				<input className="form-input" id="quote" name="quote" defaultValue={character?.quote ?? ""} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="bio">
					Bio (intro copy shown below the hero)
				</label>
				<textarea
					className="form-input"
					id="bio"
					name="bio"
					rows={5}
					defaultValue={character?.bio ?? ""}
					style={{ resize: "vertical" }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="thumbnail">
					Thumbnail image (shown in the character grid)
				</label>
				<ImageUploadField id="thumbnail" name="thumbnail" currentImageUrl={thumbnailUrl} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="hero">
					Hero image (shown in the top section of the character page)
				</label>
				<ImageUploadField id="hero" name="hero" currentImageUrl={heroUrl} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="status">
					Status
				</label>
				<select
					className="form-input"
					id="status"
					name="status"
					defaultValue={character?.status ?? "draft"}
					style={{ width: "auto" }}
				>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
				</select>
			</div>

			<div className="admin-actions" style={{ marginTop: "var(--space-6)" }}>
				<button type="submit" className="btn-primary">
					Save
				</button>
				<a href="/admin/characters" className="btn-ghost">
					Cancel
				</a>
				{character && (
					<a href={`/admin/characters/${character.id}/sections`} className="btn-ghost">
						Manage Story Sections →
					</a>
				)}
			</div>
		</form>
	);
}

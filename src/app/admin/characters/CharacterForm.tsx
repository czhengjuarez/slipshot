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
	portraitImageKey: string | null;
	status: "draft" | "published";
};

export function CharacterForm({ character }: { character?: Character }) {
	const portraitUrl = mediaUrl(character?.portraitImageKey);

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
					Quote
				</label>
				<input className="form-input" id="quote" name="quote" defaultValue={character?.quote ?? ""} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="bio">
					Bio
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
				<label className="form-label" htmlFor="portrait">
					Portrait image
				</label>
				<ImageUploadField id="portrait" name="portrait" currentImageUrl={portraitUrl} />
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
			</div>
		</form>
	);
}

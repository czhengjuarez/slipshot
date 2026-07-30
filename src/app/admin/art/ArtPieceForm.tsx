import { upsertArtPiece } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../ImageUploadField";
import { ART_CATEGORIES } from "@/lib/artCategories";

type ArtPiece = {
	id: number;
	title: string;
	artistCredit: string | null;
	caption: string | null;
	imageKey: string;
	category: string | null;
	visibility: "public" | "exclusive";
};

export function ArtPieceForm({ art }: { art?: ArtPiece }) {
	const imageUrl = mediaUrl(art?.imageKey);

	return (
		<form action={upsertArtPiece}>
			{art && <input type="hidden" name="id" value={art.id} />}

			<div className="form-group">
				<label className="form-label" htmlFor="title">
					Title
				</label>
				<input className="form-input" id="title" name="title" defaultValue={art?.title} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="artistCredit">
					Artist credit
				</label>
				<input
					className="form-input"
					id="artistCredit"
					name="artistCredit"
					defaultValue={art?.artistCredit ?? ""}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="caption">
					Caption (optional, shown after the artist name on hover)
				</label>
				<input className="form-input" id="caption" name="caption" defaultValue={art?.caption ?? ""} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="category">
					Category
				</label>
				<select
					className="form-input"
					id="category"
					name="category"
					defaultValue={art?.category ?? ART_CATEGORIES[0]}
					style={{ width: "auto" }}
				>
					{ART_CATEGORIES.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="visibility">
					Visibility
				</label>
				<select
					className="form-input"
					id="visibility"
					name="visibility"
					defaultValue={art?.visibility ?? "public"}
					style={{ width: "auto" }}
				>
					<option value="public">Public — shown on the /art gallery</option>
					<option value="exclusive">Exclusive — held back (insider content / art book)</option>
				</select>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="image">
					Image {!art && "(required)"}
				</label>
				<ImageUploadField id="image" name="image" currentImageUrl={imageUrl} />
			</div>

			<div className="admin-actions" style={{ marginTop: "var(--space-6)" }}>
				<button type="submit" className="btn-primary">
					Save
				</button>
				<a href="/admin/art" className="btn-ghost">
					Cancel
				</a>
			</div>
		</form>
	);
}

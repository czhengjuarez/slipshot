import { upsertArtPiece } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../ImageUploadField";

type ArtPiece = {
	id: number;
	title: string;
	artistCredit: string | null;
	imageKey: string;
	category: string | null;
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
				<label className="form-label" htmlFor="category">
					Category
				</label>
				<input className="form-input" id="category" name="category" defaultValue={art?.category ?? ""} />
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

import { upsertSection } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../../../ImageUploadField";

type Section = {
	id: number;
	title: string | null;
	body: string | null;
	imageKey: string | null;
	layout: "full" | "image-left" | "image-right";
};

export function SectionForm({ characterId, section }: { characterId: number; section?: Section }) {
	const imageUrl = mediaUrl(section?.imageKey);

	return (
		<form action={upsertSection}>
			{section && <input type="hidden" name="id" value={section.id} />}
			<input type="hidden" name="characterId" value={characterId} />

			<div className="form-group">
				<label className="form-label" htmlFor="title">
					Title
				</label>
				<input className="form-input" id="title" name="title" defaultValue={section?.title ?? ""} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="body">
					Copy
				</label>
				<textarea
					className="form-input"
					id="body"
					name="body"
					rows={8}
					defaultValue={section?.body ?? ""}
					style={{ resize: "vertical" }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="image">
					Image
				</label>
				<ImageUploadField id="image" name="image" currentImageUrl={imageUrl} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="layout">
					Layout
				</label>
				<select
					className="form-input"
					id="layout"
					name="layout"
					defaultValue={section?.layout ?? "full"}
					style={{ width: "auto" }}
				>
					<option value="full">Full width — image, then copy below</option>
					<option value="image-left">Two column — narrow image left, wide copy right</option>
					<option value="image-right">Two column — wide copy left, narrow image right</option>
				</select>
			</div>

			<div className="admin-actions" style={{ marginTop: "var(--space-6)" }}>
				<button type="submit" className="btn-primary">
					Save
				</button>
				<a href={`/admin/characters/${characterId}/sections`} className="btn-ghost">
					Cancel
				</a>
			</div>
		</form>
	);
}

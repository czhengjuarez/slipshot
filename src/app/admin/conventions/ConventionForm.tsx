import { upsertConvention } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../ImageUploadField";

type Convention = {
	id: number;
	name: string;
	description: string | null;
	location: string | null;
	logoImageKey: string | null;
	websiteUrl: string | null;
	startDate: string;
	endDate: string | null;
	status: "draft" | "published";
};

export function ConventionForm({ convention }: { convention?: Convention }) {
	const logoUrl = mediaUrl(convention?.logoImageKey);

	return (
		<form action={upsertConvention}>
			{convention && <input type="hidden" name="id" value={convention.id} />}

			<div className="form-group">
				<label className="form-label" htmlFor="name">
					Name
				</label>
				<input className="form-input" id="name" name="name" defaultValue={convention?.name} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="location">
					Location (venue, city, state)
				</label>
				<input className="form-input" id="location" name="location" defaultValue={convention?.location ?? ""} />
			</div>

			<div style={{ display: "flex", gap: "var(--space-4)" }}>
				<div className="form-group">
					<label className="form-label" htmlFor="startDate">
						Start date
					</label>
					<input
						className="form-input"
						id="startDate"
						name="startDate"
						type="date"
						defaultValue={convention?.startDate ?? ""}
						required
						style={{ width: 200 }}
					/>
				</div>

				<div className="form-group">
					<label className="form-label" htmlFor="endDate">
						End date (optional, for multi-day cons)
					</label>
					<input
						className="form-input"
						id="endDate"
						name="endDate"
						type="date"
						defaultValue={convention?.endDate ?? ""}
						style={{ width: 200 }}
					/>
				</div>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="description">
					Description
				</label>
				<textarea
					className="form-input"
					id="description"
					name="description"
					rows={4}
					defaultValue={convention?.description ?? ""}
					style={{ resize: "vertical" }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="websiteUrl">
					Convention website (name/logo link out to this)
				</label>
				<input
					className="form-input"
					id="websiteUrl"
					name="websiteUrl"
					type="url"
					placeholder="https://..."
					defaultValue={convention?.websiteUrl ?? ""}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="logo">
					Logo
				</label>
				<ImageUploadField id="logo" name="logo" currentImageUrl={logoUrl} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="status">
					Status
				</label>
				<select
					className="form-input"
					id="status"
					name="status"
					defaultValue={convention?.status ?? "draft"}
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
				<a href="/admin/conventions" className="btn-ghost">
					Cancel
				</a>
			</div>
		</form>
	);
}

import { upsertBook } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../ImageUploadField";

type Book = {
	id: number;
	slug: string;
	title: string;
	volumeNumber: number | null;
	coverImageKey: string | null;
	summary: string | null;
	status: "draft" | "published";
	releaseDate: string | null;
};

export function BookForm({ book }: { book?: Book }) {
	const coverUrl = mediaUrl(book?.coverImageKey);

	return (
		<form action={upsertBook}>
			{book && <input type="hidden" name="id" value={book.id} />}

			<div className="form-group">
				<label className="form-label" htmlFor="title">
					Title
				</label>
				<input className="form-input" id="title" name="title" defaultValue={book?.title} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="slug">
					Slug
				</label>
				<input className="form-input" id="slug" name="slug" defaultValue={book?.slug} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="volumeNumber">
					Volume number
				</label>
				<input
					className="form-input"
					id="volumeNumber"
					name="volumeNumber"
					type="number"
					step="0.1"
					defaultValue={book?.volumeNumber ?? ""}
					style={{ width: 120 }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="summary">
					Summary
				</label>
				<textarea
					className="form-input"
					id="summary"
					name="summary"
					rows={5}
					defaultValue={book?.summary ?? ""}
					style={{ resize: "vertical" }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="cover">
					Cover image
				</label>
				<ImageUploadField id="cover" name="cover" currentImageUrl={coverUrl} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="releaseDate">
					Release date
				</label>
				<input
					className="form-input"
					id="releaseDate"
					name="releaseDate"
					type="date"
					defaultValue={book?.releaseDate ?? ""}
					style={{ width: 200 }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="status">
					Status
				</label>
				<select
					className="form-input"
					id="status"
					name="status"
					defaultValue={book?.status ?? "draft"}
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
				<a href="/admin/books" className="btn-ghost">
					Cancel
				</a>
			</div>
		</form>
	);
}

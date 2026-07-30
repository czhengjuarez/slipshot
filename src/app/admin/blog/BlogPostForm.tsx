import { upsertBlogPost } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../ImageUploadField";

type BlogPost = {
	id: number;
	slug: string;
	title: string;
	excerpt: string | null;
	body: string | null;
	coverImageKey: string | null;
	category: string | null;
	status: "draft" | "published";
};

export function BlogPostForm({ post }: { post?: BlogPost }) {
	const coverUrl = mediaUrl(post?.coverImageKey);

	return (
		<form action={upsertBlogPost}>
			{post && <input type="hidden" name="id" value={post.id} />}

			<div className="form-group">
				<label className="form-label" htmlFor="title">
					Title
				</label>
				<input className="form-input" id="title" name="title" defaultValue={post?.title} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="slug">
					Slug
				</label>
				<input className="form-input" id="slug" name="slug" defaultValue={post?.slug} required />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="category">
					Category
				</label>
				<input className="form-input" id="category" name="category" defaultValue={post?.category ?? ""} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="excerpt">
					Excerpt
				</label>
				<textarea
					className="form-input"
					id="excerpt"
					name="excerpt"
					rows={2}
					defaultValue={post?.excerpt ?? ""}
					style={{ resize: "vertical" }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="body">
					Body (Markdown)
				</label>
				<textarea
					className="form-input"
					id="body"
					name="body"
					rows={14}
					defaultValue={post?.body ?? ""}
					style={{ resize: "vertical", fontFamily: "monospace" }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="cover">
					Cover image
				</label>
				<ImageUploadField id="cover" name="cover" currentImageUrl={coverUrl} />
			</div>

			<div className="form-group">
				<label className="form-label" htmlFor="status">
					Status
				</label>
				<select
					className="form-input"
					id="status"
					name="status"
					defaultValue={post?.status ?? "draft"}
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
				<a href="/admin/blog" className="btn-ghost">
					Cancel
				</a>
			</div>
		</form>
	);
}

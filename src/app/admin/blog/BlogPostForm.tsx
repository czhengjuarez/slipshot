import { upsertBlogPost } from "./actions";
import { mediaUrl } from "@/lib/media";
import { ImageUploadField } from "../ImageUploadField";
import { MarkdownEditorField } from "../MarkdownEditorField";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

type BlogPost = {
	id: number;
	slug: string;
	title: string;
	excerpt: string | null;
	body: string | null;
	coverImageKey: string | null;
	category: string | null;
	status: "draft" | "published";
	publishedAt: string | null;
	featured: boolean;
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
				<select
					className="form-input"
					id="category"
					name="category"
					defaultValue={post?.category ?? BLOG_CATEGORIES[0]}
					style={{ width: "auto" }}
				>
					{BLOG_CATEGORIES.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
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
				<label className="form-label">Body</label>
				<MarkdownEditorField name="body" defaultValue={post?.body ?? ""} />
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

			<div className="form-group">
				<label className="form-label" htmlFor="publishedAt">
					Publish date (used for sorting and the displayed date — leave blank to use today when publishing)
				</label>
				<input
					className="form-input"
					id="publishedAt"
					name="publishedAt"
					type="date"
					defaultValue={post?.publishedAt?.slice(0, 10) ?? ""}
					style={{ width: 200 }}
				/>
			</div>

			<div className="form-group">
				<label className="form-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} />
					Featured on The Slip-Log
				</label>
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

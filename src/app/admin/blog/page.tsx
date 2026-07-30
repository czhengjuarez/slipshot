import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { deleteBlogPost } from "./actions";

export default async function BlogListPage() {
	const db = await getDb();
	const rows = await db.select().from(blogPosts).orderBy(blogPosts.title);

	return (
		<div>
			<div className="admin-toolbar">
				<h1 className="admin-page-title" style={{ marginBottom: 0 }}>
					Blog Posts
				</h1>
				<a href="/admin/blog/new" className="btn-primary">
					New Post
				</a>
			</div>

			<table className="admin-table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Slug</th>
						<th>Category</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{rows.map((post) => (
						<tr key={post.id}>
							<td>{post.title}{post.featured && " ★"}</td>
							<td>{post.slug}</td>
							<td>{post.category ?? "—"}</td>
							<td>
								<span className={`admin-status admin-status--${post.status}`}>{post.status}</span>
							</td>
							<td>
								<div className="admin-actions">
									<a href={`/admin/blog/${post.id}/edit`}>Edit</a>
									<form action={deleteBlogPost}>
										<input type="hidden" name="id" value={post.id} />
										<button type="submit" className="btn-ghost" style={{ padding: "4px 12px", fontSize: 11 }}>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					))}
					{rows.length === 0 && (
						<tr>
							<td colSpan={5} style={{ color: "rgba(255,255,255,0.4)" }}>
								No posts yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

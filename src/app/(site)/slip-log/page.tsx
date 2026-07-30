import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

export default async function SlipLogPage() {
	const db = await getDb();
	const rows = await db
		.select()
		.from(blogPosts)
		.where(eq(blogPosts.status, "published"))
		.orderBy(desc(blogPosts.publishedAt));

	const [featured, ...rest] = rows;

	return (
		<div style={{ padding: "var(--space-8)" }}>
			<h1
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-2xl)",
					textTransform: "uppercase",
					color: "#fff",
					marginBottom: "var(--space-6)",
				}}
			>
				The Slip-Log
			</h1>

			{!featured && <p style={{ color: "rgba(255,255,255,0.4)" }}>No posts published yet.</p>}

			{featured && (
				<a href={`/slip-log/${featured.slug}`} className="blog-featured" style={{ marginBottom: "var(--space-6)" }}>
					<div className="blog-featured-bg" />
					<div
						className="blog-featured-img"
						style={
							mediaUrl(featured.coverImageKey)
								? { background: `url(${mediaUrl(featured.coverImageKey)}) center/cover` }
								: undefined
						}
					/>
					<div className="blog-featured-content">
						{featured.category && <span className="type-tag">{featured.category}</span>}
						<h2 className="blog-title-display">{featured.title}</h2>
						{featured.excerpt && <p className="blog-excerpt">{featured.excerpt}</p>}
						{featured.publishedAt && <p className="blog-date">{featured.publishedAt.slice(0, 10)}</p>}
					</div>
				</a>
			)}

			{rest.length > 0 && (
				<div className="blog-grid">
					{rest.map((post) => (
						<a key={post.id} href={`/slip-log/${post.slug}`} className="blog-card">
							<div
								className="blog-card-img"
								style={
									mediaUrl(post.coverImageKey)
										? { background: `url(${mediaUrl(post.coverImageKey)}) center/cover` }
										: undefined
								}
							/>
							<div className="blog-card-body">
								{post.category && <span className="type-tag">{post.category}</span>}
								<h3 style={{ color: "#fff", fontSize: "var(--text-base)", margin: "8px 0" }}>{post.title}</h3>
								{post.publishedAt && (
									<p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{post.publishedAt.slice(0, 10)}</p>
								)}
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	);
}

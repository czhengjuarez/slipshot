import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const db = await getDb();
	const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));

	if (!post || post.status !== "published") notFound();

	const coverUrl = mediaUrl(post.coverImageKey);

	return (
		<article style={{ padding: "var(--space-8)", maxWidth: 720, margin: "0 auto" }}>
			<a href="/slip-log" className="char-back-link">
				← Back to The Slip-Log
			</a>

			{post.category && <span className="type-tag">{post.category}</span>}
			<h1
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-2xl)",
					color: "#fff",
					margin: "var(--space-4) 0",
				}}
			>
				{post.title}
			</h1>
			{post.publishedAt && (
				<p className="blog-date" style={{ marginBottom: "var(--space-6)" }}>
					{post.publishedAt.slice(0, 10)}
				</p>
			)}

			{coverUrl && (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={coverUrl}
					alt=""
					style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", marginBottom: "var(--space-6)" }}
				/>
			)}

			{/* Body is stored as plain markdown text; rendered as-is with preserved
			    line breaks for now. Swap in a markdown renderer if/when post bodies
			    need real formatting (headings, links, etc). */}
			<div style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{post.body}</div>
		</article>
	);
}

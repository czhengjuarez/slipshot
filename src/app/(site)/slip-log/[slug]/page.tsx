import { desc, eq, ne, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { mediaUrl } from "@/lib/media";

const markdownComponents = {
	h1: (props: React.ComponentProps<"h1">) => (
		<h2
			style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", color: "#fff", margin: "1.5em 0 0.5em" }}
			{...props}
		/>
	),
	h2: (props: React.ComponentProps<"h2">) => (
		<h2
			style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "#fff", margin: "1.5em 0 0.5em" }}
			{...props}
		/>
	),
	h3: (props: React.ComponentProps<"h3">) => (
		<h3 style={{ fontSize: "var(--text-md)", color: "#fff", margin: "1.25em 0 0.5em" }} {...props} />
	),
	p: (props: React.ComponentProps<"p">) => (
		<p style={{ margin: "0 0 1em", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }} {...props} />
	),
	a: (props: React.ComponentProps<"a">) => (
		<a style={{ color: "var(--color-yellow)", textUnderlineOffset: 2 }} {...props} />
	),
	strong: (props: React.ComponentProps<"strong">) => <strong style={{ color: "#fff" }} {...props} />,
	ul: (props: React.ComponentProps<"ul">) => (
		<ul style={{ margin: "0 0 1em", paddingLeft: "1.5em", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }} {...props} />
	),
	ol: (props: React.ComponentProps<"ol">) => (
		<ol style={{ margin: "0 0 1em", paddingLeft: "1.5em", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }} {...props} />
	),
	blockquote: (props: React.ComponentProps<"blockquote">) => (
		<blockquote
			style={{
				margin: "0 0 1em",
				paddingLeft: "1em",
				borderLeft: "2px solid var(--color-violet)",
				color: "rgba(255,255,255,0.6)",
			}}
			{...props}
		/>
	),
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const db = await getDb();
	const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));

	if (!post || post.status !== "published") notFound();

	const morePosts = await db
		.select()
		.from(blogPosts)
		.where(and(eq(blogPosts.status, "published"), ne(blogPosts.id, post.id)))
		.orderBy(desc(blogPosts.publishedAt))
		.limit(3);

	const coverUrl = mediaUrl(post.coverImageKey);

	return (
		<div>
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

				{post.body && (
					<div className="markdown-body">
						<ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
					</div>
				)}
			</article>

			{morePosts.length > 0 && (
				<div style={{ background: "var(--color-charcoal)", padding: "var(--space-8)" }}>
					<div style={{ maxWidth: 960, margin: "0 auto" }}>
						<h2
							style={{
								fontFamily: "var(--font-display)",
								fontSize: "var(--text-lg)",
								textTransform: "uppercase",
								color: "#fff",
								marginBottom: "var(--space-6)",
							}}
						>
							More from the Slip-Log
						</h2>
						<div className="blog-grid">
							{morePosts.map((p) => (
								<a key={p.id} href={`/slip-log/${p.slug}`} className="blog-card">
									<div
										className="blog-card-img"
										style={
											mediaUrl(p.coverImageKey)
												? { background: `url(${mediaUrl(p.coverImageKey)}) center/cover` }
												: undefined
										}
									/>
									<div className="blog-card-body">
										{p.category && <span className="type-tag">{p.category}</span>}
										<h3 className="blog-title-display" style={{ fontSize: 18 }}>
											{p.title}
										</h3>
										{p.publishedAt && <span className="blog-date">{p.publishedAt.slice(0, 10)}</span>}
									</div>
								</a>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

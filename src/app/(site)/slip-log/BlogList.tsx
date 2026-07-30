"use client";

import { useState } from "react";
import { mediaUrl } from "@/lib/media";

type Post = {
	id: number;
	slug: string;
	title: string;
	excerpt: string | null;
	category: string | null;
	coverImageKey: string | null;
	publishedAt: string | null;
	featured: boolean;
};

export function BlogList({ posts, categories }: { posts: Post[]; categories: string[] }) {
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const filtered = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts;
	// Prefer the editor's explicit pick; fall back to the newest post (list is
	// already ordered by publishedAt desc) if nothing is marked featured.
	const featuredIndex = filtered.findIndex((p) => p.featured);
	const featured = featuredIndex === -1 ? filtered[0] : filtered[featuredIndex];
	const rest = filtered.filter((p) => p.id !== featured?.id);

	return (
		<div>
			<div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
				<FilterPill label="All" active={activeCategory === null} onClick={() => setActiveCategory(null)} />
				{categories.map((category) => (
					<FilterPill
						key={category}
						label={category}
						active={activeCategory === category}
						onClick={() => setActiveCategory(category)}
					/>
				))}
			</div>

			{!featured && <p style={{ color: "rgba(255,255,255,0.4)" }}>Nothing in this category yet.</p>}

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
								<h3 className="blog-title-display" style={{ fontSize: 18 }}>
									{post.title}
								</h3>
								{post.excerpt && (
									<p className="blog-excerpt" style={{ fontSize: 12 }}>
										{post.excerpt}
									</p>
								)}
								{post.publishedAt && <span className="blog-date">{post.publishedAt.slice(0, 10)}</span>}
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	);
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={active ? "badge badge-violet" : "badge badge-dark"}
			style={{ cursor: "pointer", border: "none" }}
		>
			{label}
		</button>
	);
}

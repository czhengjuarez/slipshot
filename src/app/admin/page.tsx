import { getDb } from "@/db";
import { books, characters, blogPosts, artPieces } from "@/db/schema";

export default async function AdminDashboard() {
	const db = await getDb();
	const [bookRows, characterRows, blogRows, artRows] = await Promise.all([
		db.select().from(books),
		db.select().from(characters),
		db.select().from(blogPosts),
		db.select().from(artPieces),
	]);

	const cards = [
		{ label: "Books", count: bookRows.length, href: "/admin/books" },
		{ label: "Characters", count: characterRows.length, href: "/admin/characters" },
		{ label: "Blog Posts", count: blogRows.length, href: "/admin/blog" },
		{ label: "Art Pieces", count: artRows.length, href: "/admin/art" },
	];

	return (
		<div>
			<h1 className="admin-page-title">Dashboard</h1>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
				{cards.map((card) => (
					<a key={card.label} href={card.href} className="admin-card">
						<span className="admin-card-count">{card.count}</span>
						<div className="admin-card-label">{card.label}</div>
					</a>
				))}
			</div>
		</div>
	);
}

import Image from "next/image";
import { getDb } from "@/db";
import { books } from "@/db/schema";

// Placeholder home page — proves the Slipshot design system (tokens,
// components.css, self-hosted fonts, logo) is wired up correctly.
// Real page content comes in a later pass.
export default async function Home() {
	const db = await getDb();
	const bookCount = (await db.select().from(books)).length;

	return (
		<div>
			<nav className="nav-preview">
				<a href="/" className="nav-logo" style={{ display: "flex", alignItems: "center" }}>
					<Image src="/logo/logo-white.svg" alt="Slipshot" width={86} height={36} priority />
				</a>
				<ul className="nav-links">
					<li>
						<a href="/characters">Characters</a>
					</li>
					<li>
						<a href="/the-novel">Novels</a>
					</li>
					<li>
						<a href="/art">Art</a>
					</li>
					<li>
						<a href="/slip-log">Blog</a>
					</li>
				</ul>
				<a href="#" className="nav-cart">
					Cart (0)
				</a>
			</nav>

			<main style={{ padding: 40 }}>
				<p style={{ maxWidth: 480, marginBottom: "var(--space-8)", color: "rgba(255,255,255,0.7)" }}>
					Tokens, components.css, self-hosted Postnobills, and the logo mark are loading from the Slipshot
					design system. Real page content replaces this next. (D1 connected — {bookCount} book
					{bookCount === 1 ? "" : "s"} in the database.)
				</p>
				<a className="btn-primary" href="#">
					Primary Button
				</a>
			</main>
		</div>
	);
}

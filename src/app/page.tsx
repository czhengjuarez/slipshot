import Image from "next/image";

// Placeholder home page — proves the Slipshot design system (tokens,
// components.css, self-hosted fonts, logo) is wired up correctly.
// Real page content comes in a later pass.
export default function Home() {
	return (
		<div>
			<nav className="nav-preview">
				<a href="/" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Image src="/logo/logo-white.svg" alt="Slipshot" width={28} height={12} priority />
					Slipshot
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
				<h1
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-3xl)",
						lineHeight: "var(--lh-display)",
						textTransform: "uppercase",
						marginBottom: "var(--space-6)",
					}}
				>
					Design system wired up
				</h1>
				<p style={{ maxWidth: 480, marginBottom: "var(--space-8)", color: "rgba(255,255,255,0.7)" }}>
					Tokens, components.css, self-hosted Postnobills, and the logo mark are loading from the Slipshot
					design system. Real page content replaces this next.
				</p>
				<a className="btn-primary" href="#">
					Primary Button
				</a>
			</main>
		</div>
	);
}

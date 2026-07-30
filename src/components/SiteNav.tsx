import Image from "next/image";

export function SiteNav() {
	return (
		<nav className="nav-preview">
			<a href="/" className="nav-logo" style={{ display: "flex", alignItems: "center" }}>
				<Image src="/logo/logo-white.svg" alt="Slipshot" width={86} height={36} priority />
			</a>
			<ul className="nav-links">
				<li>
					<a href="/characters">Characters</a>
				</li>
				<li>
					<a href="/the-novel">Get the Novels</a>
				</li>
				<li>
					<a href="/art">Art</a>
				</li>
				<li>
					<a href="/conventions">Conventions</a>
				</li>
				<li>
					<a href="/slip-log">The Slip-Log</a>
				</li>
			</ul>
			<a href="/join-the-list" className="nav-cart">
				Join the List
			</a>
		</nav>
	);
}

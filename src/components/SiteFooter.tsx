import { subscribeToList } from "@/app/(site)/join-the-list/actions";

export function SiteFooter() {
	return (
		<footer className="footer-preview">
			<div>
				<div className="footer-logo" style={{ marginBottom: "var(--space-4)" }}>
					Slipshot
				</div>
				<p className="hero-signup-label">Join the Insider List</p>
				<form action={subscribeToList}>
					<input
						className="form-input"
						type="email"
						name="email"
						placeholder="Enter your email address"
						required
					/>
					<button
						type="submit"
						className="btn-ghost"
						style={{ display: "block", width: "100%", textAlign: "center", marginTop: "var(--space-3)" }}
					>
						Submit
					</button>
				</form>
			</div>
			<div className="footer-nav-col">
				<a className="footer-link" href="/characters">
					Meet the Characters
				</a>
				<a className="footer-link" href="/join-the-list">
					Join the Insider List
				</a>
				<a className="footer-link" href="/the-novel">
					Get the Novels
				</a>
				<a className="footer-link" href="/art">
					Slipshot Art
				</a>
				<a className="footer-link" href="/conventions">
					Conventions
				</a>
				<a className="footer-link" href="/slip-log">
					The Blog
				</a>
			</div>
			<div className="footer-nav-col">
				<a className="footer-link" href="/contact-us">
					Contact Us
				</a>
				<a className="footer-link" href="https://www.tiktok.com/@slip.shot" target="_blank" rel="noopener noreferrer">
					TikTok
				</a>
				<a className="footer-link" href="https://www.instagram.com/slip.shot/" target="_blank" rel="noopener noreferrer">
					Instagram
				</a>
			</div>
		</footer>
	);
}

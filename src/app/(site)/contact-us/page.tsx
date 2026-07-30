// Static page. A working contact form needs an email-sending decision
// (Cloudflare Email Routing vs a third-party sender) that's explicitly a
// follow-up per the migration plan — a mailto link for now beats a form
// that silently goes nowhere.
export default function ContactUsPage() {
	return (
		<div style={{ padding: "var(--space-8)", maxWidth: 720 }}>
			<h1
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-2xl)",
					textTransform: "uppercase",
					color: "#fff",
					marginBottom: "var(--space-6)",
				}}
			>
				Contact Us
			</h1>
			<p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "var(--space-6)" }}>
				Questions about the books, art, or conventions? Reach out any time.
			</p>
			<a className="btn-primary" href="mailto:hello@slipshot.io">
				Email hello@slipshot.io
			</a>
		</div>
	);
}

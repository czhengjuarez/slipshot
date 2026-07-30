// Static page — no DB table for conventions per the migration plan.
// Placeholder copy until real convention schedule/content is migrated.
export default function ConventionsPage() {
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
				Conventions
			</h1>
			<p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
				Find Slipshot at an upcoming convention — appearance schedule and details coming soon.
			</p>
		</div>
	);
}

import { mediaUrl } from "@/lib/media";

const HERO_KEY = "vibe/f65b2535-e2d0-4435-b3d6-70f55a493c3a.png";
const LINEUP_1_KEY = "vibe/6a425556-d429-44a4-9321-a96ea6f4ce96.png";
const LINEUP_2_KEY = "vibe/51578e13-b756-4a41-b1aa-f80c235224de.png";
const ACTION_KEY = "vibe/edaf1940-386d-45ef-b523-b9e6fae5302c.png";
const CONFRONTATION_KEY = "vibe/e9d83f66-999c-4b58-bf4b-d7f3111405dc.png";

const FACTIONS = [
	{
		name: "The Council",
		color: "#E8C840",
		text: "Engineer Class Citizens who built Griddish's technocracy and everything it stands on. They call it order. Everyone underneath calls it a leash.",
	},
	{
		name: "The Nodes",
		color: "#4AC9B0",
		text: "Mechanics, Admins, Psyches — every Slave wired into the Tenddrome, keeping the Silos running and the Vars alive. They weren't built to ask questions. They're asking anyway.",
	},
	{
		name: "The Bestiars",
		color: "#6040C0",
		text: "The Mechanics who stopped waiting for permission. Armed, furious, and done maintaining a system they no longer believe in. Peace was never the plan.",
	},
	{
		name: "The Insurgents",
		color: "#E05030",
		text: "Engineers who turned on their own Council and ran for the Vars. Exiled, outgunned, and still convinced they can save something worth saving.",
	},
	{
		name: "The Varlings",
		color: "#58C820",
		text: "The people of Farth and Earth — never told any of this was happening, never given a vote, now standing directly in the blast radius.",
	},
];

const ARC = [
	{ label: "The Reunion", text: "Old wounds resurface the moment a stranger walks back into the picture." },
	{ label: "The Awakening", text: "Something in a Varling wakes up that was never supposed to exist on Earth." },
	{ label: "The Infiltration", text: "Loyalties get tested from the inside, and nobody's hands stay clean." },
	{ label: "The Uprising", text: "The Bestiars stop asking the Council to listen and start making them." },
	{ label: "The Great Re-Frag", text: "The cost of all of it comes due, all at once, for everyone." },
];

export default function TheVibePage() {
	const heroUrl = mediaUrl(HERO_KEY);
	const lineup1Url = mediaUrl(LINEUP_1_KEY);
	const lineup2Url = mediaUrl(LINEUP_2_KEY);
	const actionUrl = mediaUrl(ACTION_KEY);
	const confrontationUrl = mediaUrl(CONFRONTATION_KEY);

	return (
		<div>
			<section className="vibe-hero" style={heroUrl ? { backgroundImage: `url(${heroUrl})` } : undefined}>
				<div className="vibe-hero-content">
					<span className="badge badge-red" style={{ marginBottom: "var(--space-4)", display: "inline-block" }}>
						No Neutral Ground
					</span>
					<h1
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "var(--text-2xl)",
							textTransform: "uppercase",
							color: "#fff",
							lineHeight: 1.1,
							marginBottom: "var(--space-4)",
						}}
					>
						The Vibe
					</h1>
					<p style={{ color: "rgba(255,255,255,0.85)", fontSize: "var(--text-md)", lineHeight: 1.6 }}>
						Slipshot doesn&rsquo;t do quiet. Every world, every class, every character in this universe is
						pulling in a different direction — and the seams are already tearing.
					</p>
				</div>
			</section>

			<section style={{ padding: "var(--space-16) var(--space-8)" }}>
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-xl)",
						textTransform: "uppercase",
						color: "#fff",
						marginBottom: "var(--space-3)",
					}}
				>
					Lines Are Drawn
				</h2>
				<p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 640, marginBottom: "var(--space-8)", lineHeight: 1.7 }}>
					Five sides, one collapsing system. Nobody in Griddish or the Vars gets to sit this one out.
				</p>
				<div className="vibe-faction-grid">
					{FACTIONS.map((faction) => (
						<div key={faction.name} className="vibe-faction-card" style={{ background: faction.color }}>
							<div className="vibe-faction-name">{faction.name}</div>
							<div className="vibe-faction-text">{faction.text}</div>
						</div>
					))}
				</div>
			</section>

			{(lineup1Url || lineup2Url) && (
				<section style={{ background: "var(--color-charcoal)", padding: "var(--space-8) 0" }}>
					<div className="vibe-lineup-strip">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						{lineup1Url && <img src={lineup1Url} alt="Slipshot cast lineup" />}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						{lineup2Url && <img src={lineup2Url} alt="Slipshot cast lineup" />}
					</div>
				</section>
			)}

			<section style={{ padding: "var(--space-16) var(--space-8)" }}>
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-xl)",
						textTransform: "uppercase",
						color: "#fff",
						marginBottom: "var(--space-3)",
					}}
				>
					How It Escalates
				</h2>
				<p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 640, marginBottom: "var(--space-8)", lineHeight: 1.7 }}>
					No spoilers — just the shape of the fall.
				</p>
				<div className="vibe-arc-strip">
					{ARC.map((step) => (
						<div key={step.label} className="vibe-arc-step">
							<div className="vibe-arc-step-label">{step.label}</div>
							<div className="vibe-arc-step-text">{step.text}</div>
						</div>
					))}
				</div>
			</section>

			<section
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 4,
					padding: "0 0 var(--space-16)",
				}}
			>
				{confrontationUrl && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={confrontationUrl}
						alt="Slipshot art book spread"
						style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top" }}
					/>
				)}
				{actionUrl && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={actionUrl}
						alt="Slipshot art book spread"
						style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top" }}
					/>
				)}
			</section>

			<section style={{ padding: "0 var(--space-8) var(--space-16)", display: "flex", gap: "var(--space-4)" }}>
				<a className="btn-primary" href="/characters">
					Meet the Cast
				</a>
				<a className="btn-ghost" href="/the-novel">
					Get the Novels
				</a>
			</section>
		</div>
	);
}

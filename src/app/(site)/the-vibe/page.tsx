import { mediaUrl } from "@/lib/media";

const HERO_KEY = "vibe/1c1a5460-a021-4739-838e-a4dcfc4cacef.png";
const CONFRONTATION_KEY = "vibe/eef9b6aa-cfe5-4b2a-af2f-6c4d72b19267.png";
const MATERE_KEY = "vibe/c385cd70-809d-411f-a37f-a172c4b2de54.png";
const SPINE_COVERS_KEY = "vibe/876331e6-b493-43bd-80f2-996e8b91207d.png";
const FULL_COVERS_KEY = "vibe/bce11aae-97af-4ef0-b114-bcb2699c6102.png";

const CLASSIFICATIONS = [
	{
		name: "Violence",
		color: "#CC2020",
		text: "What the Mechanics are ordered to do to the Vars, and what happens when one of them stops taking orders. This is the classification where the Bestiars are born.",
		quote: "I never wanted it to be this way. I never wanted to bring the power of the Vérkatrae down on the Vars and the Varlings. But what choice did I have? This was my job. I knew nothing else.",
		attribution: "Opal Fremmitty",
	},
	{
		name: "Peace",
		color: "#58C820",
		text: "The quiet before it all breaks — a found family assembling itself on Earth without knowing what any of them really are yet, or what's coming for them.",
		quote: "I never saw those machines, the Vérkatrae, as they were called. But Fredrick saw them. I didn't understand how, or why, or what their purpose was. It was my goal to find out, to understand Opal, and to save our world.",
		attribution: "Jillian Crenshaw",
	},
	{
		name: "Manipulation",
		color: "#B516FF",
		text: "Every character playing an angle — Engineers scheming against their own Council, Slaves working the system that owns them, nobody saying what they actually want out loud.",
		quote: "I was not going to let Griddish have its way with the Vars. In terms of my past, that cannot define who I am. I will no longer accept the decisions of the Council of Engineer Class Citizens.",
		attribution: "Matere Songgaard",
	},
	{
		name: "Pathos",
		color: "#4AC9B0",
		text: "The cost nobody sends an invoice for — the people left behind, the ones who never fit anywhere, the grief that outlasts the fight that caused it.",
		quote: "Cythiria loved me. Yet, was I able to return that love? When she disappeared one day, I swore I would find her at any cost.",
		attribution: "Chelss Brimwater",
	},
];

export default function TheVibePage() {
	const heroUrl = mediaUrl(HERO_KEY);
	const confrontationUrl = mediaUrl(CONFRONTATION_KEY);
	const matereUrl = mediaUrl(MATERE_KEY);
	const spineCoversUrl = mediaUrl(SPINE_COVERS_KEY);
	const fullCoversUrl = mediaUrl(FULL_COVERS_KEY);

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
						Slipshot doesn&rsquo;t do quiet. Every character in this universe is running on the same four
						currents — violence, peace, manipulation, pathos — and none of them run in a straight line.
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
					Four Classifications
				</h2>
				<p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 640, marginBottom: "var(--space-8)", lineHeight: 1.7 }}>
					Every storyline in Slipshot gets sorted into one of these. Most characters live in more than one.
				</p>
				<div className="vibe-faction-grid">
					{CLASSIFICATIONS.map((c) => (
						<div key={c.name} className="vibe-faction-card" style={{ background: c.color }}>
							<div className="vibe-faction-name">{c.name}</div>
							<div className="vibe-faction-text">{c.text}</div>
						</div>
					))}
				</div>
			</section>

			<section style={{ background: "var(--color-charcoal)", padding: "var(--space-16) var(--space-8)" }}>
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-xl)",
						textTransform: "uppercase",
						color: "#fff",
						marginBottom: "var(--space-8)",
					}}
				>
					In Their Own Words
				</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
						gap: "var(--space-6)",
					}}
				>
					{CLASSIFICATIONS.map((c) => (
						<div key={c.name} style={{ borderLeft: `3px solid ${c.color}`, paddingLeft: "var(--space-4)" }}>
							<p
								style={{
									color: "rgba(255,255,255,0.85)",
									fontStyle: "italic",
									lineHeight: 1.6,
									marginBottom: "var(--space-2)",
								}}
							>
								&ldquo;{c.quote}&rdquo;
							</p>
							<p
								style={{
									fontFamily: "var(--font-display)",
									fontSize: "var(--text-sm)",
									textTransform: "uppercase",
									color: c.color,
								}}
							>
								{c.attribution}
							</p>
						</div>
					))}
				</div>
			</section>

			<section
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 4,
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
				{matereUrl && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={matereUrl}
						alt="Slipshot art book spread"
						style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top" }}
					/>
				)}
			</section>

			<section style={{ padding: "var(--space-16) var(--space-8)", textAlign: "center" }}>
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-xl)",
						textTransform: "uppercase",
						color: "#fff",
						marginBottom: "var(--space-8)",
					}}
				>
					Explore the Series
				</h2>
				{(spineCoversUrl || fullCoversUrl) && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={fullCoversUrl ?? spineCoversUrl ?? undefined}
						alt="Slipshot Vol 1.0, 2.0, and 3.0 covers"
						style={{ maxWidth: 640, width: "100%", margin: "0 auto var(--space-8)", display: "block" }}
					/>
				)}
				<div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center" }}>
					<a className="btn-primary" href="/characters">
						Meet the Cast
					</a>
					<a className="btn-ghost" href="/the-novel">
						Get the Novels
					</a>
				</div>
			</section>
		</div>
	);
}

import { desc, eq, ne, and } from "drizzle-orm";
import { getDb } from "@/db";
import { books, characters, blogPosts } from "@/db/schema";
import { mediaUrl } from "@/lib/media";
import { subscribeToList } from "./join-the-list/actions";
import { CharacterTile } from "@/components/CharacterTile";

export default async function Home() {
	const db = await getDb();

	const [featuredBook] = await db
		.select()
		.from(books)
		.where(eq(books.status, "published"))
		.orderBy(desc(books.volumeNumber))
		.limit(1);

	const [featuredCharacter] = await db
		.select()
		.from(characters)
		.where(eq(characters.status, "published"))
		.limit(1);

	const otherCharacters = featuredCharacter
		? await db
				.select()
				.from(characters)
				.where(and(eq(characters.status, "published"), ne(characters.id, featuredCharacter.id)))
				.limit(6)
		: [];

	const allBooks = await db.select().from(books).where(eq(books.status, "published")).orderBy(books.volumeNumber);

	const latestPosts = await db
		.select()
		.from(blogPosts)
		.where(eq(blogPosts.status, "published"))
		.orderBy(desc(blogPosts.publishedAt))
		.limit(3);

	const [griddishAccent] = await db
		.select()
		.from(characters)
		.where(eq(characters.slug, "matere-songgaard"))
		.limit(1);
	const [varsAccent] = await db
		.select()
		.from(characters)
		.where(eq(characters.slug, "fredrick-munchen"))
		.limit(1);

	return (
		<div>
			<section className="hero-preview">
				<video
					className="hero-video"
					autoPlay
					loop
					muted
					playsInline
					poster={mediaUrl("hero/649415d5-0405-49a5-86bd-0099c4560391.jpg") ?? undefined}
				>
					{mediaUrl("hero/4e4d9923-2358-4a5c-9e35-77be7aad89d1.mp4") && (
						<source src={mediaUrl("hero/4e4d9923-2358-4a5c-9e35-77be7aad89d1.mp4")!} type="video/mp4" />
					)}
					{mediaUrl("hero/f7f6934a-58f3-4309-9a60-6a3a746e1cbe.webm") && (
						<source src={mediaUrl("hero/f7f6934a-58f3-4309-9a60-6a3a746e1cbe.webm")!} type="video/webm" />
					)}
				</video>
				<div className="hero-video-scrim" />
				<div className="hero-dot-overlay" />
				<div className="hero-content">
					<h1
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "var(--text-3xl)",
							textTransform: "uppercase",
							color: "#fff",
							lineHeight: 1.05,
						}}
					>
						Codex Is Here
					</h1>
				</div>
				<div className="hero-signup">
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
							className="btn-primary"
							style={{ display: "block", width: "100%", textAlign: "center" }}
						>
							Submit
						</button>
					</form>
				</div>
			</section>

			<section className="story-banner">
				<div
					className="story-banner-left story-banner-half"
					style={
						mediaUrl(griddishAccent?.heroImageKey)
							? ({ ["--bg-url" as string]: `url(${mediaUrl(griddishAccent?.heroImageKey)})` } as React.CSSProperties)
							: undefined
					}
				>
					<style>{`.story-banner-left::before { background-image: var(--bg-url); }`}</style>
					<div className="story-banner-content">
						<h2 className="story-banner-title">Griddish</h2>
						<p className="story-banner-text">
							A disk-shaped world outside of ordinary space, home to the Engineer Class Citizens and the Slaves
							bound to the Tenddrome. Every Slipshot Silo on its surface anchors a universe of its own.
						</p>
						<a className="btn-ghost" href="/characters">
							Meet Them Here &gt;&gt;
						</a>
					</div>
				</div>
				<div
					className="story-banner-right story-banner-half"
					style={
						mediaUrl("home/16eec919-025c-4fcb-903f-768315431f04.png")
							? ({
									["--bg-url" as string]: `url(${mediaUrl("home/16eec919-025c-4fcb-903f-768315431f04.png")})`,
								} as React.CSSProperties)
							: undefined
					}
				>
					<style>{`.story-banner-right::before { background-image: var(--bg-url); background-position: top left; }`}</style>
					<div className="story-banner-content" style={{ marginLeft: "auto", textAlign: "right" }}>
						<h2 className="story-banner-title">The Vars</h2>
						<p className="story-banner-text">
							Farth and Earth — twin experiments born from the same Slipshot technology, each shaped by
							Griddish's design and left to find its own way. Neither Var was ever meant to know the truth.
						</p>
						<a className="btn-ghost" href="/the-novel">
							Start the Series &gt;&gt;
						</a>
					</div>
				</div>
			</section>

			<section>
				{[
					{
						slug: "cythiria-crenshaw",
						name: "Cythiria Crenshaw",
						heading: "I never asked to be here...",
						body: "Every day on Farth is more difficult. I can't seem to rid myself of the grinding sounds in my own head. If it weren't for Rive Amber, I'm not sure what I would do. My childhood memories are shattered. But Rive told me she would help me to regain what I've lost. But what have I lost?",
						imageKey: "home/57abe158-be4c-46a8-b937-ceac6ffc668f.jpg",
					},
					{
						slug: "fredrick-munchen",
						name: "Fredrick Munchen",
						heading: "It was those machines...",
						body: "The ones lurking in the shadows who started it all. It was when I first saw them that I knew something was desperately wrong. And also, Opal. She never was able to elucidate the truth about those machines. Only that, life was too short to worry about such things.",
						imageKey: "home/b37790db-d4a1-43bf-8376-58758c8d4016.jpg",
					},
					{
						slug: "blinky",
						name: "Blinky",
						heading: "The lights had meaning...",
						body: "It meant, there was something about Cythiria, something that united her with the Vérkatrae and Griddish and all the Slaves. It was only a matter of time until she came to realize that.",
						imageKey: "home/e2a33b27-5a49-4132-94d7-01d9b0d642b6.jpg",
					},
					{
						slug: "matere-songgaard",
						name: "Matere Songgaard",
						heading: "I couldn't let it happen...",
						body: "I was not about to let the Engineers get away with their plans. Even though I was one of them, I decided to spend my life thwarting their corrupt and lazy interests. I would not let them have their way, not with the Vars or the Varlings.",
						imageKey: "home/53a4dca9-2df7-41eb-98ec-2c7278e86c62.jpg",
					},
					{
						slug: "opal-fremmitty",
						name: "Opal Fremmitty",
						heading: "It was too much to ask...",
						body: "I was tired, worn down by my work as a Mechanic Class Slave, stationed on the Vars until the final deed was done. At some point, it was just too much. I could no longer stomach the decisions of the Engineers and their Commission. Something had to change.",
						imageKey: "home/de7694b2-30da-48fa-9e13-4f32b6cab4ee.jpg",
					},
				].map((story, i) => {
					const imgUrl = mediaUrl(story.imageKey);
					return (
						<div
							key={story.slug}
							className={`char-story-row${i % 2 === 1 ? " reverse" : ""}`}
							style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}
						>
							<div className="char-story-text">
								<h2 className="char-story-heading">{story.heading}</h2>
								<p className="char-story-body">{story.body}</p>
								<a className="char-link" href={`/characters/${story.slug}`}>
									{story.name} &gt;&gt;
								</a>
							</div>
						</div>
					);
				})}
			</section>

			{allBooks.length > 0 && (
				<section style={{ padding: "var(--space-16) var(--space-8)", background: "var(--color-charcoal)" }}>
					<h2
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "var(--text-xl)",
							textTransform: "uppercase",
							color: "#fff",
							marginBottom: "var(--space-6)",
						}}
					>
						Get the Novels
					</h2>
					<p
						style={{
							color: "rgba(255,255,255,0.75)",
							lineHeight: 1.7,
							maxWidth: 900,
							marginBottom: "var(--space-10)",
						}}
					>
						Welcome to a world where ancient secrets hold the key to Earth&rsquo;s future. The Slipshot Series
						delivers thrills, unforgettable characters, and a mystery that deepens with every page.
					</p>
					<div className="novel-columns">
						{[
							{
								text: "In Vol. 1.0, follow Frederick and Opal as they unravel the hidden ties between our world and the otherworldly Griddish Realm, facing strange machines, sudden black holes, and unexpected battles.",
							},
							{
								text: "In Vol. 2.0, step into the life of Cythiria—an angsty yet determined teenager—who must piece together her fractured past while facing a destiny that could change everything.",
							},
							{
								text: "In Vol 3.0, a new rival has entered the scene—Mora Thrembroke, fierce, relentless, and burning with a grudge. As Cythiria reels from Blinky's cryptic warning, Mora begins her pursuit—and she won't stop until the past is rewritten in blood.",
							},
						].map((vol, i) => {
							const book = allBooks[i];
							if (!book) return null;
							const coverUrl = mediaUrl(book.coverImageKey);
							return (
								<a key={book.id} href="/the-novel" style={{ display: "block" }}>
									{coverUrl && (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={coverUrl} alt={book.title} className="novel-column-cover" />
									)}
									<div className="novel-column-title">{book.title}</div>
									<p className="novel-column-text">{vol.text}</p>
								</a>
							);
						})}

						<a href="/the-vibe" style={{ display: "block" }}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={mediaUrl("vibe/c8add3b8-17e1-4d49-b2cb-23431fc9c482.jpg") ?? undefined}
								alt="The Codex"
								className="novel-column-cover"
							/>
							<div className="novel-column-title">The Codex</div>
							<p className="novel-column-text">
								All the art, none of the spoilers — a fast tour through Violence, Peace, Manipulation, and
								Pathos, the four classifications that hold the whole series together.
							</p>
						</a>
					</div>

					<a
						href="/the-novel"
						className="char-link"
						style={{ display: "inline-block", marginTop: "var(--space-8)" }}
					>
						See all volumes →
					</a>
				</section>
			)}

			<section style={{ padding: "var(--space-16) var(--space-8)" }}>
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-xl)",
						textTransform: "uppercase",
						color: "#fff",
						marginBottom: "var(--space-6)",
					}}
				>
					Meet the Cast
				</h2>
				{otherCharacters.length > 0 ? (
					<div className="char-grid">
						{otherCharacters.map((character) => (
							<CharacterTile key={character.id} character={character} />
						))}
					</div>
				) : (
					!featuredCharacter && <p style={{ color: "rgba(255,255,255,0.4)" }}>Characters coming soon.</p>
				)}
				<a href="/characters" className="char-link" style={{ display: "inline-block", marginTop: "var(--space-6)" }}>
					See all characters →
				</a>
			</section>

			{latestPosts.length > 0 && (
				<section style={{ padding: "var(--space-16) var(--space-8)", background: "var(--color-charcoal)" }}>
					<h2
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "var(--text-xl)",
							textTransform: "uppercase",
							color: "#fff",
							marginBottom: "var(--space-6)",
						}}
					>
						The Slip-Log
					</h2>
					<div className="blog-grid">
						{latestPosts.map((post) => (
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
					<a href="/slip-log" className="char-link" style={{ display: "inline-block", marginTop: "var(--space-8)" }}>
						Read the Slip-Log →
					</a>
				</section>
			)}

			<section style={{ padding: "var(--space-16) var(--space-8)", display: "flex", justifyContent: "center" }}>
				<div className="email-signup-dark">
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
							className="btn-primary"
							style={{ display: "block", width: "100%", textAlign: "center", marginTop: "var(--space-3)" }}
						>
							Submit
						</button>
					</form>
				</div>
			</section>
		</div>
	);
}

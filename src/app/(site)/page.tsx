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

	const featuredHeroUrl = mediaUrl(featuredCharacter?.heroImageKey ?? featuredCharacter?.thumbnailImageKey);

	return (
		<div>
			<section className="hero-preview">
				<div className="hero-bg" />
				<div className="hero-bg-dark" />
				<div className="hero-dot-overlay" />
				<div className="hero-content">
					<h1
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "var(--text-2xl)",
							textTransform: "uppercase",
							color: "#fff",
							lineHeight: 1.2,
							marginBottom: "var(--space-4)",
						}}
					>
						{featuredBook?.title ?? "The Slipshot Universe"}
					</h1>
					{featuredBook?.summary && (
						<p style={{ color: "rgba(255,255,255,0.8)", maxWidth: 440, marginBottom: "var(--space-6)" }}>
							{featuredBook.summary}
						</p>
					)}
					<a className="btn-primary" href="/the-novel">
						Get the Novels
					</a>
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

			{featuredCharacter && (
				<section>
					<div className="char-card">
						<div className="char-card-art" style={{ background: featuredCharacter.accentColor }}>
							<div className="dot-overlay" />
							{featuredHeroUrl && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={featuredHeroUrl}
									alt=""
									style={{
										position: "relative",
										zIndex: 1,
										width: "100%",
										height: "100%",
										objectFit: "contain",
									}}
								/>
							)}
						</div>
						<div className="char-card-content">
							<div className="dot-overlay" />
							{featuredCharacter.quote && <p className="char-quote">&ldquo;{featuredCharacter.quote}&rdquo;</p>}
							{featuredCharacter.bio && <p className="char-bio">{featuredCharacter.bio}</p>}
							<a className="char-link" href={`/characters/${featuredCharacter.slug}`}>
								{featuredCharacter.name} &gt;&gt;
							</a>
						</div>
					</div>
				</section>
			)}

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
							Meet the Slaves &gt;&gt;
						</a>
					</div>
				</div>
				<div
					className="story-banner-right story-banner-half"
					style={
						mediaUrl(varsAccent?.heroImageKey)
							? ({ ["--bg-url" as string]: `url(${mediaUrl(varsAccent?.heroImageKey)})` } as React.CSSProperties)
							: undefined
					}
				>
					<style>{`.story-banner-right::before { background-image: var(--bg-url); }`}</style>
					<div className="story-banner-content">
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
						imageKey: "home/655b9806-90ab-48ad-a2ab-cc9540bc033a.jpg",
					},
					{
						slug: "fredrick-munchen",
						name: "Fredrick Munchen",
						heading: "It was those machines...",
						body: "The ones lurking in the shadows who started it all. It was when I first saw them that I knew something was desperately wrong. And also, Opal. She never was able to elucidate the truth about those machines. Only that, life was too short to worry about such things.",
						imageKey: "home/5b0993a2-0c5b-4cc7-8ed7-bac2e7aabf7b.jpg",
					},
					{
						slug: "blinky",
						name: "Blinky",
						heading: "The lights had meaning...",
						body: "It meant, there was something about Cythiria, something that united her with the Vérkatrae and Griddish and all the Slaves. It was only a matter of time until she came to realize that.",
						imageKey: "home/ee1798ee-7b91-4883-b440-bf13aea61d58.jpg",
					},
					{
						slug: "matere-songgaard",
						name: "Matere Songgaard",
						heading: "I couldn't let it happen...",
						body: "I was not about to let the Engineers get away with their plans. Even though I was one of them, I decided to spend my life thwarting their corrupt and lazy interests. I would not let them have their way, not with the Vars or the Varlings.",
						imageKey: "home/3a1324c5-2078-4b4f-ae0f-b146e2eaca13.jpg",
					},
					{
						slug: "opal-fremmitty",
						name: "Opal Fremmitty",
						heading: "It was too much to ask...",
						body: "I was tired, worn down by my work as a Mechanic Class Slave, stationed on the Vars until the final deed was done. At some point, it was just too much. I could no longer stomach the decisions of the Engineers and their Commission. Something had to change.",
						imageKey: "home/606d484b-6fa6-400f-93b6-3209361dbd11.jpg",
					},
				].map((story, i) => {
					const imgUrl = mediaUrl(story.imageKey);
					return (
						<div key={story.slug} className={`char-story-row${i % 2 === 1 ? " reverse" : ""}`}>
							<div
								className="char-story-img"
								style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}
							/>
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
					<div className="book-stack">
						{allBooks.map((book) => {
							const coverUrl = mediaUrl(book.coverImageKey);
							return (
								<a key={book.id} href="/the-novel" className="book-stack-item">
									{coverUrl && (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={coverUrl} alt={book.title} className="book-stack-cover" />
									)}
									<p className="book-stack-label">{book.title}</p>
								</a>
							);
						})}
					</div>
					<a href="/the-novel" className="char-link" style={{ display: "inline-block", marginTop: "var(--space-8)" }}>
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

import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const timestamps = {
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`(current_timestamp)`),
};

export const books = sqliteTable("books", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	volumeNumber: integer("volume_number"),
	coverImageKey: text("cover_image_key"),
	summary: text("summary"),
	status: text("status", { enum: ["draft", "published"] })
		.notNull()
		.default("draft"),
	releaseDate: text("release_date"),
	amazonUrl: text("amazon_url"),
	bookshopUrl: text("bookshop_url"),
	bnUrl: text("bn_url"),
	...timestamps,
});

export const characters = sqliteTable("characters", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	// Hex color, stored per-row rather than tied to the design system's fixed
	// --char-* tokens, so adding a new character never requires a design
	// system repo change.
	accentColor: text("accent_color").notNull(),
	quote: text("quote"),
	bio: text("bio"),
	// Small image for the character grid / homepage tile.
	thumbnailImageKey: text("thumbnail_image_key"),
	// Larger image for the character detail page's top hero panel.
	heroImageKey: text("hero_image_key"),
	status: text("status", { enum: ["draft", "published"] })
		.notNull()
		.default("draft"),
	...timestamps,
});

// Repeatable story blocks on a character's detail page (heading + copy +
// an optional image each), e.g. "Escape", "First Blush". A character can
// have any number of these, including zero.
export const characterSections = sqliteTable("character_sections", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	characterId: integer("character_id")
		.notNull()
		.references(() => characters.id, { onDelete: "cascade" }),
	position: integer("position").notNull().default(0),
	title: text("title"),
	body: text("body"),
	imageKey: text("image_key"),
	// "full": image full-width, text below. "image-left": narrow image column
	// left, wide copy right. "image-right": wide copy left, narrow image right.
	layout: text("layout", { enum: ["full", "image-left", "image-right"] })
		.notNull()
		.default("full"),
	...timestamps,
});

export const blogPosts = sqliteTable("blog_posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	excerpt: text("excerpt"),
	body: text("body"),
	coverImageKey: text("cover_image_key"),
	category: text("category"),
	status: text("status", { enum: ["draft", "published"] })
		.notNull()
		.default("draft"),
	publishedAt: text("published_at"),
	...timestamps,
});

export const artPieces = sqliteTable("art_pieces", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	artistCredit: text("artist_credit"),
	imageKey: text("image_key").notNull(),
	category: text("category"),
	createdAt: timestamps.createdAt,
});

export const subscribers = sqliteTable("subscribers", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	createdAt: timestamps.createdAt,
});

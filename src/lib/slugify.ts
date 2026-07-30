// Normalizes admin-entered slug input into a safe URL segment. Applied in
// the upsert actions for books/characters/blog posts so stray whitespace,
// capitalization, or punctuation typed into the slug field can never
// produce a slug that doesn't match its own detail-page URL.
export function slugify(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

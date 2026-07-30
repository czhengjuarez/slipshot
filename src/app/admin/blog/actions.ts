"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { uploadMedia } from "@/lib/media";
import { slugify } from "@/lib/slugify";

export async function upsertBlogPost(formData: FormData) {
	const id = formData.get("id") as string | null;
	const cover = formData.get("cover") as File | null;

	const db = await getDb();
	let coverImageKey: string | undefined;
	if (cover && cover.size > 0) {
		coverImageKey = await uploadMedia(cover, "blog");
	}

	const status = formData.get("status") === "published" ? ("published" as const) : ("draft" as const);

	const values = {
		slug: slugify(String(formData.get("slug"))),
		title: String(formData.get("title")),
		excerpt: String(formData.get("excerpt") ?? ""),
		body: String(formData.get("body") ?? ""),
		category: String(formData.get("category") ?? ""),
		status,
		publishedAt: status === "published" ? (String(formData.get("publishedAt") ?? "") || new Date().toISOString()) : null,
		featured: formData.get("featured") === "on",
		updatedAt: new Date().toISOString(),
		...(coverImageKey ? { coverImageKey } : {}),
	};

	if (id) {
		await db
			.update(blogPosts)
			.set(values)
			.where(eq(blogPosts.id, Number(id)));
	} else {
		await db.insert(blogPosts).values(values);
	}

	revalidatePath("/admin/blog");
	revalidatePath("/slip-log");
	redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
	const id = Number(formData.get("id"));
	const db = await getDb();
	await db.delete(blogPosts).where(eq(blogPosts.id, id));
	revalidatePath("/admin/blog");
	revalidatePath("/slip-log");
	redirect("/admin/blog");
}

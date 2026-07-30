"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { books } from "@/db/schema";
import { uploadMedia } from "@/lib/media";

export async function upsertBook(formData: FormData) {
	const id = formData.get("id") as string | null;
	const cover = formData.get("cover") as File | null;

	const db = await getDb();
	let coverImageKey: string | undefined;
	if (cover && cover.size > 0) {
		coverImageKey = await uploadMedia(cover, "books");
	}

	const volumeNumber = formData.get("volumeNumber");

	const values = {
		slug: String(formData.get("slug")),
		title: String(formData.get("title")),
		volumeNumber: volumeNumber ? Number(volumeNumber) : null,
		summary: String(formData.get("summary") ?? ""),
		status: formData.get("status") === "published" ? ("published" as const) : ("draft" as const),
		releaseDate: String(formData.get("releaseDate") ?? "") || null,
		updatedAt: new Date().toISOString(),
		...(coverImageKey ? { coverImageKey } : {}),
	};

	if (id) {
		await db
			.update(books)
			.set(values)
			.where(eq(books.id, Number(id)));
	} else {
		await db.insert(books).values(values);
	}

	revalidatePath("/admin/books");
	revalidatePath("/the-novel");
	redirect("/admin/books");
}

export async function deleteBook(formData: FormData) {
	const id = Number(formData.get("id"));
	const db = await getDb();
	await db.delete(books).where(eq(books.id, id));
	revalidatePath("/admin/books");
	revalidatePath("/the-novel");
	redirect("/admin/books");
}

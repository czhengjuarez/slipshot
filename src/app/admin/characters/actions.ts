"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { uploadMedia } from "@/lib/media";
import { slugify } from "@/lib/slugify";

export async function upsertCharacter(formData: FormData) {
	const id = formData.get("id") as string | null;
	const thumbnail = formData.get("thumbnail") as File | null;
	const hero = formData.get("hero") as File | null;

	const db = await getDb();
	let thumbnailImageKey: string | undefined;
	if (thumbnail && thumbnail.size > 0) {
		thumbnailImageKey = await uploadMedia(thumbnail, "characters");
	}
	let heroImageKey: string | undefined;
	if (hero && hero.size > 0) {
		heroImageKey = await uploadMedia(hero, "characters");
	}

	const values = {
		slug: slugify(String(formData.get("slug"))),
		name: String(formData.get("name")),
		accentColor: String(formData.get("accentColor")),
		quote: String(formData.get("quote") ?? ""),
		bio: String(formData.get("bio") ?? ""),
		status: formData.get("status") === "published" ? ("published" as const) : ("draft" as const),
		updatedAt: new Date().toISOString(),
		...(thumbnailImageKey ? { thumbnailImageKey } : {}),
		...(heroImageKey ? { heroImageKey } : {}),
	};

	if (id) {
		await db
			.update(characters)
			.set(values)
			.where(eq(characters.id, Number(id)));
	} else {
		await db.insert(characters).values(values);
	}

	revalidatePath("/admin/characters");
	revalidatePath("/characters");
	redirect("/admin/characters");
}

export async function deleteCharacter(formData: FormData) {
	const id = Number(formData.get("id"));
	const db = await getDb();
	await db.delete(characters).where(eq(characters.id, id));
	revalidatePath("/admin/characters");
	revalidatePath("/characters");
	redirect("/admin/characters");
}

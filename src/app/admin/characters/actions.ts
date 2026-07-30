"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { uploadMedia } from "@/lib/media";

export async function upsertCharacter(formData: FormData) {
	const id = formData.get("id") as string | null;
	const portrait = formData.get("portrait") as File | null;

	const db = await getDb();
	let portraitImageKey: string | undefined;
	if (portrait && portrait.size > 0) {
		portraitImageKey = await uploadMedia(portrait, "characters");
	}

	const values = {
		slug: String(formData.get("slug")),
		name: String(formData.get("name")),
		accentColor: String(formData.get("accentColor")),
		quote: String(formData.get("quote") ?? ""),
		bio: String(formData.get("bio") ?? ""),
		status: formData.get("status") === "published" ? ("published" as const) : ("draft" as const),
		updatedAt: new Date().toISOString(),
		...(portraitImageKey ? { portraitImageKey } : {}),
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

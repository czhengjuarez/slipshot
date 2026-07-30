"use server";

import { eq, and, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { characterSections } from "@/db/schema";
import { uploadMedia } from "@/lib/media";

export async function upsertSection(formData: FormData) {
	const id = formData.get("id") as string | null;
	const characterId = Number(formData.get("characterId"));
	const image = formData.get("image") as File | null;

	const db = await getDb();
	let imageKey: string | undefined;
	if (image && image.size > 0) {
		imageKey = await uploadMedia(image, "characters/sections");
	}

	const rawLayout = formData.get("layout");
	const layout: "full" | "image-left" | "image-right" =
		rawLayout === "image-left" ? "image-left" : rawLayout === "image-right" ? "image-right" : "full";
	const values = {
		characterId,
		title: String(formData.get("title") ?? ""),
		body: String(formData.get("body") ?? ""),
		layout,
		updatedAt: new Date().toISOString(),
		...(imageKey ? { imageKey } : {}),
	};

	if (id) {
		await db
			.update(characterSections)
			.set(values)
			.where(eq(characterSections.id, Number(id)));
	} else {
		const [{ maxPosition }] = await db
			.select({ maxPosition: sql<number>`coalesce(max(${characterSections.position}), -1)` })
			.from(characterSections)
			.where(eq(characterSections.characterId, characterId));
		await db.insert(characterSections).values({ ...values, position: maxPosition + 1 });
	}

	revalidatePath(`/admin/characters/${characterId}/sections`);
	revalidatePath("/characters");
	redirect(`/admin/characters/${characterId}/sections`);
}

export async function deleteSection(formData: FormData) {
	const id = Number(formData.get("id"));
	const characterId = Number(formData.get("characterId"));
	const db = await getDb();
	await db.delete(characterSections).where(eq(characterSections.id, id));
	revalidatePath(`/admin/characters/${characterId}/sections`);
	revalidatePath("/characters");
	redirect(`/admin/characters/${characterId}/sections`);
}

export async function moveSection(formData: FormData) {
	const id = Number(formData.get("id"));
	const characterId = Number(formData.get("characterId"));
	const direction = formData.get("direction") as "up" | "down";

	const db = await getDb();
	const sections = await db
		.select()
		.from(characterSections)
		.where(eq(characterSections.characterId, characterId))
		.orderBy(characterSections.position);

	const index = sections.findIndex((s) => s.id === id);
	const swapIndex = direction === "up" ? index - 1 : index + 1;

	if (index !== -1 && swapIndex >= 0 && swapIndex < sections.length) {
		const a = sections[index];
		const b = sections[swapIndex];
		await db
			.update(characterSections)
			.set({ position: b.position })
			.where(and(eq(characterSections.id, a.id)));
		await db
			.update(characterSections)
			.set({ position: a.position })
			.where(and(eq(characterSections.id, b.id)));
	}

	revalidatePath(`/admin/characters/${characterId}/sections`);
	revalidatePath("/characters");
	redirect(`/admin/characters/${characterId}/sections`);
}

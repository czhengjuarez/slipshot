"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { artPieces } from "@/db/schema";
import { uploadMedia } from "@/lib/media";

export async function upsertArtPiece(formData: FormData) {
	const id = formData.get("id") as string | null;
	const image = formData.get("image") as File | null;

	const db = await getDb();

	let imageKey: string | undefined;
	if (image && image.size > 0) {
		imageKey = await uploadMedia(image, "art");
	} else if (!id) {
		throw new Error("An image is required for a new art piece.");
	}

	const values = {
		title: String(formData.get("title")),
		artistCredit: String(formData.get("artistCredit") ?? ""),
		category: String(formData.get("category") ?? ""),
		...(imageKey ? { imageKey } : {}),
	};

	if (id) {
		await db
			.update(artPieces)
			.set(values)
			.where(eq(artPieces.id, Number(id)));
	} else {
		await db.insert(artPieces).values({ ...values, imageKey: imageKey! });
	}

	revalidatePath("/admin/art");
	revalidatePath("/art");
	redirect("/admin/art");
}

export async function deleteArtPiece(formData: FormData) {
	const id = Number(formData.get("id"));
	const db = await getDb();
	await db.delete(artPieces).where(eq(artPieces.id, id));
	revalidatePath("/admin/art");
	revalidatePath("/art");
	redirect("/admin/art");
}

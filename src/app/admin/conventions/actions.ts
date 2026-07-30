"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { conventions } from "@/db/schema";
import { uploadMedia } from "@/lib/media";

export async function upsertConvention(formData: FormData) {
	const id = formData.get("id") as string | null;
	const logo = formData.get("logo") as File | null;

	const db = await getDb();
	let logoImageKey: string | undefined;
	if (logo && logo.size > 0) {
		logoImageKey = await uploadMedia(logo, "conventions");
	}

	const values = {
		name: String(formData.get("name")),
		description: String(formData.get("description") ?? "") || null,
		location: String(formData.get("location") ?? "") || null,
		websiteUrl: String(formData.get("websiteUrl") ?? "") || null,
		startDate: String(formData.get("startDate")),
		endDate: String(formData.get("endDate") ?? "") || null,
		status: formData.get("status") === "published" ? ("published" as const) : ("draft" as const),
		updatedAt: new Date().toISOString(),
		...(logoImageKey ? { logoImageKey } : {}),
	};

	if (id) {
		await db
			.update(conventions)
			.set(values)
			.where(eq(conventions.id, Number(id)));
	} else {
		await db.insert(conventions).values(values);
	}

	revalidatePath("/admin/conventions");
	revalidatePath("/conventions");
	redirect("/admin/conventions");
}

export async function deleteConvention(formData: FormData) {
	const id = Number(formData.get("id"));
	const db = await getDb();
	await db.delete(conventions).where(eq(conventions.id, id));
	revalidatePath("/admin/conventions");
	revalidatePath("/conventions");
	redirect("/admin/conventions");
}

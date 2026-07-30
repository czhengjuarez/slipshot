"use server";

import { getDb } from "@/db";
import { subscribers } from "@/db/schema";
import { redirect } from "next/navigation";

export async function subscribeToList(formData: FormData) {
	const email = String(formData.get("email") ?? "").trim();
	if (!email) redirect("/join-the-list");

	const db = await getDb();
	try {
		await db.insert(subscribers).values({ email });
	} catch {
		// Unique constraint on email — already subscribed. Treat as success,
		// no need to surface a duplicate-signup error to the visitor.
	}

	redirect("/join-the-list?subscribed=1");
}

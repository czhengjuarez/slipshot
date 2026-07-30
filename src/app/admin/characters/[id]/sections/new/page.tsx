import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { SectionForm } from "../SectionForm";

export default async function NewSectionPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const characterId = Number(id);
	const db = await getDb();
	const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
	if (!character) notFound();

	return (
		<div>
			<h1 className="admin-page-title">New Section — {character.name}</h1>
			<SectionForm characterId={characterId} />
		</div>
	);
}

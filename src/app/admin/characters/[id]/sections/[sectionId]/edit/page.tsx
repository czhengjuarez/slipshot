import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { characters, characterSections } from "@/db/schema";
import { SectionForm } from "../../SectionForm";

export default async function EditSectionPage({
	params,
}: {
	params: Promise<{ id: string; sectionId: string }>;
}) {
	const { id, sectionId } = await params;
	const characterId = Number(id);
	const db = await getDb();

	const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
	if (!character) notFound();

	const [section] = await db
		.select()
		.from(characterSections)
		.where(eq(characterSections.id, Number(sectionId)));
	if (!section) notFound();

	return (
		<div>
			<h1 className="admin-page-title">Edit Section — {character.name}</h1>
			<SectionForm characterId={characterId} section={section} />
		</div>
	);
}

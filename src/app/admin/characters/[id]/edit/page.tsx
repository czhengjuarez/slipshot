import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { CharacterForm } from "../../CharacterForm";

export default async function EditCharacterPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const db = await getDb();
	const [character] = await db
		.select()
		.from(characters)
		.where(eq(characters.id, Number(id)));

	if (!character) notFound();

	return (
		<div>
			<h1 className="admin-page-title">Edit Character</h1>
			<CharacterForm character={character} />
		</div>
	);
}

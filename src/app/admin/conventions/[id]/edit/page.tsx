import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { conventions } from "@/db/schema";
import { ConventionForm } from "../../ConventionForm";

export default async function EditConventionPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const db = await getDb();
	const [convention] = await db
		.select()
		.from(conventions)
		.where(eq(conventions.id, Number(id)));

	if (!convention) notFound();

	return (
		<div>
			<h1 className="admin-page-title">Edit Convention</h1>
			<ConventionForm convention={convention} />
		</div>
	);
}

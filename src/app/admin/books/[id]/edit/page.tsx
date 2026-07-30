import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { books } from "@/db/schema";
import { BookForm } from "../../BookForm";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const db = await getDb();
	const [book] = await db
		.select()
		.from(books)
		.where(eq(books.id, Number(id)));

	if (!book) notFound();

	return (
		<div>
			<h1 className="admin-page-title">Edit Book</h1>
			<BookForm book={book} />
		</div>
	);
}

import { getDb } from "@/db";
import { books } from "@/db/schema";
import { deleteBook } from "./actions";

export default async function BooksListPage() {
	const db = await getDb();
	const rows = await db.select().from(books).orderBy(books.volumeNumber);

	return (
		<div>
			<div className="admin-toolbar">
				<h1 className="admin-page-title" style={{ marginBottom: 0 }}>
					Books
				</h1>
				<a href="/admin/books/new" className="btn-primary">
					New Book
				</a>
			</div>

			<table className="admin-table">
				<thead>
					<tr>
						<th>Vol.</th>
						<th>Title</th>
						<th>Slug</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{rows.map((book) => (
						<tr key={book.id}>
							<td>{book.volumeNumber ?? "—"}</td>
							<td>{book.title}</td>
							<td>{book.slug}</td>
							<td>
								<span className={`admin-status admin-status--${book.status}`}>{book.status}</span>
							</td>
							<td>
								<div className="admin-actions">
									<a href={`/admin/books/${book.id}/edit`}>Edit</a>
									<form action={deleteBook}>
										<input type="hidden" name="id" value={book.id} />
										<button type="submit" className="btn-ghost" style={{ padding: "4px 12px", fontSize: 11 }}>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					))}
					{rows.length === 0 && (
						<tr>
							<td colSpan={5} style={{ color: "rgba(255,255,255,0.4)" }}>
								No books yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

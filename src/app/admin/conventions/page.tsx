import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { conventions } from "@/db/schema";
import { deleteConvention } from "./actions";

export default async function ConventionsListPage() {
	const db = await getDb();
	const rows = await db.select().from(conventions).orderBy(desc(conventions.startDate));

	return (
		<div>
			<div className="admin-toolbar">
				<h1 className="admin-page-title" style={{ marginBottom: 0 }}>
					Conventions
				</h1>
				<a href="/admin/conventions/new" className="btn-primary">
					New Convention
				</a>
			</div>

			<table className="admin-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Dates</th>
						<th>Location</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{rows.map((c) => (
						<tr key={c.id}>
							<td>{c.name}</td>
							<td>
								{c.startDate}
								{c.endDate && c.endDate !== c.startDate ? ` – ${c.endDate}` : ""}
							</td>
							<td>{c.location ?? "—"}</td>
							<td>
								<span className={`admin-status admin-status--${c.status}`}>{c.status}</span>
							</td>
							<td>
								<div className="admin-actions">
									<a href={`/admin/conventions/${c.id}/edit`}>Edit</a>
									<form action={deleteConvention}>
										<input type="hidden" name="id" value={c.id} />
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
								No conventions yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

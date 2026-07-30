import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { deleteCharacter } from "./actions";

export default async function CharactersListPage() {
	const db = await getDb();
	const rows = await db.select().from(characters).orderBy(characters.name);

	return (
		<div>
			<div className="admin-toolbar">
				<h1 className="admin-page-title" style={{ marginBottom: 0 }}>
					Characters
				</h1>
				<a href="/admin/characters/new" className="btn-primary">
					New Character
				</a>
			</div>

			<table className="admin-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Slug</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{rows.map((character) => (
						<tr key={character.id}>
							<td>
								<span
									style={{
										display: "inline-block",
										width: 10,
										height: 10,
										borderRadius: 2,
										background: character.accentColor,
										marginRight: 8,
									}}
								/>
								{character.name}
							</td>
							<td>{character.slug}</td>
							<td>
								<span className={`admin-status admin-status--${character.status}`}>{character.status}</span>
							</td>
							<td>
								<div className="admin-actions">
									<a href={`/admin/characters/${character.id}/edit`}>Edit</a>
									<form action={deleteCharacter}>
										<input type="hidden" name="id" value={character.id} />
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
							<td colSpan={4} style={{ color: "rgba(255,255,255,0.4)" }}>
								No characters yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

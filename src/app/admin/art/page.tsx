import { getDb } from "@/db";
import { artPieces } from "@/db/schema";
import { deleteArtPiece } from "./actions";
import { mediaUrl } from "@/lib/media";

export default async function ArtListPage() {
	const db = await getDb();
	const rows = await db.select().from(artPieces).orderBy(artPieces.title);

	return (
		<div>
			<div className="admin-toolbar">
				<h1 className="admin-page-title" style={{ marginBottom: 0 }}>
					Art
				</h1>
				<a href="/admin/art/new" className="btn-primary">
					New Art Piece
				</a>
			</div>

			<table className="admin-table">
				<thead>
					<tr>
						<th></th>
						<th>Title</th>
						<th>Artist</th>
						<th>Category</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{rows.map((art) => (
						<tr key={art.id}>
							<td>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={mediaUrl(art.imageKey) ?? undefined}
									alt=""
									style={{ height: 40, width: 40, objectFit: "cover", borderRadius: 2 }}
								/>
							</td>
							<td>{art.title}</td>
							<td>{art.artistCredit ?? "—"}</td>
							<td>{art.category ?? "—"}</td>
							<td>
								<div className="admin-actions">
									<a href={`/admin/art/${art.id}/edit`}>Edit</a>
									<form action={deleteArtPiece}>
										<input type="hidden" name="id" value={art.id} />
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
								No art yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

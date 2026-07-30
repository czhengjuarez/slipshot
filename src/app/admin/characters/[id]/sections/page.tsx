import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { characters, characterSections } from "@/db/schema";
import { mediaUrl } from "@/lib/media";
import { deleteSection, moveSection } from "./actions";

export default async function CharacterSectionsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const characterId = Number(id);
	const db = await getDb();

	const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
	if (!character) notFound();

	const sections = await db
		.select()
		.from(characterSections)
		.where(eq(characterSections.characterId, characterId))
		.orderBy(characterSections.position);

	return (
		<div>
			<a href={`/admin/characters/${characterId}/edit`} className="admin-nav-item" style={{ padding: 0, marginBottom: 16, display: "inline-block" }}>
				← Back to {character.name}
			</a>

			<div className="admin-toolbar">
				<h1 className="admin-page-title" style={{ marginBottom: 0 }}>
					Story Sections — {character.name}
				</h1>
				<a href={`/admin/characters/${characterId}/sections/new`} className="btn-primary">
					New Section
				</a>
			</div>

			<table className="admin-table">
				<thead>
					<tr>
						<th></th>
						<th>Title</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{sections.map((section, index) => (
						<tr key={section.id}>
							<td>
								{section.imageKey && (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={mediaUrl(section.imageKey) ?? undefined}
										alt=""
										style={{ height: 32, width: 32, objectFit: "cover", borderRadius: 2 }}
									/>
								)}
							</td>
							<td>{section.title || <em style={{ color: "rgba(255,255,255,0.4)" }}>Untitled</em>}</td>
							<td>
								<div className="admin-actions">
									<form action={moveSection}>
										<input type="hidden" name="id" value={section.id} />
										<input type="hidden" name="characterId" value={characterId} />
										<input type="hidden" name="direction" value="up" />
										<button type="submit" className="btn-ghost" style={{ padding: "4px 8px", fontSize: 11 }} disabled={index === 0}>
											↑
										</button>
									</form>
									<form action={moveSection}>
										<input type="hidden" name="id" value={section.id} />
										<input type="hidden" name="characterId" value={characterId} />
										<input type="hidden" name="direction" value="down" />
										<button
											type="submit"
											className="btn-ghost"
											style={{ padding: "4px 8px", fontSize: 11 }}
											disabled={index === sections.length - 1}
										>
											↓
										</button>
									</form>
									<a href={`/admin/characters/${characterId}/sections/${section.id}/edit`}>Edit</a>
									<form action={deleteSection}>
										<input type="hidden" name="id" value={section.id} />
										<input type="hidden" name="characterId" value={characterId} />
										<button type="submit" className="btn-ghost" style={{ padding: "4px 12px", fontSize: 11 }}>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					))}
					{sections.length === 0 && (
						<tr>
							<td colSpan={3} style={{ color: "rgba(255,255,255,0.4)" }}>
								No sections yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

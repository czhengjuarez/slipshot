import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { artPieces } from "@/db/schema";
import { ArtPieceForm } from "../../ArtPieceForm";

export default async function EditArtPiecePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const db = await getDb();
	const [art] = await db
		.select()
		.from(artPieces)
		.where(eq(artPieces.id, Number(id)));

	if (!art) notFound();

	return (
		<div>
			<h1 className="admin-page-title">Edit Art Piece</h1>
			<ArtPieceForm art={art} />
		</div>
	);
}

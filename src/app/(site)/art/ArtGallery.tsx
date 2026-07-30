"use client";

import { useState } from "react";
import { mediaUrl } from "@/lib/media";

type ArtPiece = {
	id: number;
	title: string;
	artistCredit: string | null;
	caption: string | null;
	imageKey: string;
	category: string | null;
};

export function ArtGallery({ pieces, categories }: { pieces: ArtPiece[]; categories: string[] }) {
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const visiblePieces = activeCategory ? pieces.filter((p) => p.category === activeCategory) : pieces;

	return (
		<div>
			<div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
				<FilterPill label="All" active={activeCategory === null} onClick={() => setActiveCategory(null)} />
				{categories.map((category) => (
					<FilterPill
						key={category}
						label={category}
						active={activeCategory === category}
						onClick={() => setActiveCategory(category)}
					/>
				))}
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					gap: 4,
				}}
			>
				{visiblePieces.map((piece) => (
					<ArtTile key={piece.id} piece={piece} />
				))}
			</div>

			{visiblePieces.length === 0 && <p style={{ color: "rgba(255,255,255,0.4)" }}>Nothing in this category yet.</p>}
		</div>
	);
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={active ? "badge badge-violet" : "badge badge-dark"}
			style={{ cursor: "pointer", border: "none" }}
		>
			{label}
		</button>
	);
}

function ArtTile({ piece }: { piece: ArtPiece }) {
	const [hovered, setHovered] = useState(false);
	const imageUrl = mediaUrl(piece.imageKey);

	return (
		<div
			style={{ position: "relative", aspectRatio: "1", overflow: "hidden", cursor: "pointer" }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={imageUrl ?? undefined}
				alt={piece.title}
				style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 55%)",
					opacity: hovered ? 1 : 0,
					transition: "opacity 0.15s",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					padding: "var(--space-3)",
				}}
			>
				<div style={{ color: "#fff", fontSize: "var(--text-sm)" }}>{piece.title}</div>
				{piece.artistCredit && (
					<div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>by {piece.artistCredit}</div>
				)}
				{piece.caption && (
					<div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{piece.caption}</div>
				)}
			</div>
		</div>
	);
}

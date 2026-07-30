"use client";

import { useState } from "react";
import { mediaUrl } from "@/lib/media";
import { CalendarView } from "./CalendarView";
import { formatDateRange, parseDate } from "./dateUtils";

type Convention = {
	id: number;
	name: string;
	description: string | null;
	location: string | null;
	logoImageKey: string | null;
	websiteUrl: string | null;
	startDate: string;
	endDate: string | null;
};

export function ConventionsView({ conventions }: { conventions: Convention[] }) {
	const [view, setView] = useState<"list" | "calendar">("list");

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const upcoming = conventions
		.filter((c) => parseDate(c.endDate ?? c.startDate) >= today)
		.sort((a, b) => a.startDate.localeCompare(b.startDate));
	const past = conventions
		.filter((c) => parseDate(c.endDate ?? c.startDate) < today)
		.sort((a, b) => b.startDate.localeCompare(a.startDate));

	return (
		<div>
			<div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
				<button
					type="button"
					onClick={() => setView("list")}
					className={view === "list" ? "badge badge-violet" : "badge badge-dark"}
					style={{ cursor: "pointer", border: "none" }}
				>
					List
				</button>
				<button
					type="button"
					onClick={() => setView("calendar")}
					className={view === "calendar" ? "badge badge-violet" : "badge badge-dark"}
					style={{ cursor: "pointer", border: "none" }}
				>
					Calendar
				</button>
			</div>

			{view === "calendar" ? (
				<CalendarView conventions={conventions} />
			) : (
				<div>
					<ConventionGroup title="Upcoming Cons" items={upcoming} />
					<ConventionGroup title="Past Cons" items={past} />
					{conventions.length === 0 && (
						<p style={{ color: "rgba(255,255,255,0.4)" }}>No conventions announced yet.</p>
					)}
				</div>
			)}
		</div>
	);
}

function ConventionGroup({ title, items }: { title: string; items: Convention[] }) {
	if (items.length === 0) return null;

	return (
		<div style={{ marginBottom: "var(--space-8)" }}>
			<h2
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-lg)",
					textTransform: "uppercase",
					color: "#fff",
					marginBottom: "var(--space-4)",
				}}
			>
				{title}
			</h2>
			<div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(255,255,255,0.06)" }}>
				{items.map((c) => (
					<ConventionRow key={c.id} convention={c} />
				))}
			</div>
		</div>
	);
}

function ConventionRow({ convention }: { convention: Convention }) {
	const logoUrl = mediaUrl(convention.logoImageKey);
	const content = (
		<div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)", background: "var(--color-dark)" }}>
			<div
				style={{
					width: 64,
					height: 64,
					flexShrink: 0,
					background: "var(--color-charcoal)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{logoUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
				) : (
					<span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>No logo</span>
				)}
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: "var(--text-md)" }}>
					{convention.name}
				</div>
				<div style={{ color: "rgba(255,255,255,0.5)", fontSize: "var(--text-sm)", marginTop: 2 }}>
					{formatDateRange(convention.startDate, convention.endDate)}
					{convention.location ? ` · ${convention.location}` : ""}
				</div>
				{convention.description && (
					<p
						style={{
							color: "rgba(255,255,255,0.6)",
							fontSize: "var(--text-sm)",
							marginTop: 6,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{convention.description}
					</p>
				)}
			</div>
		</div>
	);

	if (convention.websiteUrl) {
		return (
			<a href={convention.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
				{content}
			</a>
		);
	}
	return content;
}

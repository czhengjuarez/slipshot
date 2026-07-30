"use client";

import { useState } from "react";
import { mediaUrl } from "@/lib/media";
import { isDateInRange } from "./dateUtils";

type Convention = {
	id: number;
	name: string;
	location: string | null;
	logoImageKey: string | null;
	websiteUrl: string | null;
	startDate: string;
	endDate: string | null;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ conventions }: { conventions: Convention[] }) {
	const today = new Date();
	const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

	const year = cursor.getFullYear();
	const month = cursor.getMonth();
	const firstOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const startWeekday = firstOfMonth.getDay();

	const cells: (Date | null)[] = [
		...Array(startWeekday).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
	];
	while (cells.length % 7 !== 0) cells.push(null);

	return (
		<div>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
				<button
					type="button"
					className="btn-ghost"
					style={{ padding: "6px 14px" }}
					onClick={() => setCursor(new Date(year, month - 1, 1))}
				>
					← Prev
				</button>
				<h2
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "var(--text-lg)",
						textTransform: "uppercase",
						color: "#fff",
					}}
				>
					{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
				</h2>
				<button
					type="button"
					className="btn-ghost"
					style={{ padding: "6px 14px" }}
					onClick={() => setCursor(new Date(year, month + 1, 1))}
				>
					Next →
				</button>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
				{WEEKDAY_LABELS.map((label) => (
					<div
						key={label}
						style={{
							background: "var(--color-black)",
							padding: "var(--space-2)",
							fontSize: 11,
							textTransform: "uppercase",
							letterSpacing: 1,
							color: "rgba(255,255,255,0.4)",
							textAlign: "center",
						}}
					>
						{label}
					</div>
				))}
				{cells.map((date, i) => {
					const dayConventions = date ? conventions.filter((c) => isDateInRange(date, c.startDate, c.endDate)) : [];
					return (
						<div
							key={i}
							style={{
								background: "var(--color-dark)",
								minHeight: 90,
								padding: "var(--space-2)",
								opacity: date ? 1 : 0.3,
							}}
						>
							{date && (
								<>
									<div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{date.getDate()}</div>
									{dayConventions.map((c) => (
										<a
											key={c.id}
											href={c.websiteUrl ?? undefined}
											target={c.websiteUrl ? "_blank" : undefined}
											rel={c.websiteUrl ? "noopener noreferrer" : undefined}
											style={{
												display: "flex",
												alignItems: "center",
												gap: 4,
												background: "var(--color-violet)",
												color: "#fff",
												fontSize: 10,
												padding: "2px 4px",
												marginBottom: 2,
												textDecoration: "none",
												cursor: c.websiteUrl ? "pointer" : "default",
											}}
											title={c.name}
										>
											{mediaUrl(c.logoImageKey) && (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={mediaUrl(c.logoImageKey) ?? undefined}
													alt=""
													style={{ width: 12, height: 12, objectFit: "contain", flexShrink: 0 }}
												/>
											)}
											<span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
										</a>
									))}
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

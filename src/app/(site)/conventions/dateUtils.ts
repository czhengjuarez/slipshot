// Dates are stored as "YYYY-MM-DD" strings. Parse as local midnight
// consistently (not UTC) so calendar grid placement and "is this con
// upcoming" comparisons don't drift by a day depending on timezone.
export function parseDate(dateStr: string): Date {
	const [year, month, day] = dateStr.split("-").map(Number);
	return new Date(year, month - 1, day);
}

export function isSameDay(a: Date, b: Date): boolean {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isDateInRange(date: Date, startDate: string, endDate: string | null): boolean {
	const start = parseDate(startDate);
	const end = endDate ? parseDate(endDate) : start;
	const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) && d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
}

export function formatDateRange(startDate: string, endDate: string | null): string {
	const start = parseDate(startDate);
	const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	if (!endDate || endDate === startDate) return startStr;
	const end = parseDate(endDate);
	const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
	const endStr = sameMonth
		? end.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })
		: end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	return `${startStr} – ${endStr}`;
}

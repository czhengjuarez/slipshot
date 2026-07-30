import { subscribeToList } from "./actions";

export default async function JoinTheListPage({
	searchParams,
}: {
	searchParams: Promise<{ subscribed?: string }>;
}) {
	const { subscribed } = await searchParams;

	return (
		<div style={{ padding: "var(--space-8)", maxWidth: 480 }}>
			<h1
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-2xl)",
					textTransform: "uppercase",
					color: "#fff",
					marginBottom: "var(--space-6)",
				}}
			>
				Join the Insider List
			</h1>

			{subscribed ? (
				<p style={{ color: "#58c820" }}>You&rsquo;re on the list — thanks for joining.</p>
			) : (
				<>
					<p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "var(--space-6)" }}>
						Sign up for the latest news, contests, and giveaways from the Slipshot universe.
					</p>
					<form action={subscribeToList}>
						<div className="form-group">
							<label className="form-label" htmlFor="email">
								Email address
							</label>
							<input
								className="form-input"
								id="email"
								name="email"
								type="email"
								placeholder="Enter your email address"
								required
							/>
						</div>
						<button type="submit" className="btn-primary">
							Submit
						</button>
					</form>
				</>
			)}
		</div>
	);
}

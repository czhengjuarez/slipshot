import "./admin.css";

// NOTE: This route group is not gated in application code. Per the migration
// plan, /admin* gets protected by Cloudflare Access (Zero Trust dashboard
// config on the slipshot.io custom domain) rather than in-app auth — that
// needs to be configured before this goes live. See the plan's "Admin"
// section.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="admin-layout">
			<aside className="admin-sidebar">
				<span className="admin-sidebar-title">Slipshot Admin</span>
				<nav>
					<a className="admin-nav-item" href="/admin">
						Dashboard
					</a>
					<a className="admin-nav-item" href="/admin/books">
						Books
					</a>
					<a className="admin-nav-item" href="/admin/characters">
						Characters
					</a>
					<a className="admin-nav-item" href="/admin/blog">
						Blog Posts
					</a>
					<a className="admin-nav-item" href="/admin/art">
						Art
					</a>
					<a className="admin-nav-item" href="/" style={{ marginTop: 24, opacity: 0.5 }}>
						← Back to site
					</a>
				</nav>
			</aside>
			<main className="admin-main">{children}</main>
		</div>
	);
}

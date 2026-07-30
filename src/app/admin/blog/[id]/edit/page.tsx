import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { BlogPostForm } from "../../BlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const db = await getDb();
	const [post] = await db
		.select()
		.from(blogPosts)
		.where(eq(blogPosts.id, Number(id)));

	if (!post) notFound();

	return (
		<div>
			<h1 className="admin-page-title">Edit Blog Post</h1>
			<BlogPostForm post={post} />
		</div>
	);
}

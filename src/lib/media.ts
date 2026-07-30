import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Uploads a file to the slipshot-media R2 bucket under the given prefix
 * (e.g. "characters", "books", "blog", "art") and returns the object key.
 * Serve uploaded files back via /media/[...key], which proxies R2 through
 * the app rather than requiring a public R2 bucket domain to be configured.
 */
export async function uploadMedia(file: File, prefix: string): Promise<string> {
	const { env } = await getCloudflareContext({ async: true });
	const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
	const key = `${prefix}/${crypto.randomUUID()}.${extension}`;
	await env.MEDIA.put(key, await file.arrayBuffer(), {
		httpMetadata: { contentType: file.type || "application/octet-stream" },
	});
	return key;
}

export function mediaUrl(key: string | null | undefined): string | null {
	if (!key) return null;
	return `/media/${key}`;
}

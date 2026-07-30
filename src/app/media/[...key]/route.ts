import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
	const { key } = await params;
	const { env } = await getCloudflareContext({ async: true });
	const object = await env.MEDIA.get(key.join("/"));

	if (!object) {
		return new Response("Not found", { status: 404 });
	}

	// Read metadata as plain properties rather than calling
	// object.writeHttpMetadata(headers) — under the local dev R2 binding
	// proxy (next dev via @opennextjs/cloudflare), method arguments get
	// serialized across an RPC boundary, and a live Headers instance isn't
	// a plain object, so that call throws in dev (works fine in prod, but
	// don't rely on it either way).
	const headers = new Headers();
	if (object.httpMetadata?.contentType) {
		headers.set("content-type", object.httpMetadata.contentType);
	}
	headers.set("etag", object.httpEtag);
	headers.set("cache-control", "public, max-age=31536000, immutable");

	return new Response(object.body, { headers });
}

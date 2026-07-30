"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// @uiw/react-md-editor touches the DOM at import time, so it can't run
// during SSR/build. (Previously used @mdxeditor/editor — swapped out
// because it doesn't officially support React 19 yet: block-level
// commands like headings and lists silently no-op with no console error,
// while simple inline commands like bold worked. This library has native
// React 19 support.)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function MarkdownEditorField({ name, defaultValue }: { name: string; defaultValue: string }) {
	const [value, setValue] = useState(defaultValue);

	return (
		<div data-color-mode="light">
			<input type="hidden" name={name} value={value} />
			<MDEditor value={value} onChange={(v) => setValue(v ?? "")} height={360} />
		</div>
	);
}

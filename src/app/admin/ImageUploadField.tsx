"use client";

import { useRef, useState } from "react";

/**
 * File input that also accepts a pasted image (Cmd/Ctrl+V) — assigns the
 * pasted image to the underlying file input via DataTransfer, so the rest
 * of the form (FormData-based Server Actions) doesn't need to know the
 * difference between a chosen file and a pasted one.
 */
export function ImageUploadField({
	id,
	name,
	currentImageUrl,
}: {
	id: string;
	name: string;
	currentImageUrl?: string | null;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl ?? null);

	function setFile(file: File) {
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		if (inputRef.current) inputRef.current.files = dataTransfer.files;
		setPreviewUrl(URL.createObjectURL(file));
	}

	function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
		const item = Array.from(event.clipboardData.items).find((i) => i.type.startsWith("image/"));
		const file = item?.getAsFile();
		if (file) {
			event.preventDefault();
			setFile(file);
		}
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) setPreviewUrl(URL.createObjectURL(file));
	}

	return (
		<div>
			{previewUrl && (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={previewUrl} alt="" style={{ height: 80, marginBottom: 8, display: "block", borderRadius: 2 }} />
			)}
			<div
				onPaste={handlePaste}
				tabIndex={0}
				style={{
					border: "1px dashed rgba(255,255,255,0.2)",
					borderRadius: 2,
					padding: "8px 12px",
					fontSize: 12,
					color: "rgba(255,255,255,0.5)",
					marginBottom: 8,
				}}
			>
				Click here, then paste (Cmd/Ctrl+V) an image — or choose a file below.
			</div>
			<input ref={inputRef} type="file" id={id} name={name} accept="image/*" onChange={handleChange} />
		</div>
	);
}

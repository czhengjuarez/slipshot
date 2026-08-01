"use client";

import { useEffect, useRef, useState } from "react";

export function RevealSlide({
	children,
	direction = "left",
}: {
	children: React.ReactNode;
	direction?: "left" | "right";
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translateX(0)" : `translateX(${direction === "left" ? "-4%" : "4%"})`,
				transition: "opacity 0.7s ease, transform 0.7s ease",
			}}
		>
			{children}
		</div>
	);
}

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const postnobills = localFont({
	src: "./fonts/postnobillscolombo-regular.ttf",
	variable: "--font-postnobills",
	weight: "400 700",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Slipshot",
	description: "The Slipshot universe.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${montserrat.variable} ${postnobills.variable}`}>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body>{children}</body>
		</html>
	);
}

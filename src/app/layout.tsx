import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hôm nay đi đâu nè? 💕",
  description:
    "Website dễ thương để chọn địa điểm hẹn hò cùng người yêu. Chấm điểm từ 1-10 cho những nơi bạn muốn đi nhé!",
  keywords: ["hẹn hò", "dating", "địa điểm", "couple", "tình yêu"],
  openGraph: {
    title: "Hôm nay đi đâu nè? 💕",
    description: "Chọn địa điểm hẹn hò yêu thích cùng người yêu!",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fdf2f8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${quicksand.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

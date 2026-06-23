import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andy Weekly Test Maker",
  description: "ESL Rainbows Red Vol.2 Unit 1-12 weekly test practice for Andy"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}

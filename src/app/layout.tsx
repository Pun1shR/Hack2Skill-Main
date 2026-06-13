import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import AudioPlayer from "@/components/AudioPlayer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmic Guru AI",
  description: "Your personal guide to calm, focus, and exam preparation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhoomi Oza | Portfolio",
  description: "Personal portfolio: projects, skills, and contact.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
          <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-mono text-sm font-semibold">
              bhoomi.oza
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/about-me" className="hover:underline">
                About Me
              </Link>
              <Link href="/projects" className="hover:underline">
                Projects
              </Link>
              <Link href="/contact-me-server-form" className="hover:underline">
                Contact
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
          Built with Next.js
        </footer>
      </body>
    </html>
  );
}

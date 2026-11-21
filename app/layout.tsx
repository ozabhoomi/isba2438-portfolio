import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

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
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-aubergine">
        <header className="sticky top-0 z-10 border-b border-aubergine/15 bg-ivory/80 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
            <Link
              href="/"
              className="font-serif text-xl font-semibold tracking-tight text-aubergine underline decoration-saffron decoration-2 underline-offset-4"
            >
              Bhoomi Oza
            </Link>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-aubergine hover:underline decoration-saffron decoration-2 underline-offset-4">
                Home
              </Link>
              <Link
                href="/about-me"
                className="transition-colors hover:text-aubergine hover:underline decoration-saffron decoration-2 underline-offset-4"
              >
                About Me
              </Link>
              <Link
                href="/projects"
                className="transition-colors hover:text-aubergine hover:underline decoration-saffron decoration-2 underline-offset-4"
              >
                Projects
              </Link>
              <Link
                href="/blogs"
                className="transition-colors hover:text-aubergine hover:underline decoration-saffron decoration-2 underline-offset-4"
              >
                Blog
              </Link>
              <Link
                href="/know-me-better"
                className="transition-colors hover:text-aubergine hover:underline decoration-saffron decoration-2 underline-offset-4"
              >
                Know Me Better
              </Link>
              <Link
                href="/contact-me-server-form"
                className="transition-colors hover:text-aubergine hover:underline decoration-saffron decoration-2 underline-offset-4"
              >
                Contact (Server Action)
              </Link>
              <Link
                href="/contact-me"
                className="transition-colors hover:text-aubergine hover:underline decoration-saffron decoration-2 underline-offset-4"
              >
                Contact (API)
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-aubergine/10 py-6 text-center text-sm text-aubergine/75">
          Built with Next.js ·{" "}
          <Link
            href="/admin"
            className="underline decoration-saffron decoration-2 underline-offset-4 transition-colors hover:text-aubergine"
          >
            Admin
          </Link>
        </footer>
      </body>
    </html>
  );
}

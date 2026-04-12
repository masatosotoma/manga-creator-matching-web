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

export const metadata = {
  title: "MangaCollab | Find your creative partner",
  description: "A matching platform for amateur novelists and illustrators to collaborate and create manga together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="navbar">
          <div className="container navbar-container">
            <h1 className="logo">MangaCollab</h1>
            <nav className="nav-links">
              <a href="/search" className="nav-link">Discover</a>
              <a href="/login" className="btn btn-outline">Log In</a>
              <a href="/register" className="btn btn-primary">Sign Up</a>
            </nav>
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}

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
              <a href="/search" className="nav-link">Discover Creators</a>
              <a href="/gallery" className="nav-link">Gallery (Read)</a>
              <a href="/login" className="btn btn-outline">Log In</a>
              <a href="/register" className="btn btn-primary">Sign Up</a>
            </nav>
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
        <footer className="footer">
          <div className="container footer-container">
            <p>&copy; {new Date().getFullYear()} MangaCollab. All rights reserved.</p>
            <div className="footer-links">
              <a href="/terms" className="footer-link">Terms and Conditions</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

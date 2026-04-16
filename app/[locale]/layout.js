import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { getDictionary } from "../../lib/dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.home.metadataTitle,
    description: dict.home.metadataDescription,
  };
}

import TranslationProvider from "../../components/TranslationProvider";

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <TranslationProvider dict={dict}>
          <header className="navbar">
            <div className="container navbar-container">
              <a href={`/${locale}`}><h1 className="logo">MangaCollab</h1></a>
              <nav className="nav-links">
                <a href={`/${locale}/search`} className="nav-link">{dict.navigation.discover}</a>
                <a href={`/${locale}/gallery`} className="nav-link">{dict.navigation.gallery}</a>
                <a href={`/${locale}/login`} className="btn btn-outline">{dict.navigation.login}</a>
                <a href={`/${locale}/register`} className="btn btn-primary">{dict.navigation.signup}</a>
                <LanguageSwitcher currentLocale={locale} />
              </nav>
            </div>
          </header>
          <main className="main-content">
            {children}
          </main>
          <footer className="footer">
            <div className="container footer-container">
              <p>&copy; {new Date().getFullYear()} MangaCollab. {dict.navigation.allRightsReserved}</p>
              <div className="footer-links">
                <a href={`/${locale}/terms`} className="footer-link">{dict.navigation.terms}</a>
              </div>
            </div>
          </footer>
        </TranslationProvider>
      </body>
    </html>
  );
}

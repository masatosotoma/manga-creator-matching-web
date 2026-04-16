'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher({ currentLocale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (e) => {
    const newLocale = e.target.value;
    if (!pathname) return;
    
    // Replace the current locale in the URL path with the new one
    // Example: /en/search -> /ja/search
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <select 
      onChange={switchLocale} 
      value={currentLocale}
      className="lang-select"
      style={{ 
        marginLeft: '1rem', 
        padding: '0.4rem 0.6rem', 
        borderRadius: '6px', 
        border: '1px solid var(--border-color)', 
        background: 'var(--card-bg)', 
        color: 'var(--text-main)',
        fontSize: '0.9rem',
        cursor: 'pointer'
      }}
    >
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="zh">中文</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  );
}

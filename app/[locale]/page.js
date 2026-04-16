import styles from './page.module.css';
import { getDictionary } from '../../lib/dictionaries';

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {dict.home.whereGreat} <span className={styles.textHighlight}>{dict.home.stories}</span> {dict.home.meetBeautiful} <span className={styles.textHighlight}>{dict.home.art}</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {dict.home.subtitle}
          </p>
          <div className={styles.heroActions}>
            <a href={`/${locale}/register?role=writer`} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>{dict.home.imWriter}</a>
            <a href={`/${locale}/register?role=illustrator`} className="btn btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>{dict.home.imIllustrator}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

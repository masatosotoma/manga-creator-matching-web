import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Where Great <span className={styles.textHighlight}>Stories</span> Meet Beautiful <span className={styles.textHighlight}>Art</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The premier matching platform for amateur novelists and illustrators. 
            Find your perfect creative partner, collaborate seamlessly, and bring your manga to life.
          </p>
          <div className={styles.heroActions}>
            <a href="/register?role=writer" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>I'm a Writer</a>
            <a href="/register?role=illustrator" className="btn btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>I'm an Illustrator</a>
          </div>
        </div>
      </div>
    </div>
  );
}

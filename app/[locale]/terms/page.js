import React from 'react';
import styles from './terms.module.css';
import { getDictionary } from '../../../lib/dictionaries';

export default async function TermsAndConditions({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className={`container ${styles.termsContainer}`}>
      <div className={styles.termsContent}>
        <h1 className={styles.title}>{dict.terms.title}</h1>
        <p className={styles.lastUpdated}>{dict.terms.lastUpdated}</p>
        
        <section className={styles.section}>
          <h2>{dict.terms.section1Title}</h2>
          <p>{dict.terms.section1Body}</p>
        </section>

        <section className={styles.section}>
          <h2>{dict.terms.section2Title}</h2>
          <p>{dict.terms.section2Body}</p>
        </section>

        <section className={styles.section}>
          <h2>{dict.terms.section3Title}</h2>
          <div className={styles.importantClause}>
            <p><strong>{dict.terms.section3Crucial}</strong></p>
            <p>{dict.terms.section3Rule1} <strong>{dict.terms.section3Rule1Bold}</strong>.</p>
            <p>{dict.terms.section3Rule2}</p>
            <ul>
              <li>{dict.terms.section3Rule2Bullet1}</li>
              <li>{dict.terms.section3Rule2Bullet2}</li>
            </ul>
            <p>{dict.terms.section3Rule3}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{dict.terms.section4Title}</h2>
          <p>{dict.terms.section4Body}</p>
        </section>

        <section className={styles.section}>
          <h2>{dict.terms.section5Title}</h2>
          <p>{dict.terms.section5Body}</p>
        </section>

        <section className={styles.section}>
          <h2>{dict.terms.section6Title}</h2>
          <p>{dict.terms.section6Body}</p>
        </section>

      </div>
    </div>
  );
}

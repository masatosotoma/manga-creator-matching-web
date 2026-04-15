import React from 'react';
import styles from './terms.module.css';

export default function TermsAndConditions() {
  return (
    <div className={`container ${styles.termsContainer}`}>
      <div className={styles.termsContent}>
        <h1 className={styles.title}>Terms and Conditions</h1>
        <p className={styles.lastUpdated}>Last Updated: April 14, 2026</p>
        
        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>Welcome to MangaCollab. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Description of Service</h2>
          <p>MangaCollab is a matching platform designed to connect amateur novelists and illustrators, allowing them to collaborate and create manga together.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Ownership and Publication Rights</h2>
          <div className={styles.importantClause}>
            <p><strong>Crucial Rule regarding Works Created on MangaCollab:</strong></p>
            <p>Any works, including but not limited to mangas, illustrations, character designs, and written content created through the collaboration on this website <strong>cannot be published, distributed, or monetized on any other platform, website, or physical medium</strong>.</p>
            <p>The copyright and ownership of the collaborative output belong exclusively to jointly:</p>
            <ul>
              <li>The Creators (the paired novelist and illustrator), and</li>
              <li>MangaCollab (the platform).</li>
            </ul>
            <p>By publishing and creating works on this platform, you acknowledge and agree to these exclusive ownership terms, and you grant MangaCollab permanent, irrevocable rights to display, host, and promote the work on our site.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. User Conduct</h2>
          <p>Users are expected to interact respectfully with one another. Harassment, abusive language, or failure to communicate properly during a collaborative project may result in account suspension.</p>
        </section>

        <section className={styles.section}>
          <h2>5. Account Registration</h2>
          <p>To use our services, you must register as either a Writer or an Illustrator. You agree to provide accurate information and are responsible for maintaining the confidentiality of your account credentials.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Disclaimers</h2>
          <p>The platform is provided "as is". We make no warranties regarding the successful completion of projects or the nature of collaborations between users. We are not responsible for disputes between users, though we may assist in moderation when appropriate.</p>
        </section>

      </div>
    </div>
  );
}

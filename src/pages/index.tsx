import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {PARTS, chapterNumber} from '@site/src/components/parts';
import styles from './index.module.css';

function Outline(): ReactNode {
  return (
    <section className={styles.outline}>
      {PARTS.map((p) => (
        <div key={p.num} className={styles.part}>
          <div className={styles.partHeader}>
            <span className={styles.partNum}>part {p.num}</span>
            <h2>{p.title}</h2>
          </div>
          <p className={styles.summary}>{p.summary}</p>
          <ol className={styles.chapters}>
            {p.chapters.map((c) => (
              <li key={c.num} className={c.doc ? styles.written : styles.upcoming}>
                <span className={styles.marker}>{c.doc ? '+' : '·'}</span>
                <span className={styles.chapterNum}>{chapterNumber(c.num)}</span>
                {c.doc ? <Link to={`/course/${c.doc}`}>{c.title}</Link> : <span>{c.title}</span>}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

export default function Home(): ReactNode {
  const all = PARTS.flatMap((p) => p.chapters);
  const written = all.filter((c) => c.doc).length;
  return (
    <Layout
      title="Apprendre l’infrastructure en code avec OpenTofu"
      description="Cours d’OpenTofu (Terraform) en français, des bases au niveau avancé, avec des TP sur AWS détruits après chaque essai.">
      <header className={styles.hero}>
        <div className={styles.frame}>
          <p className={styles.kicker}>Cours d’infrastructure en code</p>
          <h1 className={styles.title}>Décrire son infrastructure en code avec OpenTofu</h1>
          <p className={styles.lead}>
            Pour qui sait se servir d’un terminal et n’a jamais écrit d’infrastructure en code. Le
            langage et le moteur s’apprennent d’abord sur le poste, sans compte cloud ; viennent
            ensuite AWS, les modules, le travail en équipe, les tests et l’automatisation. Chaque
            TP est exécuté pour de vrai, puis détruit.
          </p>
          <div className={styles.actions}>
            <Link className={styles.button} to="/course/part-0/infrastructure-as-code">
              Commencer : l’infrastructure en code
            </Link>
            <Link className={styles.link} to="/course">
              Comment le cours est construit
            </Link>
          </div>
          <p className={styles.status}>
            <span className={styles.statusAdd}>{written} rédigé{written > 1 ? 's' : ''}</span>
            {' · '}
            {all.length - written} à venir · {all.length} chapitres
          </p>
        </div>
      </header>
      <main className={styles.main}>
        <Outline />
      </main>
    </Layout>
  );
}

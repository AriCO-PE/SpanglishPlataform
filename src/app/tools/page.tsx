
'use client';
import Sidebar from '@/components/Sidebar';
import PageLayout from '@/components/PageLayout';
import styles from './tools.module.scss';

export default function Tools() {
  const tools = [
  {
    name: 'Duolingo',
    description: 'Platform to learn Spanish in an interactive and fun way',
    icon: '🟢',
    status: 'Available',
    link: 'https://www.duolingo.com/'
  },
  {
    name: 'RAE Dictionary',
    description: 'Official dictionary from the Royal Spanish Academy for definitions and spelling checks',
    icon: '📖',
    status: 'Available',
    link: 'https://dle.rae.es/'
  },
  {
    name: 'LingQ (Free content)',
    description: 'Learn vocabulary and listening comprehension with Spanish texts and audio',
    icon: '🎧',
    status: 'Available',
    link: 'https://www.lingq.com/es/'
  },
  {
    name: 'SpanishDict',
    description: 'Dictionary, verb conjugator, and translator from Spanish to other languages',
    icon: '🔤',
    status: 'Available',
    link: 'https://www.spanishdict.com/'
  },
  {
    name: 'Linguee',
    description: 'Bilingual dictionary with usage examples and reliable translations',
    icon: '📝',
    status: 'Available',
    link: 'https://www.linguee.com/'
  },
  {
    name: 'Cervantes Virtual',
    description: 'Digital library with free resources, books, and Spanish texts',
    icon: '🏛️',
    status: 'Available',
    link: 'https://cvc.cervantes.es/'
  },

];


  return (
    <>
      <Sidebar />
      <PageLayout title="Tools">
        <div className={styles.toolsContainer}>
          <div className={styles.toolsHeader}>
            <h2>Learning Tools</h2>
            <p>Enhance your learning experience with our tools</p>
          </div>

          <div className={styles.toolsGrid}>
            {tools.map((tool, index) => (
              <div key={index} className={styles.toolCard}>
                <div className={styles.toolIcon}>
                  <span>{tool.icon}</span>
                </div>
                <div className={styles.toolContent}>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  <span className={`${styles.toolStatus} ${styles[tool.status.replace(' ', '').toLowerCase()]}`}>
                    {tool.status}
                  </span>
                </div>
                <button 
                  className={styles.toolBtn}
                  onClick={() => window.open(tool.link, "_blank")}
                >
                  Launch Tool
                </button>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    </>
  );
}

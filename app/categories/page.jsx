'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const personalityCategories = [
  {
    name: 'Communication',
    slug: 'communication',
    icon: '💬',
    description: 'Master clear expression, storytelling, voice tone, active listening & persuasive speaking.'
  },
  {
    name: 'Posture & Presence',
    slug: 'posture',
    icon: '🧍',
    description: 'Develop powerful body language, confident stance, eye contact and physical charisma.'
  },
  {
    name: 'Confidence & Self-Belief',
    slug: 'confidence',
    icon: '🧠',
    description: 'Build unshakeable inner confidence, overcome self-doubt, and radiate self-worth.'
  },
  {
    name: 'Charisma & Magnetism',
    slug: 'charisma',
    icon: '🌟',
    description: 'Become naturally magnetic — warmth, likability, social energy & instant connection.'
  },
  {
    name: 'Emotional Intelligence',
    slug: 'emotional-intelligence',
    icon: '❤️',
    description: 'Understand & manage emotions — yours and others — empathy, self-regulation & social awareness.'
  },
  {
    name: 'Motivation & Mindset',
    slug: 'motivation',
    icon: '🔥',
    description: 'Cultivate growth mindset, daily drive, resilience and peak mental performance.'
  },
  {
    name: 'Resilience & Mental Toughness',
    slug: 'resilience',
    icon: '🛡️',
    description: 'Bounce back from failure, handle stress, develop grit and emotional endurance.'
  },
  {
    name: 'Self-Discipline & Habits',
    slug: 'self-discipline',
    icon: '⏳',
    description: 'Create unbreakable consistency, strong routines, willpower and long-term focus.'
  },
  {
    name: 'Leadership & Influence',
    slug: 'leadership',
    icon: '👑',
    description: 'Inspire, guide, make decisions, build trust and lead without formal authority.'
  },
];

const academicSections = [
  {
    title: 'Technology & Engineering',
    description: 'This is where your Programming sits. It covers how to build and use digital or physical systems.',
    items: [
      { name: 'Software Development', slug: 'software-development', icon: '💻', description: 'Coding, web, apps, DevOps' },
      { name: 'Cybersecurity', slug: 'cybersecurity', icon: '🔒', description: 'Hacking prevention, encryption, security' },
      { name: 'Robotics', slug: 'robotics', icon: '🤖', description: 'Automation, drones, mechanical AI' },
      { name: 'AI & Machine Learning', slug: 'ai', icon: '🧠', description: 'Neural networks, LLMs, data science' },
      { name: 'Electronics', slug: 'electronics', icon: '⚡', description: 'Circuits, embedded systems, IoT' },
    ]
  },
  {
    title: 'Mathematics & Logic',
    description: 'This is the foundation for technical work.',
    items: [
      { name: 'Algebra', slug: 'algebra', icon: '📐', description: 'Equations, functions, polynomials' },
      { name: 'Statistics & Probability', slug: 'statistics', icon: '📊', description: 'Data analysis, inference, distributions' },
      { name: 'Calculus', slug: 'calculus', icon: '∫', description: 'Limits, derivatives, integrals' },
      { name: 'Discrete Mathematics', slug: 'discrete-math', icon: '♾️', description: 'Logic, sets, graphs, algorithms' },
    ]
  },
  {
    title: 'Natural Sciences',
    description: 'This covers the study of the physical universe.',
    items: [
      { name: 'Physics', slug: 'physics', icon: '⚛️', description: 'Mechanics, electricity, quantum' },
      { name: 'Chemistry', slug: 'chemistry', icon: '🧪', description: 'Reactions, organic, periodic table' },
      { name: 'Biology', slug: 'biology', icon: '🧬', description: 'Cells, genetics, evolution' },
      { name: 'Environmental Science', slug: 'environment', icon: '🌍', description: 'Ecology, climate, sustainability' },
    ]
  },
  {
    title: 'Business & Management',
    description: 'This is about how organizations and money work.',
    items: [
      { name: 'Marketing', slug: 'marketing', icon: '📣', description: 'Branding, ads, consumer behavior' },
      { name: 'Finance', slug: 'finance', icon: '💰', description: 'Investing, accounting, markets' },
      { name: 'Entrepreneurship', slug: 'entrepreneurship', icon: '🚀', description: 'Startups, business models' },
      { name: 'Project Management', slug: 'project-management', icon: '📋', description: 'Agile, Scrum, planning' },
    ]
  },
  {
    title: 'Humanities & Social Sciences',
    description: 'This covers how people think, live, and interact.',
    items: [
      { name: 'History', slug: 'history', icon: '📜', description: 'Events, civilizations, timelines' },
      { name: 'Psychology', slug: 'psychology', icon: '🧑‍🔬', description: 'Behavior, mind, mental health' },
      { name: 'Sociology', slug: 'sociology', icon: '👥', description: 'Society, groups, institutions' },
      { name: 'Philosophy', slug: 'philosophy', icon: '🤔', description: 'Ethics, logic, existence' },
    ]
  },
  {
    title: 'Arts & Design',
    description: 'This is the creative and visual side of study.',
    items: [
      { name: 'Graphic Design', slug: 'graphic-design', icon: '🎨', description: 'Visual communication, branding' },
      { name: 'UI/UX Design', slug: 'ui-ux', icon: '📱', description: 'User interfaces, experience design' },
      { name: 'Architecture', slug: 'architecture', icon: '🏛️', description: 'Buildings, spaces, urban planning' },
      { name: 'Music', slug: 'music', icon: '🎵', description: 'Theory, production, instruments' },
    ]
  },
];

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialMode = searchParams.get('mode') === 'academic' ? 'academic' : 'personality';
  const [mode, setMode] = useState(initialMode);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const current = searchParams.get('mode');
    const shouldBe = mode === 'academic' ? 'academic' : null;

    if (current !== shouldBe) {
      const newParams = new URLSearchParams(searchParams.toString());
      if (shouldBe) {
        newParams.set('mode', shouldBe);
      } else {
        newParams.delete('mode');
      }
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [mode, searchParams, pathname, router]);

  const isPersonality = mode === 'personality';
  const queryLower = searchQuery.toLowerCase().trim();

  // Filtering logic (unchanged)
  let displayedSections = [];
  let filteredSubjects = [];

  if (isPersonality) {
    filteredSubjects = personalityCategories.filter(item =>
      item.name.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower)
    );
  } else {
    const matchedSections = academicSections.filter(section =>
      section.title.toLowerCase().includes(queryLower) ||
      section.description.toLowerCase().includes(queryLower)
    );

    const individuallyMatched = academicSections.flatMap(section =>
      section.items
        .filter(item =>
          item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower)
        )
        .map(item => ({
          ...item,
          sectionTitle: section.title,
          sectionDesc: section.description
        }))
    );

    if (matchedSections.length > 0) {
      displayedSections = matchedSections.map(sec => ({
        ...sec,
        items: sec.items,
      }));

      const extra = individuallyMatched.filter(
        subj => !matchedSections.some(ms => ms.title === subj.sectionTitle)
      );
      if (extra.length > 0) {
        displayedSections.push({
          title: 'Other Matching Subjects',
          description: 'Individual subjects that match your search',
          items: extra,
        });
      }
    } else if (individuallyMatched.length > 0) {
      const grouped = {};
      individuallyMatched.forEach(item => {
        if (!grouped[item.sectionTitle]) {
          grouped[item.sectionTitle] = {
            title: item.sectionTitle,
            description: item.sectionDesc,
            items: [],
          };
        }
        grouped[item.sectionTitle].items.push(item);
      });
      displayedSections = Object.values(grouped);
    }
  }

  return (
    <main className="container" style={styles.page}>
      <div style={styles.toggleWrapper}>
        <button
          onClick={() => setMode(isPersonality ? 'academic' : 'personality')}
          style={{
            ...styles.toggleButton,
            background: isPersonality ? '#a855f7' : 'rgba(168, 85, 247, 0.12)',
            border: isPersonality ? 'none' : '1px solid #a855f7',
            color: isPersonality ? '#fff' : '#a855f7',
          }}
        >
          {isPersonality ? 'Switch to Academics' : 'Switch to Personality'}
        </button>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder={
            isPersonality
              ? "Search categories (e.g. Communication, Confidence)"
              : "Search subjects or fields (e.g. AI, Calculus, Psychology)"
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <h2 style={styles.title}>
        Select a <span style={{ color: '#a855f7' }}>{isPersonality ? 'Category' : 'Subject'}</span>
      </h2>

      <div style={styles.content}>
        {isPersonality ? (
          <div style={styles.grid}>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((item) => (
                <Link href={`/category/${item.slug}`} key={item.slug} style={{ textDecoration: 'none' }}>
                  <div style={styles.card}>
                    <div style={styles.icon}>{item.icon}</div>
                    <h3 style={styles.name}>{item.name}</h3>
                    <p style={styles.desc}>{item.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              searchQuery && (
                <p style={styles.noResults}>
                  No categories match "{searchQuery}"
                </p>
              )
            )}
          </div>
        ) : (
          displayedSections.length > 0 ? (
            displayedSections.map((section) => (
              <div key={section.title} style={styles.section}>
                <h3 style={styles.sectionTitle}>{section.title}</h3>
                <p style={styles.sectionDesc}>{section.description}</p>
                <div style={styles.grid}>
                  {section.items.map((item) => (
                    <Link
                      href={`/category/${item.slug}?mode=academic`}
                      key={item.slug}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={styles.card}>
                        <div style={styles.icon}>{item.icon}</div>
                        <h3 style={styles.name}>{item.name}</h3>
                        <p style={styles.desc}>{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            searchQuery && (
              <p style={styles.noResults}>
                No subjects or fields match "{searchQuery}"
              </p>
            )
          )
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    padding: 'clamp(60px, 10vh, 90px) 5% 80px 5%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    position: 'relative',
    background: '#050505',
  },
  toggleWrapper: {
    position: 'absolute',
    top: '30px',
    right: '5%',
    zIndex: 10,
  },
  toggleButton: {
    padding: '10px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(168,85,247,0.25)',
  },
  searchContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto 40px auto',
  },
  searchInput: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '1.1rem',
    borderRadius: '50px',
    border: '1px solid rgba(168,85,247,0.3)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.3s',
  },
  title: {
    fontSize: '3.2rem',
    marginBottom: '40px',
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    width: '100%',
    maxWidth: '1200px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '28px',
  },
  section: {
    marginBottom: '60px',
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#a855f7',
    marginBottom: '12px',
  },
  sectionDesc: {
    color: '#aaa',
    fontSize: '1.05rem',
    marginBottom: '28px',
    lineHeight: '1.5',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    padding: '36px 20px',
    borderRadius: '20px',
    border: '1px solid #a855f7',          // ← changed to purple border
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  // Optional subtle hover effect that keeps purple theme
  cardHover: {
    ':hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 12px 32px rgba(168,85,247,0.15)',
      borderColor: '#c084fc',               // slightly lighter purple on hover
    },
  },
  icon: {
    fontSize: '3.8rem',
    marginBottom: '18px',
  },
  name: {
    fontSize: '1.5rem',
    color: '#fff',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',
  },
  desc: {
    color: '#bbb',
    fontSize: '0.95rem',
    lineHeight: '1.45',
    textAlign: 'center',
  },
  noResults: {
    color: '#888',
    fontSize: '1.25rem',
    marginTop: '60px',
    textAlign: 'center',
    padding: '20px',
  },
};
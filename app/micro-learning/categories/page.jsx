'use client';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

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

/* ═══ Gradient config per category (visual only — no logic changed) ═══ */
const gradientConfig = {
  communication: { glow: 'linear-gradient(135deg, #a855f7, #3b82f6)', border: 'rgba(168,85,247,0.5)' },
  posture: { glow: 'linear-gradient(135deg, #ec4899, #f97316)', border: 'rgba(236,72,153,0.5)' },
  confidence: { glow: 'linear-gradient(135deg, #10b981, #06b6d4)', border: 'rgba(16,185,129,0.5)' },
  charisma: { glow: 'linear-gradient(135deg, #f59e0b, #eab308)', border: 'rgba(245,158,11,0.5)' },
  'emotional-intelligence': { glow: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'rgba(99,102,241,0.5)' },
  motivation: { glow: 'linear-gradient(135deg, #f97316, #e11d48)', border: 'rgba(249,115,22,0.5)' },
  resilience: { glow: 'linear-gradient(135deg, #14b8a6, #2563eb)', border: 'rgba(20,184,166,0.5)' },
  'self-discipline': { glow: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', border: 'rgba(244,63,94,0.5)' },
  leadership: { glow: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: 'rgba(14,165,233,0.5)' },
};

const cyclicGradients = [
  { glow: 'linear-gradient(135deg, #a855f7, #3b82f6)', border: 'rgba(168,85,247,0.5)' },
  { glow: 'linear-gradient(135deg, #ec4899, #f97316)', border: 'rgba(236,72,153,0.5)' },
  { glow: 'linear-gradient(135deg, #10b981, #06b6d4)', border: 'rgba(16,185,129,0.5)' },
  { glow: 'linear-gradient(135deg, #f59e0b, #eab308)', border: 'rgba(245,158,11,0.5)' },
  { glow: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'rgba(99,102,241,0.5)' },
  { glow: 'linear-gradient(135deg, #f97316, #e11d48)', border: 'rgba(249,115,22,0.5)' },
  { glow: 'linear-gradient(135deg, #14b8a6, #2563eb)', border: 'rgba(20,184,166,0.5)' },
  { glow: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', border: 'rgba(244,63,94,0.5)' },
];

const getGradient = (slug, index = 0) =>
  gradientConfig[slug] || cyclicGradients[index % cyclicGradients.length];

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}

function CategoriesContent() {
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
    <main className={spaceGrotesk.className} style={styles.page}>
      {/* ── Scanline overlay ── */}
      <div className="scanline" />

      {/* ── Background orbs ── */}
      <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -160, left: -80 }} />
      <div className="orb" style={{ background: '#4F46E5', width: 700, height: 700, bottom: -160, right: -80 }} />
      <div className="orb" style={{ background: '#934CF0', width: 400, height: 400, top: '50%', left: '33%', transform: 'translate(-50%,-50%)', opacity: 0.1 }} />

      {/* Toggle – EXACT original position */}
      <div style={styles.toggleWrapper}>
        <button
          onClick={() => setMode(isPersonality ? 'academic' : 'personality')}
          style={{
            ...styles.toggleButton,
            background: isPersonality
              ? 'linear-gradient(to right, #934CF0, #4338CA)'
              : 'rgba(147, 76, 240, 0.12)',
            border: isPersonality ? 'none' : '1px solid #934CF0',
            color: isPersonality ? '#fff' : '#934CF0',
          }}
        >
          {isPersonality ? 'Switch to Academics' : 'Switch to Personality'}
        </button>
      </div>

      {/* Search – EXACT original size/position */}
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
          className="glass-input"
          style={styles.searchInput}
        />
      </div>

      {/* Title – EXACT original size */}
      <h2 style={styles.title}>
        Select a <span style={{ color: '#934CF0' }}>{isPersonality ? 'Category' : 'Subject'}</span>
      </h2>

      {/* Content – EXACT original structure */}
      <div style={styles.content}>
        {isPersonality ? (
          <div style={styles.grid}>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((item, index) => {
                const g = getGradient(item.slug, index);
                return (
                  <Link href={`/micro-learning/category/${item.slug}`} key={item.slug} style={{ textDecoration: 'none' }}>
                    <div className="glass-card group" style={{ ...styles.card, '--card-border-color': g.border }}>
                      <div className="icon-container" style={{ margin: '0 auto 18px auto' }}>
                        <div className="icon-glow" style={{ background: g.glow }} />
                        <span className="icon-symbol" style={styles.icon}>{item.icon}</span>
                      </div>
                      <h3 style={styles.name}>{item.name}</h3>
                      <p style={styles.desc}>{item.description}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              searchQuery && (
                <p style={styles.noResults}>
                  No categories match &quot;{searchQuery}&quot;
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
                  {section.items.map((item, index) => {
                    const g = getGradient(item.slug, index);
                    return (
                      <Link
                        href={`/micro-learning/category/${item.slug}?mode=academic`}
                        key={item.slug}
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="glass-card group" style={{ ...styles.card, '--card-border-color': g.border }}>
                          <div className="icon-container" style={{ margin: '0 auto 18px auto' }}>
                            <div className="icon-glow" style={{ background: g.glow }} />
                            <span className="icon-symbol" style={styles.icon}>{item.icon}</span>
                          </div>
                          <h3 style={styles.name}>{item.name}</h3>
                          <p style={styles.desc}>{item.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            searchQuery && (
              <p style={styles.noResults}>
                No subjects or fields match &quot;{searchQuery}&quot;
              </p>
            )
          )
        )}
      </div>
    </main>
  );
}

/*
 * ═══════════════════════════════════════════════════════════════
 * STYLES — EXACT same sizes, alignment, margins, padding as
 * the original page.jsx. Only visual "skin" values changed
 * (background, border, color, shadow) to match the glass theme.
 * ═══════════════════════════════════════════════════════════════
 */
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
    background: '#181022',               // ← upgraded from #050505
    overflow: 'hidden',
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
    boxShadow: '0 4px 20px rgba(147,76,240,0.25)',   // ← upgraded glow
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
    border: '1px solid rgba(147,76,240,0.2)',         // ← upgraded border
    background: 'rgba(255,255,255,0.04)',              // ← glass bg
    backdropFilter: 'blur(12px)',
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
    color: '#934CF0',                                  // ← upgraded to match theme
    marginBottom: '12px',
  },
  sectionDesc: {
    color: '#aaa',
    fontSize: '1.05rem',
    marginBottom: '28px',
    lineHeight: '1.5',
  },
  card: {
    padding: '36px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',                              // ← KEPT centered
    height: '100%',
    // glass-card CSS class handles: background, border, backdrop-filter, hover effects
  },
  icon: {
    fontSize: '3.8rem',
    lineHeight: 1,
  },
  name: {
    fontSize: '1.5rem',
    color: '#fff',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',                               // ← KEPT centered
  },
  desc: {
    color: '#bbb',
    fontSize: '0.95rem',
    lineHeight: '1.45',
    textAlign: 'center',                               // ← KEPT centered
  },
  noResults: {
    color: '#888',
    fontSize: '1.25rem',
    marginTop: '60px',
    textAlign: 'center',
    padding: '20px',
  },
};
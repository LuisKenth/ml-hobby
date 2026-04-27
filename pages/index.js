import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.container}>
      {/* Main Hero Content */}
      <main style={styles.hero}>
        <div style={styles.badge}>v1.0 is now live 🚀</div>
        <h1 style={styles.title}>
          Master Machine Learning <br />
          <span style={styles.gradientText}>with Simplicity.</span>
        </h1>
        <p style={styles.subtitle}>
          The all-in-one platform to build, train, and deploy your models. 
          Experience the power of AI with a modern, integrated workflow.
        </p>

        <div style={styles.ctaGroup}>
          <Link href="/auth">
            <button 
              style={styles.primaryBtn}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              Get Started for Free
            </button>
          </Link>
          <button style={styles.secondaryBtn}>View Documentation</button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    overflowX: 'hidden'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 80px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  logo: { fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  navLink: { textDecoration: 'none', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' },
  navLinkPrimary: { textDecoration: 'none', color: '#fff', backgroundColor: '#0f172a', padding: '8px 18px', borderRadius: '10px', fontWeight: '600', fontSize: '0.9rem' },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '160px',
    paddingBottom: '100px',
    textAlign: 'center',
    animation: 'fadeIn 1s ease-out'
  },
  badge: {
    backgroundColor: '#f1f5f9',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: '20px'
  },
  title: {
    fontSize: '4.2rem',
    fontWeight: '900',
    lineHeight: '1.1',
    color: '#0f172a',
    marginBottom: '25px',
    letterSpacing: '-2px'
  },
  gradientText: {
    background: 'linear-gradient(90deg, #3b82f6, #2dd4bf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    maxWidth: '650px',
    lineHeight: '1.6',
    marginBottom: '40px'
  },
  ctaGroup: { display: 'flex', gap: '15px' },
  primaryBtn: {
    padding: '16px 32px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s'
  },
  secondaryBtn: {
    padding: '16px 32px',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    color: '#1e293b',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  previewBox: {
    marginTop: '80px',
    width: '80%',
    maxWidth: '900px',
    height: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden'
  },
  browserHeader: {
    height: '40px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    gap: '8px',
    borderBottom: '1px solid #f1f5f9'
  },
  dot: { width: '10px', height: '100%', borderRadius: '50%', height: '10px' },
  mockContent: { padding: '30px', textAlign: 'left' },
  skeletonLine: { height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '15px', width: '100%' },
  skeletonGrid: { display: 'flex', gap: '20px', marginTop: '30px' },
  skeletonItem: { flex: 1, height: '150px', backgroundColor: '#f8fafc', borderRadius: '12px' },
  footer: { padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }
};
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    const { error } = view === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      if (view === "login") router.push("/dashboard");
      else alert("Check your email!");
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      {/* Top Navbar Style Logo */}
      <div style={styles.topNav}>
        <div style={styles.logo}>⬢ ML Hub</div>
      </div>

      <div style={styles.card}>
        {/* Decorative Icon */}
        <div style={styles.iconCircle}>
          <span style={{ fontSize: '20px', color: '#3b82f6' }}>➜</span>
        </div>

        <h2 style={styles.title}>
          {view === "login" ? "Sign in with email" : "Create your account"}
        </h2>
        <p style={styles.subtitle}>
          Enter your details below to access your machine learning dashboard.
        </p>

        <div style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}></span>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <span 
                style={styles.eyeIcon} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {view === "login" && <div style={styles.forgotPass}>Forgot password?</div>}

          <button 
            onClick={handleAuth} 
            disabled={loading}
            style={styles.mainBtn}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            {loading ? 'Processing...' : (view === "login" ? "Get Started" : "Sign Up")}
          </button>
        </div>

        <div style={styles.divider}>
            <div style={styles.line}></div>
            <span style={styles.dividerText}>Or continue with</span>
            <div style={styles.line}></div>
        </div>

        {/* Toggle between Login/Signup */}
        <p style={styles.toggleText}>
          {view === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.toggleLink} onClick={() => setView(view === "login" ? "signup" : "login")}>
            {view === "login" ? "Register here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC', // Same as Dashboard background
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
  },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1e293b'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9'
  },
  iconCircle: {
    width: '50px',
    height: '50px',
    backgroundColor: '#eff6ff', // Light blue
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: { fontSize: '24px', fontWeight: '800', margin: '0 0 10px', color: '#0f172a' },
  subtitle: { fontSize: '14px', color: '#64748b', lineHeight: '1.5', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#475569' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '15px', color: '#94a3b8' },
  input: {
    width: '100%',
    padding: '12px 15px 12px 42px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: '0.2s ease',
    boxSizing: 'border-box'
  },
  eyeIcon: { 
    position: 'absolute', 
    right: '15px', 
    cursor: 'pointer', 
    fontSize: '12px', 
    fontWeight: '700',
    color: '#3b82f6' 
  },
  forgotPass: { textAlign: 'right', fontSize: '12px', color: '#3b82f6', fontWeight: '600', cursor: 'pointer' },
  mainBtn: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#3b82f6', // Matching Blue from Dashboard
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    transition: '0.2s ease'
  },
  divider: { 
    display: 'flex', 
    alignItems: 'center', 
    margin: '30px 0', 
    gap: '10px' 
  },
  line: { flex: 1, height: '1px', backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: '12px', color: '#94a3b8' },
  toggleText: { marginTop: '20px', fontSize: '13px', color: '#64748b' },
  toggleLink: { color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' }
};
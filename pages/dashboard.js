import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [articles, setArticles] = useState([]);
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        fetchArticles(data.user.id);
      }
    };
    checkUser();
    if (typeof window !== "undefined") setBaseUrl(window.location.origin);
  }, []);

  const fetchArticles = async (userId) => {
    const activeUserId = userId || user?.id;
    if (!activeUserId) return;
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("user_id", activeUserId)
      .order("likes", { ascending: false }); // Priority ang may madamo likes
    setArticles(data || []);
  };

  const updateLikes = async (id, currentLikes) => {
    const { error } = await supabase
      .from("articles")
      .update({ likes: currentLikes + 1 })
      .eq("id", id);
    if (!error) fetchArticles(user.id);
  };

  const importFromUrl = async () => {
    if (!importUrl) return alert("Paste a link first!");
    setIsImporting(true);
    let cleanUrl = importUrl.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");
      const scrapedTitle = doc.querySelector("title")?.innerText || "Untitled Article";
      let scrapedContent = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "Shared via link.";
      setTitle(scrapedTitle.trim());
      setContent(scrapedContent.trim());
      setSourceUrl(cleanUrl);
      setImportUrl("");
    } catch (e) {
      setSourceUrl(cleanUrl);
      setTitle("Linked Resource");
      setContent("Content restricted but link attached.");
    } finally { setIsImporting(false); }
  };

  const createArticle = async () => {
    if (!title || !content) return alert("Fill in the blanks!");
    const { error } = await supabase.from("articles").insert([
      { title, content, user_id: user?.id, likes: 0, source_url: sourceUrl },
    ]);
    if (!error) { setTitle(""); setContent(""); setSourceUrl(""); fetchArticles(user.id); }
  };

  return (
    <div style={styles.pageWrapper}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>✦ ML <span style={{ color: "#6366f1" }}>HUB</span></div>
        <div style={styles.navUser}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/auth'))} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.mainLayout}>
        <aside style={styles.sidebar}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>New Publication</h3>
            <div style={styles.importGroup}>
              <input style={styles.importInput} placeholder="Paste link..." value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />
              <button onClick={importFromUrl} style={styles.importBtn}>{isImporting ? "..." : "Fetch"}</button>
            </div>
            <div style={styles.divider} />
            <input style={styles.inputTitle} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Write something..." value={content} onChange={(e) => setContent(e.target.value)} />
            {sourceUrl && <div style={styles.sourceTag}>🔗 Source Attached</div>}
            <button onClick={createArticle} style={styles.primaryBtn}>Publish</button>
          </div>
        </aside>

        <main style={styles.feedSection}>
          <h2 style={styles.sectionTitle}>My Workspace</h2>
          {articles.map((a) => (
            <div key={a.id} style={styles.articleCard}>
              <div style={styles.cardBody}>
                <h3 style={styles.articleTitle}>{a.title}</h3>
                <p style={styles.articleContent}>{a.content}</p>
                <div style={styles.cardFooter}>
                  <div style={styles.footerLeft}>
                    {a.source_url && <a href={a.source_url} target="_blank" rel="noreferrer" style={styles.sourceLink}>Original Source</a>}
                    <button onClick={() => { navigator.clipboard.writeText(`${baseUrl}/article/${a.id}`); alert("Link Copied!"); }} style={styles.actionBtn}>Share</button>
                  </div>
                  <button onClick={() => updateLikes(a.id, a.likes)} style={styles.heartBtn}>
                    ❤️ {a.likes}
                  </button>
                </div>
              </div>
              {/* --- COMMENTS SECTION --- */}
              <CommentSection articleId={a.id} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR COMMENTS & REPLIES ---

function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => { fetchComments(); }, []);

  const fetchComments = async () => {
    const { data } = await supabase.from("comments").select("*").eq("article_id", articleId).order("created_at", { ascending: true });
    setComments(data || []);
  };

  const addComment = async () => {
    if (!text) return;
    await supabase.from("comments").insert([{ article_id: articleId, text }]);
    setText(""); fetchComments();
  };

  return (
    <div style={styles.commentBox}>
      <div style={styles.commentInputRow}>
        <input style={styles.miniInput} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." />
        <button onClick={addComment} style={styles.miniBtn}>Post</button>
      </div>
      {comments.map((c) => <ReplySection key={c.id} comment={c} />)}
    </div>
  );
}

function ReplySection({ comment }) {
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => { fetchReplies(); }, []);

  const fetchReplies = async () => {
    const { data } = await supabase.from("replies").select("*").eq("comment_id", comment.id).order("created_at", { ascending: true });
    setReplies(data || []);
  };

  const addReply = async () => {
    if (!text) return;
    await supabase.from("replies").insert([{ comment_id: comment.id, text }]);
    setText(""); setShowInput(false); fetchReplies();
  };

  return (
    <div style={styles.replyContainer}>
      <div style={styles.mainComment}>
        <p style={styles.commentText}>{comment.text}</p>
        <button onClick={() => setShowInput(!showInput)} style={styles.replyLink}>Reply</button>
      </div>
      
      {replies.map((r) => (
        <div key={r.id} style={styles.replyItem}>
          <span style={styles.replyArrow}>↳</span> {r.text}
        </div>
      ))}

      {showInput && (
        <div style={styles.replyInputArea}>
          <input style={styles.miniInput} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply..." />
          <button onClick={addReply} style={styles.replyBtn}>Reply</button>
        </div>
      )}
    </div>
  );
}

// --- PROFESSIONAL STYLES ---
const styles = {
  pageWrapper: { minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif", color: "#1e293b" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", height: "64px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontWeight: "800", fontSize: "1.2rem" },
  navUser: { display: "flex", alignItems: "center", gap: "15px" },
  userEmail: { fontSize: "0.8rem", color: "#64748b" },
  logoutBtn: { padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: "0.75rem" },
  
  mainLayout: { display: "grid", gridTemplateColumns: "320px 1fr", gap: "30px", maxWidth: "1100px", margin: "30px auto", padding: "0 20px" },
  sidebar: { position: "sticky", top: "90px", height: "fit-content" },
  card: { background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  cardTitle: { marginTop: 0, fontSize: "1rem", fontWeight: "700" },
  
  importGroup: { display: "flex", gap: "8px", marginBottom: "15px" },
  importInput: { flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.8rem" },
  importBtn: { background: "#0f172a", color: "#fff", border: "none", borderRadius: "6px", padding: "0 12px", cursor: "pointer", fontWeight: "600" },
  
  divider: { height: "1px", background: "#f1f5f9", margin: "15px 0" },
  inputTitle: { width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #f1f5f9", outline: "none", fontWeight: "700", marginBottom: "10px" },
  textarea: { width: "100%", minHeight: "100px", border: "none", outline: "none", fontSize: "0.9rem", resize: "none", color: "#475569" },
  sourceTag: { fontSize: "0.7rem", color: "#6366f1", background: "#eef2ff", padding: "4px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "10px" },
  primaryBtn: { width: "100%", padding: "12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },

  feedSection: { display: "flex", flexDirection: "column", gap: "20px" },
  sectionTitle: { fontSize: "1.4rem", fontWeight: "800", margin: "0 0 10px 0" },
  articleCard: { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" },
  cardBody: { padding: "24px" },
  articleTitle: { margin: "0 0 10px 0", fontSize: "1.2rem", fontWeight: "700" },
  articleContent: { fontSize: "0.95rem", color: "#475569", lineHeight: "1.6" },
  
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #f1f5f9" },
  footerLeft: { display: "flex", gap: "15px" },
  sourceLink: { color: "#6366f1", fontSize: "0.8rem", fontWeight: "700", textDecoration: "none" },
  actionBtn: { background: "none", border: "none", color: "#94a3b8", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" },
  heartBtn: { background: "#fff1f2", border: "1px solid #fecdd3", color: "#e11d48", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" },

  commentBox: { background: "#f8fafc", padding: "20px 24px", borderTop: "1px solid #e2e8f0" },
  commentInputRow: { display: "flex", gap: "10px", marginBottom: "15px" },
  miniInput: { flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.8rem", background: "#fff" },
  miniBtn: { background: "#6366f1", color: "#fff", border: "none", padding: "0 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600" },
  
  replyContainer: { marginBottom: "15px", paddingLeft: "10px", borderLeft: "2px solid #e2e8f0" },
  commentText: { fontSize: "0.85rem", margin: "0 0 4px 0", fontWeight: "500" },
  replyLink: { background: "none", border: "none", color: "#94a3b8", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer", padding: 0 },
  replyItem: { fontSize: "0.8rem", color: "#64748b", margin: "6px 0 0 15px" },
  replyArrow: { color: "#cbd5e1", marginRight: "5px" },
  replyInputArea: { display: "flex", gap: "8px", marginTop: "10px", marginLeft: "15px" },
  replyBtn: { background: "#0f172a", color: "#fff", border: "none", padding: "0 10px", borderRadius: "6px", fontSize: "0.7rem" }
};
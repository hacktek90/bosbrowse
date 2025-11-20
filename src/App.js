import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ExternalLink,
  ChevronRight,
  Layers,
  Grid,
  Monitor,
  Menu,
  X,
} from "lucide-react";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyAp9kCBsDLnQEmR7wWHXwt3FB2T1zDtiqU",
  authDomain: "h-90-8a7c5.firebaseapp.com",
  databaseURL: "https://h-90-8a7c5-default-rtdb.firebaseio.com",
  projectId: "h-90-8a7c5",
  storageBucket: "h-90-8a7c5.firebasestorage.app",
  messagingSenderId: "367196609301",
  appId: "1:367196609301:web:156e24c1b4532c26af671c",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const PortfolioShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState("HOME");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = ref(db, "sites");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]) => ({
            id,
            ...val,
            timestamp: val.timestamp || 0,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setProjects(list);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const handleProjectClick = (project) => {
    setActiveProject(project);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // Helper for screenshot URLs
  const getScreenshotUrl = (url) =>
    `https://api.microlink.io/?url=${encodeURIComponent(
      url
    )}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <div className="app-container">
      <style>{`
        :root {
          --sidebar-bg: #0a0a0a; /* Deep black for sidebar */
          --main-bg: #111111;     /* Slightly lighter black for content */
          --card-bg: #1a1a1a;
          --accent: #00f3ff;      /* Neon cyan accent from BlackICE */
          --text-main: #ffffff;
          --text-muted: #888888;
          --border: #222222;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--main-bg);
          color: var(--text-main);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
        }

        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        /* --- Sidebar --- */
        .sidebar {
          width: 280px;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid var(--border);
        }

        .search-container {
          position: relative;
        }
        
        .search-input {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #333;
          color: white;
          padding: 10px 10px 10px 36px;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--accent); }
        .search-icon { position: absolute; left: 10px; top: 11px; color: #555; width: 16px; }

        .nav-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px 12px;
        }

        .nav-group-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #444;
          margin: 0 12px 10px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          margin-bottom: 4px;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(0, 243, 255, 0.1);
          border-color: rgba(0, 243, 255, 0.2);
          color: var(--accent);
        }

        .project-thumb {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          object-fit: cover;
          background: #222;
          border: 1px solid #333;
        }

        /* --- Main Content --- */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          background: var(--main-bg);
          overflow: hidden;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

        /* --- Home Screen (Landing Page Style) --- */
        .home-view {
          padding: 60px;
          overflow-y: auto;
          height: 100%;
          background: radial-gradient(circle at 50% 0%, #1a1a2e 0%, #111 60%);
        }

        .hero-section {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
        }

        .hero-badge {
          display: inline-block;
          padding: 6px 12px;
          border: 1px solid var(--accent);
          color: var(--accent);
          border-radius: 20px;
          font-size: 0.8rem;
          margin-bottom: 24px;
          background: rgba(0, 243, 255, 0.05);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.1;
          background: linear-gradient(180deg, #fff, #888);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-text {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .grid-showcase {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .showcase-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          group: hover;
        }

        .showcase-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow: 0 10px 40px rgba(0, 243, 255, 0.1);
        }

        .card-image {
          height: 200px;
          width: 100%;
          background: #222;
          position: relative;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
          opacity: 0.8;
        }

        .showcase-card:hover .card-image img {
          transform: scale(1.05);
          opacity: 1;
        }

        .card-info {
          padding: 20px;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .card-desc {
          font-size: 0.9rem;
          color: #777;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* --- Iframe View --- */
        .iframe-container {
          width: 100%;
          height: 100%;
          position: relative;
          background: white;
        }

        .top-nav {
          height: 50px;
          background: #000;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 15px;
        }

        .back-btn {
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          opacity: 0.7;
        }
        .back-btn:hover { opacity: 1; }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            position: absolute;
            height: 100%;
            transform: translateX(-100%);
          }
          .sidebar.open { transform: translateX(0); }
          .hero-title { font-size: 2.5rem; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Find a project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-scroll">
          <div className="nav-group-label">Navigation</div>
          <button
            className={`nav-item ${activeProject === "HOME" ? "active" : ""}`}
            onClick={() => setActiveProject("HOME")}
          >
            <Grid size={18} />
            <span>Discovery</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              handleProjectClick({
                id: "submit",
                title: "Submit New",
                url: "https://black-ice-3dbk.onrender.com/elegant-store.html",
              })
            }
          >
            <Plus size={18} />
            <span>Submit Project</span>
          </button>

          <div className="nav-group-label" style={{ marginTop: "30px" }}>
            Projects
          </div>
          {loading ? (
            <div style={{ padding: "12px", color: "#444" }}>Loading...</div>
          ) : (
            filteredProjects.map((p) => (
              <button
                key={p.id}
                className={`nav-item ${
                  activeProject.id === p.id ? "active" : ""
                }`}
                onClick={() => handleProjectClick(p)}
              >
                <img
                  src={getScreenshotUrl(p.url)}
                  alt=""
                  className="project-thumb"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/24/333/000")
                  }
                />
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.title || "Untitled"}
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile Toggle */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 100,
              background: "rgba(0,0,0,0.5)",
              border: "none",
              color: "white",
              padding: "8px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <Menu size={24} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {activeProject === "HOME" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="home-view"
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <div className="hero-section">
                <span className="hero-badge">COMMUNITY SHOWCASE</span>
                <h1 className="hero-title">
                  Explore the Next
                  <br />
                  Generation of Web
                </h1>
                <p className="hero-text">
                  Discover innovative projects, tools, and experiments built by
                  our global community. Click on any card to launch the
                  application instantly.
                </p>
              </div>

              <div className="grid-showcase">
                {filteredProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="showcase-card"
                    onClick={() => handleProjectClick(p)}
                  >
                    <div className="card-image">
                      <img
                        src={getScreenshotUrl(p.url)}
                        alt={p.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="card-info">
                      <h3 className="card-title">{p.title}</h3>
                      <p className="card-desc">
                        {p.description || "No description available."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="project"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="iframe-container"
            >
              <div className="top-nav">
                <button
                  className="back-btn"
                  onClick={() => setActiveProject("HOME")}
                >
                  <ChevronRight
                    size={16}
                    style={{ transform: "rotate(180deg)" }}
                  />
                  Back to Discovery
                </button>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>|</span>
                <span style={{ color: "white", fontWeight: 500 }}>
                  {activeProject.title}
                </span>

                <div style={{ marginLeft: "auto" }}>
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#aaa",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      textDecoration: "none",
                      fontSize: "0.8rem",
                    }}
                  >
                    Open External <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <iframe
                src={activeProject.url}
                style={{
                  width: "100%",
                  height: "calc(100% - 50px)",
                  border: "none",
                }}
                title={activeProject.title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PortfolioShowcase;

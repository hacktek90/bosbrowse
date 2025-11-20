import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  Search,
  Plus,
  Star,
  Home,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

// --- Firebase Config (Keep your existing config) ---
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

const BlackIceShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [activeUrl, setActiveUrl] = useState(
    "https://black-ice-3dbk.onrender.com"
  );
  const [activeTitle, setActiveTitle] = useState("Home");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Default to open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [loading, setLoading] = useState(true);

  // Load Favorites
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("bi_favorites") || "[]");
    setFavorites(savedFavs);
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle Favorite
  const toggleFavorite = (e, projectId) => {
    e.stopPropagation();
    let newFavs;
    if (favorites.includes(projectId)) {
      newFavs = favorites.filter((id) => id !== projectId);
    } else {
      newFavs = [...favorites, projectId];
    }
    setFavorites(newFavs);
    localStorage.setItem("bi_favorites", JSON.stringify(newFavs));
  };

  // Fetch Projects
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

  const getScreenshotUrl = (url) =>
    `https://api.microlink.io/?url=${encodeURIComponent(
      url
    )}&screenshot=true&meta=false&embed=screenshot.url`;

  const handleProjectSelect = (url, title) => {
    setActiveUrl(url);
    setActiveTitle(title);
    // Close sidebar only on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-container">
      <style>{`
        :root {
          --sidebar-bg: #09090b;
          --main-bg: #000000;
          --accent: #00f3ff;
          --text-primary: #ffffff;
          --text-muted: #a1a1aa;
          --border: #27272a;
          --hover-bg: #18181b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--main-bg);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          position: relative;
        }

        /* --- Sidebar --- */
        .sidebar {
          width: 320px;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          height: 100%;
          position: relative; /* Changed from absolute on mobile usually */
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        /* Header row for mobile close button */
        .sidebar-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sidebar-title {
          font-weight: 700;
          font-size: 1rem;
          color: white;
        }

        .close-sidebar-btn {
          background: none;
          border: none;
          color: #71717a;
          cursor: pointer;
          display: none; /* Hidden on desktop */
        }

        .search-wrapper { position: relative; }

        .search-input {
          width: 100%;
          background: #18181b;
          border: 1px solid #3f3f46;
          color: white;
          padding: 10px 10px 10px 36px;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus { border-color: var(--accent); background: #000; }
        .search-icon { position: absolute; left: 10px; top: 11px; color: #71717a; width: 16px; }

        .nav-list {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .section-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #52525b;
          margin: 20px 0 10px;
          font-weight: 700;
        }

        .project-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
          position: relative;
          width: 100%;
          text-align: left;
        }

        .project-card:hover {
          background: var(--hover-bg);
          border-color: #3f3f46;
        }

        .project-card.active {
          background: #18181b;
          border-color: var(--accent);
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.05);
        }

        .card-thumb-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #333;
          background: #000;
          flex-shrink: 0;
        }

        .card-thumb { width: 100%; height: 100%; object-fit: cover; }

        .card-info { flex: 1; overflow: hidden; }

        .card-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: #e4e4e7;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }

        .card-url {
          font-size: 0.75rem;
          color: #71717a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fav-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          opacity: 0;
          transition: opacity 0.2s;
          color: #71717a;
        }
        .project-card:hover .fav-btn, .fav-btn.active { opacity: 1; }
        .fav-btn.active { color: #eab308; fill: #eab308; }

        /* --- Main Content --- */
        .main-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          background: #000;
          width: 100%;
        }

        .top-bar {
          height: 50px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 20px;
          background: var(--sidebar-bg);
          justify-content: space-between;
        }

        .nav-toggle {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px;
          margin-right: 15px;
        }

        .page-title {
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .external-link {
          color: #71717a;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          padding: 6px 12px;
          border-radius: 4px;
          background: #18181b;
        }
        .external-link:hover { color: white; background: #27272a; }

        .iframe-wrapper {
          flex: 1;
          position: relative;
          background: #000;
        }

        .web-frame { width: 100%; height: 100%; border: none; }

        /* --- Overlay for Mobile --- */
        .mobile-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          z-index: 90;
          display: none;
        }

        /* --- Responsive Logic --- */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
            box-shadow: 10px 0 30px rgba(0,0,0,0.5);
          }

          .mobile-overlay.open {
            display: block;
          }

          .close-sidebar-btn {
            display: block;
          }
          
          .nav-toggle {
            display: block; /* Show menu hamburger on mobile */
          }
        }

        @media (min-width: 769px) {
          .sidebar.closed {
            margin-left: -320px; /* Hide sidebar on desktop by negative margin */
          }
          .sidebar {
            position: relative; /* Static flow on desktop */
            transform: none;
          }
          .nav-toggle {
            /* Optional: hide hamburger on desktop if you want permanent sidebar */
            /* display: none; */ 
          }
        }
      `}</style>

      {/* Mobile Overlay - Click to close */}
      <div
        className={`mobile-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-top-row">
            <div className="sidebar-title">BlackICE Browser</div>
            <button
              className="close-sidebar-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="project-card"
            style={{
              width: "100%",
              marginBottom: 0,
              background: "#00f3ff10",
              borderColor: "#00f3ff30",
            }}
            onClick={() =>
              handleProjectSelect(
                "https://black-ice-3dbk.onrender.com/elegant-store.html",
                "Submit Project"
              )
            }
          >
            <div
              className="card-thumb-wrapper"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--accent)",
              }}
            >
              <Plus color="black" size={24} />
            </div>
            <div className="card-info">
              <div className="card-title" style={{ color: "var(--accent)" }}>
                Submit Project
              </div>
              <div className="card-url">Join the showcase</div>
            </div>
          </button>
        </div>

        <div className="nav-list">
          {/* Home Button */}
          <div
            className={`project-card ${
              activeUrl === "https://black-ice-3dbk.onrender.com"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleProjectSelect(
                "https://black-ice-3dbk.onrender.com",
                "BlackICE Academy"
              )
            }
          >
            <div
              className="card-thumb-wrapper"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#222",
              }}
            >
              <Home color="white" size={20} />
            </div>
            <div className="card-info">
              <div className="card-title">Home</div>
              <div className="card-url">BlackICE Portal</div>
            </div>
          </div>

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <>
              <div className="section-label">Favorites</div>
              {projects
                .filter((p) => favorites.includes(p.id))
                .map((p) => (
                  <div
                    key={`fav-${p.id}`}
                    className={`project-card ${
                      activeUrl === p.url ? "active" : ""
                    }`}
                    onClick={() => handleProjectSelect(p.url, p.title)}
                  >
                    <div className="card-thumb-wrapper">
                      <img
                        src={getScreenshotUrl(p.url)}
                        className="card-thumb"
                        loading="lazy"
                        alt=""
                      />
                    </div>
                    <div className="card-info">
                      <div className="card-title">{p.title}</div>
                      <div className="card-url">{new URL(p.url).hostname}</div>
                    </div>
                    <button
                      className="fav-btn active"
                      onClick={(e) => toggleFavorite(e, p.id)}
                    >
                      <Star size={16} fill="#eab308" />
                    </button>
                  </div>
                ))}
            </>
          )}

          <div className="section-label">
            All Projects ({filteredProjects.length})
          </div>

          {loading ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#555" }}
            >
              Loading...
            </div>
          ) : (
            filteredProjects.map((p) => (
              <div
                key={p.id}
                className={`project-card ${
                  activeUrl === p.url ? "active" : ""
                }`}
                onClick={() => handleProjectSelect(p.url, p.title)}
              >
                <div className="card-thumb-wrapper">
                  <img
                    src={getScreenshotUrl(p.url)}
                    className="card-thumb"
                    loading="lazy"
                    alt=""
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/50/333/666?text=?")
                    }
                  />
                </div>
                <div className="card-info">
                  <div className="card-title">{p.title || "Untitled"}</div>
                  <div className="card-url">{new URL(p.url).hostname}</div>
                </div>
                <button
                  className={`fav-btn ${
                    favorites.includes(p.id) ? "active" : ""
                  }`}
                  onClick={(e) => toggleFavorite(e, p.id)}
                >
                  <Star
                    size={16}
                    fill={favorites.includes(p.id) ? "#eab308" : "none"}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main View */}
      <main className="main-view">
        <header className="top-bar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className="nav-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="page-title">
              <span>Browser</span>
              <ChevronRight size={14} color="#555" />
              <span>{activeTitle}</span>
            </div>
          </div>

          <a
            href={activeUrl}
            target="_blank"
            rel="noreferrer"
            className="external-link"
          >
            <span>Open External</span>
            <ExternalLink size={14} />
          </a>
        </header>

        <div className="iframe-wrapper">
          <iframe
            src={activeUrl}
            className="web-frame"
            title="Content Browser"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
            allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write"
          />
        </div>
      </main>
    </div>
  );
};

export default BlackIceShowcase;

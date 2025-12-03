import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp9kCBsDLnQEmR7wWHXwt3FB2T1zDtiqU",
  authDomain: "h-90-8a7c5.firebaseapp.com",
  databaseURL: "https://h-90-8a7c5-default-rtdb.firebaseio.com",
  projectId: "h-90-8a7c5",
  storageBucket: "h-90-8a7c5.firebasestorage.app",
  messagingSenderId: "367196609301",
  appId: "1:367196609301:web:156e24c1b4532c26af671c",
};

const HOME_URL = "https://black-ice-3dbk.onrender.com/";
const STORE_URL = "https://black-ice-3dbk.onrender.com/elegant-store.html";

// ==================== STYLES ====================
const styles = `
:root{
  --topbar: 56px;
  --bg: #f7f8fb;
  --surface: #ffffff;
  --surface-2: #fafbff;
  --text: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --hover: #f3f4f6;
  --accent: #2563eb;
  --ring: 0 0 0 4px rgba(37,99,235,.18);
  --shadow-sm: 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 10px 24px rgba(0,0,0,.12);
  --radius: 14px;
  --sidebar-w: 300px;
  --rgb-gradient: linear-gradient(90deg, #ff0040, #ffd500, #00ff85, #00c3ff, #7a00ff, #ff00c8, #ff0040);
}
@keyframes shiftHue {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes spin { 
  to { transform: rotate(360deg); } 
}
@keyframes skeleton-loading {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; padding: 0; }
body{
  background:var(--bg);
  color:var(--text);
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial;
  line-height:1.45;
  overflow: hidden;
}
#root {
  height: 100%;
  width: 100%;
}
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar{
  height: var(--topbar);
  position: relative;
  z-index: 100;
  display:flex; 
  align-items:center; 
  gap:12px;
  padding:10px 16px;
  background:var(--surface);
  border-bottom:1px solid var(--border);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}
.icon-btn{
  width:40px; height:40px;
  border-radius:10px;
  background:var(--surface);
  border:1px solid var(--border);
  color:var(--text);
  font-size:20px;
  display:flex; 
  align-items:center; 
  justify-content:center;
  cursor:pointer; 
  transition:.2s;
  flex-shrink: 0;
}
.icon-btn:hover{ background:var(--hover); }
.icon-btn:focus-visible{ outline:none; box-shadow: var(--ring); }

#hideNavbar {
  position: relative;
  transition: all 0.3s ease;
}

.app.nav-hidden {
  --topbar: 0px;
}

.app.nav-hidden .topbar{
  height: 0;
  padding: 0; 
  border: 0; 
  box-shadow: none; 
  overflow: hidden;
  min-height: 0;
}

.app.nav-hidden #hideNavbar {
  position: fixed !important;
  top: 8px !important;
  right: 16px !important;
  z-index: 99999 !important;
  background: var(--surface) !important;
  box-shadow: var(--shadow-md) !important;
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  height: 40px !important;
  width: 40px !important;
}

.app.nav-hidden #hideNavbar svg {
  transform: rotate(180deg);
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
.brand{
  position: relative;
  font-weight:650;
  letter-spacing:.2px;
  padding: 6px 12px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: linear-gradient(var(--surface), var(--surface)) padding-box, var(--rgb-gradient) border-box;
  background-size: 100% 100%, 200% 200%;
  animation: shiftHue 6s linear infinite;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
}
.project-name-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  font-weight: 500;
  font-size: 0.9rem;
  max-width: 300px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-10px);
}
.project-name-display.visible {
  opacity: 1;
  transform: translateX(0);
}
.project-name-display .separator {
  color: var(--muted);
  font-weight: 400;
}
.project-name-display .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--accent);
}
.project-name-display .close-project {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  padding: 0;
  margin-left: auto;
}
.project-name-display .close-project:hover {
  background: var(--hover);
  color: var(--text);
}
.sidebar {
  position: fixed;
  top: var(--topbar);
  left: 0;
  bottom: 0;
  width: var(--sidebar-w);
  z-index: 120;
  background:var(--surface);
  border-right: 1px solid var(--border);
  padding: 16px;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform .3s ease;
  box-shadow: var(--shadow-md);
}
.sidebar.open{ transform: translateX(0); }
.side-hd{ font-weight:650; margin-bottom:8px; }
.side-hd-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  margin-bottom:8px;
}
.side-add-btn{
  width:34px; height:34px;
  border-radius:10px;
  background:var(--surface-2);
  border:1px solid var(--border);
  color:var(--text);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:.2s;
}
.side-add-btn:hover{ background:var(--hover); }
.side-search{ position:relative; margin-bottom:12px; }
.side-search input{
  width:100%; height:38px; padding:0 12px 0 40px;
  border:1px solid var(--border); border-radius:10px;
  background:var(--surface-2); color:var(--text);
}
.side-search input:focus{ outline:none; border-color:var(--accent); box-shadow: var(--ring); }
.side-search .icon{
  position:absolute; top:10px; left:12px; width:18px; height:18px; color:#6b7280;
  pointer-events:none;
}
.favorites-section {
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
}
.favorites-label {
  font-weight: 650;
  color: var(--muted);
  font-size: 0.85rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style:none;
  padding:0;
  margin:0;
}
.empty-favorites {
  color: var(--muted);
  font-size: 0.85rem;
  padding: 8px 0;
}
.list{ list-style:none; padding:0; margin:0; }
.item-row{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:8px;
}
.item button.project-btn{
  flex:1;
  display:flex; align-items:start; gap:10px;
  padding:10px 10px;
  border-radius:10px;
  background:transparent;
  color:var(--text);
  border:1px solid transparent;
  cursor:pointer; text-align:left;
  transition:.15s;
}
.item button.project-btn:hover{
  background:var(--hover); border-color:var(--border);
}
.item button.project-btn.active{
  background:var(--hover); border-color:var(--accent);
}
.copy-btn{
  font-size:.75rem;
  padding:4px 8px;
  border-radius:8px;
  border:1px solid var(--border);
  background:var(--surface-2);
  cursor:pointer;
  color:var(--muted);
  white-space:nowrap;
  margin-top:10px;
}
.copy-btn:hover{
  background:var(--hover);
  color:var(--text);
}
.favorite-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}
.favorite-btn:hover {
  background: var(--surface-2);
  color: #ffa500;
}
.favorite-btn.favorited {
  color: #ffa500;
}
.screenshot-preview {
  position: relative;
  display: inline-block;
}
.screenshot-thumb {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}
.screenshot-thumb:hover {
  border-color: var(--accent);
  transform: scale(1.05);
}
.screenshot-large {
  position: absolute;
  top: 0;
  left: 100%;
  z-index: 1000;
  width: 200px;
  height: 150px;
  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  background: #fff;
  object-fit: cover;
  display: none;
  margin-left: 10px;
  margin-top: -20px;
}
.screenshot-preview:hover .screenshot-large {
  display: block;
}
.title{ font-weight:600; line-height:1.25; }
.meta{ color:var(--muted); font-size:.85rem; }

main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.frame-wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:#fff;
}

iframe.portal{
  position:absolute; 
  inset:0;
  width:100%; 
  height:100%;
  border:0; 
  display:block; 
  background:#fff;
}
.frame-loader {
  position: absolute;
  inset: 0;
  background: rgba(255,255,254,0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.frame-loader::before {
  content: "";
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.skeleton {
  background: linear-gradient(90deg, #eeeeee 25%, #f5f5f5 37%, #eeeeee 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}
.skel-item { height: 48px; border-radius: 10px; margin-bottom: 10px; }
#restoreLastBtn{
  position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
  z-index: 140; display: none; padding: 8px 12px;
  border-radius: 999px; background-color: #111827; border: 1px solid #0b1220;
  color: #ffffff; box-shadow: var(--shadow-md); cursor: pointer;
  transition: background-color .15s ease, opacity .15s ease;
}
#restoreLastBtn.show{ display: inline-flex; align-items: center; gap: 6px; }
#restoreLastBtn:hover{ background-color: #0b1220; }
.settings-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.settings-dialog.open {
  opacity: 1;
  visibility: visible;
}
.settings-content {
  background: var(--surface);
  border-radius: var(--radius);
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: var(--shadow-md);
  position: relative;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}
.settings-dialog.open .settings-content {
  transform: translateY(0);
}
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.settings-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--muted);
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}
.close-btn:hover {
  background: var(--hover);
  color: var(--text);
}
.settings-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--border);
  padding-bottom: 0;
}
.tab-btn {
  background: none;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  color: var(--muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}
.tab-btn:hover {
  color: var(--text);
}
.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.tab-content {
  display: none;
}
.tab-content.active {
  display: block;
}
.settings-option {
  margin-bottom: 20px;
}
.settings-option label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.settings-option select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font-size: 1rem;
}
.save-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  transition: background 0.2s;
}
.save-btn:hover {
  background: #1d4ed8;
}
.os-link-section {
  margin: 16px 0;
  padding: 0;
}
.os-link-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
  cursor: pointer;
}
.os-link-btn:hover {
  background: var(--hover);
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
@media (max-width: 768px) {
  .project-name-display {
    max-width: 150px;
  }
  .brand {
    font-size: 0.9rem;
    padding: 5px 10px;
  }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// ==================== UTILITY FUNCTIONS ====================
const timeAgo = (timestamp) => {
  if (!timestamp) return "";
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const diff = timestamp - Date.now();
  const steps = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];
  for (const [unit, ms] of steps) {
    const val = Math.round(diff / ms);
    if (Math.abs(val) >= 1) return rtf.format(val, unit);
  }
  return rtf.format(0, "second");
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

// ==================== PROJECT ITEM COMPONENT ====================
function ProjectItem({
  site,
  isFavorited,
  isActive,
  onSelect,
  onToggleFavorite,
}) {
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
    site.url
  )}&screenshot=true&meta=false&embed=screenshot.url`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(site.url).then(() => {
      e.target.textContent = "Copied!";
      setTimeout(() => {
        e.target.textContent = "Copy";
      }, 900);
    });
  };

  return (
    <li className="item item-row">
      <button
        type="button"
        className={`project-btn ${isActive ? "active" : ""}`}
        onClick={onSelect}
      >
        <div className="screenshot-preview">
          <img
            className="screenshot-thumb"
            src={screenshotUrl}
            alt={`Preview of ${site.title}`}
            loading="lazy"
          />
          <img
            className="screenshot-large"
            src={screenshotUrl}
            alt={`Preview of ${site.title}`}
            loading="lazy"
          />
        </div>
        <div>
          <div className="title">{site.title}</div>
          {site.timestamp && (
            <div className="meta">{timeAgo(site.timestamp)}</div>
          )}
        </div>
      </button>

      <button className="copy-btn" onClick={handleCopy}>
        Copy
      </button>

      <button
        className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    </li>
  );
}

// ==================== MAIN APP COMPONENT ====================
function App() {
  const [app] = useState(() => initializeApp(firebaseConfig));
  const [database] = useState(() => getDatabase(app));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(HOME_URL);
  const [currentProjectTitle, setCurrentProjectTitle] = useState(null);
  const [showRestore, setShowRestore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSites, setAllSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [frameLoading, setFrameLoading] = useState(true);

  const [lastUrl, setLastUrl] = useLocalStorage("lastPortalUrl", "");
  const [lastProjectTitle, setLastProjectTitle] = useLocalStorage(
    "lastProjectTitle",
    ""
  );
  const [favorites, setFavorites] = useLocalStorage("favoriteProjects", []);
  const [customHomeScreen, setCustomHomeScreen] = useLocalStorage(
    "customHomeScreen",
    ""
  );
  const [selectedHome, setSelectedHome] = useState(customHomeScreen);

  const isOnline = useNetworkStatus();

  // Firebase listener
  useEffect(() => {
    const sitesRef = ref(database, "sites");
    const unsubscribe = onValue(sitesRef, (snapshot) => {
      const sites = snapshot.val();
      if (sites) {
        const sitesArray = Object.entries(sites)
          .map(([id, site]) => ({
            id,
            title: site.title || "Untitled",
            url: site.url || "#",
            timestamp: site.timestamp || 0,
            description: site.description || "",
          }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setAllSites(sitesArray);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [database]);

  useEffect(() => {
    if (customHomeScreen) {
      setCurrentUrl(customHomeScreen);
    }
  }, []);

  useEffect(() => {
    if (currentUrl !== HOME_URL && currentUrl) {
      setLastUrl(currentUrl);
      if (currentProjectTitle) {
        setLastProjectTitle(currentProjectTitle);
      }
    }
  }, [currentUrl, currentProjectTitle, setLastUrl, setLastProjectTitle]);

  useEffect(() => {
    if (lastUrl && currentUrl === HOME_URL) {
      setShowRestore(true);
      const timer = setTimeout(() => setShowRestore(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [currentUrl, lastUrl]);

  const filteredSites = useMemo(() => {
    if (!searchQuery) return allSites;
    const query = searchQuery.toLowerCase();
    return allSites.filter(
      (site) =>
        site.title.toLowerCase().includes(query) ||
        site.description.toLowerCase().includes(query)
    );
  }, [allSites, searchQuery]);

  const favoriteSites = useMemo(() => {
    return allSites.filter((site) => favorites.includes(site.id));
  }, [allSites, favorites]);

  const toggleFavorite = (siteId) => {
    setFavorites((prev) => {
      if (prev.includes(siteId)) {
        return prev.filter((id) => id !== siteId);
      }
      return [...prev, siteId];
    });
  };

  const handleProjectSelect = (url, title) => {
    setCurrentUrl(url);
    setCurrentProjectTitle(title);
    setSidebarOpen(false);
    setFrameLoading(true);
  };

  const handleCloseProject = () => {
    setCurrentUrl(HOME_URL);
    setCurrentProjectTitle(null);
  };

  const handleGoHome = () => {
    setCurrentUrl(HOME_URL);
    setCurrentProjectTitle(null);
  };

  const handleRestore = () => {
    setCurrentUrl(lastUrl);
    setCurrentProjectTitle(lastProjectTitle);
    setShowRestore(false);
  };

  const handleSaveSettings = () => {
    setCustomHomeScreen(selectedHome);
    setSettingsOpen(false);
  };

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <div className={`app ${navHidden ? "nav-hidden" : ""}`}>
      <header className="topbar">
        <button
          id="toggleSidebar"
          className="icon-btn"
          aria-label="Toggle project list"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="brand-container">
          <div className="brand" onClick={handleGoHome} title="Go Home">
            Home Screen
          </div>

          <div
            className={`project-name-display ${
              currentProjectTitle ? "visible" : ""
            }`}
          >
            <span className="separator">›</span>
            <span className="name">{currentProjectTitle}</span>
            <button
              className="close-project"
              onClick={handleCloseProject}
              title="Close project"
              aria-label="Close project"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <button
          className="icon-btn"
          aria-label="Settings"
          title="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            ircle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <button
          id="hideNavbar"
          className="icon-btn"
          aria-pressed={navHidden}
          title={navHidden ? "Show navbar" : "Hide navbar"}
          style={{ marginLeft: "auto" }}
          onClick={() => setNavHidden(!navHidden)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </header>

      {showRestore && (
        <button
          id="restoreLastBtn"
          type="button"
          className="show"
          onClick={handleRestore}
          aria-live="polite"
          title="Reload last site"
        >
          Reload last site
        </button>
      )}

      <nav
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        hidden={!sidebarOpen}
      >
        <div className="side-hd-row">
          <div className="side-hd">Free Tool Projects</div>
          <button
            className="side-add-btn"
            type="button"
            aria-label="Open Elegant Store"
            onClick={() => handleProjectSelect(STORE_URL, "Elegant Store")}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
          </button>
        </div>

        <div className="favorites-section">
          <div className="favorites-label">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Favorites
          </div>
          <ul className="favorites-list">
            {favoriteSites.length === 0 ? (
              <li className="empty-favorites">No favorites yet</li>
            ) : (
              favoriteSites.map((site) => (
                <ProjectItem
                  key={site.id}
                  site={site}
                  isFavorited={true}
                  isActive={currentUrl === site.url}
                  onSelect={() => handleProjectSelect(site.url, site.title)}
                  onToggleFavorite={() => toggleFavorite(site.id)}
                />
              ))
            )}
          </ul>
        </div>

        <div className="os-link-section">
          <a
            href="https://uios-eta.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="os-link-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            <span>OS</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginLeft: "auto" }}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        <div className="side-search">
          <svg className="icon" viewBox="0 0 24 24">
            ircle cx="11" cy="11" r="7" stroke="currentColor" fill="none" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" />
          </svg>
          <input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        <ul className="list">
          {loading ? (
            <div id="skeletonLoader">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton skel-item" />
              ))}
            </div>
          ) : filteredSites.length === 0 ? (
            <li className="item">
              <div>No matches</div>
            </li>
          ) : (
            filteredSites.map((site) => (
              <ProjectItem
                key={site.id}
                site={site}
                isFavorited={favorites.includes(site.id)}
                isActive={currentUrl === site.url}
                onSelect={() => handleProjectSelect(site.url, site.title)}
                onToggleFavorite={() => toggleFavorite(site.id)}
              />
            ))
          )}
        </ul>
      </nav>

      <main>
        <div className="frame-wrap">
          {!isOnline ? (
            <div
              style={{
                display: "block",
                textAlign: "center",
                padding: "25px",
                fontSize: "18px",
                color: "#b91c1c",
                background: "#fee2e2",
                border: "1px solid #fecaca",
              }}
            >
              ❌ No Internet Connection
            </div>
          ) : (
            <>
              {frameLoading && (
                <div
                  className="frame-loader"
                  style={{ display: "flex" }}
                  aria-live="polite"
                  aria-busy="true"
                />
              )}
              <iframe
                className="portal"
                src={currentUrl}
                allow="fullscreen; clipboard-read; clipboard-write; geolocation; microphone; camera"
                onLoad={() => setFrameLoading(false)}
                title={currentProjectTitle || "Main Content"}
              />
            </>
          )}
        </div>
      </main>

      {settingsOpen && (
        <div
          className={`settings-dialog ${settingsOpen ? "open" : ""}`}
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="settings-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="settings-header">
              <h2 className="settings-title">Settings & Dashboard</h2>
              <button
                className="close-btn"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                &times;
              </button>
            </div>

            <div className="settings-tabs">
              <button className="tab-btn active">Settings</button>
            </div>

            <div className="tab-content active">
              <div className="settings-option">
                <label htmlFor="homeScreenSelect">
                  Set Home Screen Project:
                </label>
                <select
                  id="homeScreenSelect"
                  value={selectedHome}
                  onChange={(e) => setSelectedHome(e.target.value)}
                >
                  <option value="">Default Home Screen</option>
                  {allSites.map((site) => (
                    <option key={site.id} value={site.url}>
                      {site.title}
                    </option>
                  ))}
                </select>
              </div>
              <button className="save-btn" onClick={handleSaveSettings}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

console.log(">>> APP JSX LIVE");

const API_URL =
  import.meta.env.VITE_API_URL || "https://v3k-backend-api.onrender.com";

const App = () => {
  const [signals, setSignals] = useState([]);
  const [filteredSignals, setFilteredSignals] = useState([]);
  const [indices, setIndices] = useState([]);
  const [news, setNews] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [alertsOn, setAlertsOn] = useState(true);
  const [strategyFilter, setStrategyFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [tfFilter, setTfFilter] = useState("ALL");
  const [cloudStatus, setCloudStatus] = useState("idle");
  const [chartSymbol, setChartSymbol] = useState(null);

  const fetchSignals = async () => {
    try {
      const res = await axios.get(`${API_URL}/signals`);
      setSignals(res.data);
    } catch (err) {
      console.error("Error fetching signals:", err);
    }
  };

  const fetchIndices = async () => {
    try {
      const res = await axios.get(`${API_URL}/indices`);
      setIndices(res.data);
    } catch (err) {
      console.error("Error fetching indices:", err);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_URL}/news`);
      setNews(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  const refreshAll = () => {
    fetchSignals();
    fetchIndices();
    fetchNews();
  };

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = signals;
    if (strategyFilter !== "ALL") {
      filtered = filtered.filter((s) => s.strategy === strategyFilter);
    }
    if (typeFilter !== "ALL") {
      filtered = filtered.filter((s) => s.type === typeFilter);
    }
    if (tfFilter !== "ALL") {
      filtered = filtered.filter((s) => s.timeframe === tfFilter);
    }
    setFilteredSignals(filtered);
  }, [signals, strategyFilter, typeFilter, tfFilter]);

  const handlePasscode = () => {
    if (passcode === "v3kpass") setAuthenticated(true);
  };

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleAlerts = () => setAlertsOn((prev) => !prev);

  const handleCloudSync = async () => {
    try {
      setCloudStatus("syncing");
      await axios.post(`${API_URL}/sync-cloud`, { signals });
      setCloudStatus("synced");
    } catch (e) {
      setCloudStatus("error");
    }
  };

  const openChart = (symbol) => setChartSymbol(symbol);
  const closeChart = () => setChartSymbol(null);

  // Animation on scroll
  useEffect(() => {
    const cards = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, [filteredSignals]);

  if (!authenticated) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Enter Passcode to Unlock</h2>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <button onClick={handlePasscode}>Unlock</button>
      </div>
    );
  }

  return (
    <div className={isDark ? "dark" : "light"} style={{ padding: 10, fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <h2>📈 V3kBot Pro</h2>
        <button onClick={refreshAll}>🔄 Refresh</button>
        <button onClick={toggleTheme}>🌓 Toggle Theme</button>
        <button onClick={toggleAlerts}>
          {alertsOn ? "🔔 Alerts On" : "🔕 Alerts Off"}
        </button>
        <button onClick={handleCloudSync}>
          ☁️ {cloudStatus === "syncing" ? "Syncing..." : "Sync Cloud"}
        </button>
      </header>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <select onChange={(e) => setStrategyFilter(e.target.value)}>
          <option value="ALL">All Strategies</option>
          <option value="MACD">MACD</option>
          <option value="Breakout">Breakout</option>
        </select>
        <select onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALL">All Types</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
        <select onChange={(e) => setTfFilter(e.target.value)}>
          <option value="ALL">All TF</option>
          <option value="5m">5m</option>
          <option value="15m">15m</option>
          <option value="1h">1h</option>
        </select>
      </div>

      <section style={{ marginTop: 20 }}>
        {filteredSignals.map((s, i) => (
          <div
            key={i}
            className="fade-in"
            onClick={() => openChart(s.symbol)}
            style={{
              padding: 12,
              marginBottom: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor:
                s.confidence > 80 ? "#d4f4dd" : s.confidence > 50 ? "#fff3cd" : "#f8d7da",
              opacity: 0,
              transform: "translateY(20px)",
              transition: "all 0.6s ease",
            }}
          >
            <b>{s.symbol}</b> – {s.strategy} ({s.timeframe}){" "}
            <span
              style={{
                padding: "2px 6px",
                borderRadius: 4,
                backgroundColor: s.type === "BUY" ? "#c8e6c9" : "#ffcdd2",
                fontSize: "0.75em",
                marginLeft: 8,
              }}
            >
              {s.type}
            </span>
            <div>Strength: {s.confidence}%</div>
            <div style={{ fontSize: "0.85em", color: "gray" }}>
              #{s.strategy.toLowerCase()} #{s.type.toLowerCase()}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 30 }}>
        <h3>📰 Market News Feed</h3>
        <ul>
          {news.map((n, i) => (
            <li key={i}>
              <a href={n.url} target="_blank" rel="noreferrer">
                {n.headline}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {chartSymbol && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            background: isDark ? "#111" : "#fff",
            zIndex: 9999,
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <button onClick={closeChart} style={{ float: "right" }}>
            ❌ Close
          </button>
          <iframe
            src={`https://www.tradingview.com/chart/?symbol=${chartSymbol}`}
            width="100%"
            height="90%"
            frameBorder="0"
            title="Chart"
          />
        </div>
      )}

      <style>
        {`
          .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        `}
      </style>
    </div>
  );
};

export default App;

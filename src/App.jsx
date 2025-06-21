// App.jsx – Updated with Always-Visible Filters

import React, { useState, useEffect } from "react";
import axios from "axios";

console.log(">>> APP JSX LIVE");

const API_URL =
  import.meta.env.VITE_API_URL || "https://v3k-backend-api.onrender.com";

const App = () => {
  const [signals, setSignals] = useState([]);
  const [filteredEquity, setFilteredEquity] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
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
      filtered = filtered.filter((s) => s.strategyTags?.includes(strategyFilter));
    }
    if (typeFilter !== "ALL") {
      filtered = filtered.filter((s) => s.type.toUpperCase() === typeFilter);
    }
    if (tfFilter !== "ALL") {
      filtered = filtered.filter((s) => s.timeframe === tfFilter);
    }
    const eq = filtered.filter((s) => s.type !== "option").sort((a, b) => b.strength - a.strength);
    const opt = filtered.filter((s) => s.type === "option").sort((a, b) => b.strength - a.strength);
    setFilteredEquity(eq);
    setFilteredOptions(opt);
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

  const renderTradingViewWidget = (symbol) => {
    const formatted = symbol.includes(".NS") ? symbol.replace(".NS", "") + "_NSE" : symbol;
    return (
      <iframe
        src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_f&symbol=${formatted}&interval=15&theme=dark&style=1`}
        width="100%"
        height="200"
        frameBorder="0"
        allowTransparency={true}
        scrolling="no"
        className="rounded-lg mt-2"
        title={`chart-${symbol}`}
      />
    );
  };

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

  const renderCard = (s, i) => (
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
          s.strength > 80 ? "#d4f4dd" : s.strength > 60 ? "#fff3cd" : "#f8d7da",
        boxShadow:
          s.strength > 80
            ? "0 0 10px #28a745"
            : s.strength > 60
            ? "0 0 8px #ffc107"
            : "0 0 6px #dc3545",
      }}
    >
      <b>{s.symbol}</b> – {s.strategyTags?.[0] || "Strategy"} ({s.timeframe})
      <div>Strength: {s.strength}%</div>
      <div style={{ fontSize: "0.85em", color: "gray" }}>
        #{s.strategyTags?.[0]?.toLowerCase()} #{s.type.toLowerCase()}
      </div>
      {renderTradingViewWidget(s.symbol)}
    </div>
  );

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

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", marginTop: 10, fontWeight: "bold" }}>
        <label>
          Strategy:
          <select style={{ marginLeft: 5 }} onChange={(e) => setStrategyFilter(e.target.value)} defaultValue="ALL">
            <option value="ALL">All Strategies</option>
            <option value="MACD">MACD</option>
            <option value="Breakout">Breakout</option>
          </select>
        </label>
        <label>
          Type:
          <select style={{ marginLeft: 5 }} onChange={(e) => setTypeFilter(e.target.value)} defaultValue="ALL">
            <option value="ALL">All Types</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </label>
        <label>
          Timeframe:
          <select style={{ marginLeft: 5 }} onChange={(e) => setTfFilter(e.target.value)} defaultValue="ALL">
            <option value="ALL">All TF</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 30, marginTop: 20 }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h3>📊 Equity Signals</h3>
          {filteredEquity.map(renderCard)}
        </div>

        <div style={{ flex: 1, minWidth: 300 }}>
          <h3>🧠 Option Signals</h3>
          {filteredOptions.map(renderCard)}
        </div>
      </div>

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
    </div>
  );
};

export default App;

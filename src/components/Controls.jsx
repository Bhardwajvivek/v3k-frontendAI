import React from "react";

const Controls = ({ isDark, alertsOn, cloudStatus, toggleTheme, toggleAlerts, refreshAll, handleCloudSync }) => {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button onClick={refreshAll} style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "white", borderRadius: 12, padding: "12px 20px", fontWeight: 600 }}>🔄 Refresh</button>
      <button onClick={toggleTheme} style={{ background: isDark ? "#374151" : "#e5e7eb", color: isDark ? "#fff" : "#111", borderRadius: 12, padding: "12px 20px", fontWeight: 600 }}>
        {isDark ? "☀️" : "🌙"} Theme
      </button>
      <button onClick={toggleAlerts} style={{ background: alertsOn ? "linear-gradient(135deg, #10b981, #059669)" : "#4b5563", color: "white", borderRadius: 12, padding: "12px 20px", fontWeight: 600 }}>
        {alertsOn ? "🔔 Alerts" : "🔕 Alerts"}
      </button>
      <button onClick={handleCloudSync} style={{ background: cloudStatus === "syncing" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", borderRadius: 12, padding: "12px 20px", fontWeight: 600 }}>
        ☁️ {cloudStatus === "syncing" ? "Syncing..." : "Cloud Sync"}
      </button>
    </div>
  );
};

export default Controls;

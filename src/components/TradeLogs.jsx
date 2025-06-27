import React from "react";

const TradeLogs = ({ logs }) => {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="bg-[#0a0a0a] p-4 rounded-xl shadow-md border border-gray-700 mt-4">
      <h2 className="text-white text-lg font-bold mb-3">📘 Trade Logs</h2>
      <div className="max-h-80 overflow-y-auto space-y-3">
        {logs.map((log, idx) => (
          <div key={idx} className="bg-gray-800 p-3 rounded-md text-sm text-white border-l-4 border-green-500">
            <strong>{log.symbol}</strong> — {log.action} at ₹{log.price} on {log.time}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeLogs;

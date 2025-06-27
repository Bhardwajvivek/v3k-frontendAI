import React from "react";

const StrategyStats = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="bg-[#111111] p-4 rounded-xl shadow-inner border border-gray-700 mt-4">
      <h2 className="text-white text-lg font-bold mb-3">📊 Strategy Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-white text-sm">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-gray-900 p-3 rounded-lg border border-gray-800 hover:border-green-500 transition-all">
            <strong>{item.strategy}</strong>
            <p>✅ Success: {item.successRate}%</p>
            <p>📈 Trades: {item.totalTrades}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyStats;

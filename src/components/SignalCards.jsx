import React from "react";

const SignalCard = ({ signal, onClick, darkMode }) => {
  const {
    symbol,
    strategy,
    strength,
    entry,
    exit,
    stoploss,
    trailingSL,
    target2,
    target3,
    riskReward,
    price,
    changePercent,
    timestamp,
    strategyTags,
  } = signal;

  return (
    <div
      className={`w-full max-w-sm p-4 rounded-xl shadow-lg border-2 ${
        darkMode ? "bg-zinc-900 text-white border-gray-600" : "bg-white border-gray-300"
      } hover:shadow-xl transition duration-200 ease-in-out`}
      onClick={() => onClick && onClick(signal)}
    >
      <div className="text-xl font-bold mb-1">{symbol}</div>
      <div className="text-sm mb-2 text-blue-600">{strategy}</div>

      <div className="flex justify-between text-sm mb-1">
        <span>Entry:</span> <span>₹{entry}</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Target 1:</span> <span>₹{exit}</span>
      </div>
      {target2 && (
        <div className="flex justify-between text-sm mb-1">
          <span>Target 2:</span> <span>₹{target2}</span>
        </div>
      )}
      {target3 && (
        <div className="flex justify-between text-sm mb-1">
          <span>Target 3:</span> <span>₹{target3}</span>
        </div>
      )}
      <div className="flex justify-between text-sm mb-1">
        <span>SL:</span> <span>₹{stoploss}</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>TSL:</span> <span>₹{trailingSL}</span>
      </div>
      {riskReward && (
        <div className="flex justify-between text-sm mb-1">
          <span>Risk/Reward:</span> <span>{riskReward}</span>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-400">{timestamp}</div>
    </div>
  );
};

export default SignalCard;

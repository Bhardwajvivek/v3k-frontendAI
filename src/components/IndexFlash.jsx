import React from "react";

const indices = [
  { name: "NIFTY 50", value: 22350 },
  { name: "BANK NIFTY", value: 47890 },
  { name: "NIFTY IT", value: 34200 },
  { name: "NIFTY PHARMA", value: 17120 },
  { name: "NIFTY 500", value: 20560 },
  { name: "NIFTY DEFENCE", value: 10480 }
];

const IndexFlash = () => {
  return (
    <div className="w-full overflow-x-auto whitespace-nowrap bg-gradient-to-r from-blue-900 to-black py-2 text-sm text-white animate-marquee">
      <div className="inline-flex space-x-12 px-4">
        {indices.map((i, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 bg-black/40 rounded-md px-3 py-1 border border-gray-700 shadow-md"
          >
            <strong className="text-yellow-300">{i.name}:</strong>
            <span className="text-white font-semibold">{i.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexFlash;

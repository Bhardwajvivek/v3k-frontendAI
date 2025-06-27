import React from "react";

const NewsTicker = ({ news }) => {
  if (!news || news.length === 0) return null;

  return (
    <div className="bg-black py-2 border-t border-b border-gray-700 animate-marquee text-white overflow-x-auto whitespace-nowrap text-sm font-medium">
      <div className="inline-flex space-x-12 px-4">
        {news.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-yellow-400">📰</span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;

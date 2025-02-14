// src/components/NewsCard.jsx
import React from 'react';

function NewsCard({ article }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <img
        src={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-xl text-blue-700 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-600 text-sm my-2 line-clamp-3">
          {article.description || 'No description available.'}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-500 hover:text-blue-600 font-semibold"
        >
          Read More →
        </a>
      </div>
    </div>
  );
}

export default NewsCard;

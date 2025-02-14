// src/components/NewsCategory.js
import React from 'react';

function NewsCategory({ category, articles }) {
  if (!articles) return null; // If no articles for this category, return null

  return (
    <div>
      <h2>{category}</h2>
      <div>
        {articles.map((article, index) => (
          <div key={index}>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsCategory;

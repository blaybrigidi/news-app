import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCategory from './NewsCategory';

function NewsApp() {
  const [categorizedData, setCategorizedData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const urls = [
  {
    url: "https://newsapi.org/v2/everything?q=apple&from=2023-01-01&sortBy=popularity&apiKey=50007d6b75d84100915829d1c35556e4",
    category: "Apple",
  },
  {
    url: "https://newsapi.org/v2/everything?q=tesla&from=2023-01-01&sortBy=publishedAt&apiKey=50007d6b75d84100915829d1c35556e4",
    category: "Tesla",
  },
  {
    url: "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=50007d6b75d84100915829d1c35556e4",
    category: "Business",
  },
  {
    url: "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=50007d6b75d84100915829d1c35556e4",
    category: "TechCrunch",
  },
  {
    url: "https://newsapi.org/v2/everything?domains=wsj.com&apiKey=50007d6b75d84100915829d1c35556e4",
    category: "Wall Street Journal",
  },
];


        const categorized = {};

        for (let i = 0; i < url.length; i++) {
          const response = await axios.get(url[i].url, { timeout: 20000 });
          const category = url[i].category;
          categorized[category] = response.data.articles || [];
        }

        setCategorizedData(categorized);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>News App</h1>
      <NewsCategory category="Apple News" articles={categorizedData['Apple News']} />
      <NewsCategory category="Tesla News" articles={categorizedData['Tesla News']} />
      <NewsCategory category="Business Headlines" articles={categorizedData['Business Headlines']} />
      <NewsCategory category="TechCrunch Headlines" articles={categorizedData['TechCrunch Headlines']} />
      <NewsCategory category="Wall Street Journal" articles={categorizedData['Wall Street Journal']} />
    </div>
  );
}

export default NewsApp;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCategory from './NewsCategory';

function NewsApp() {
  const [categorizedData, setCategorizedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = [
          { endpoint: 'apple', label: 'Apple' },
          { endpoint: 'tesla', label: 'Tesla' },
          { endpoint: 'business', label: 'Business' },
          { endpoint: 'techcrunch', label: 'TechCrunch' },
          { endpoint: 'wsj', label: 'Wall Street Journal' }
        ];

        const categorized = {};
        
        // Determine the API base URL based on environment
        const apiBaseUrl = import.meta.env.PROD 
          ? '' // Empty means same domain in production
          : 'http://localhost:3000'; // Use localhost in development

        for (const category of categories) {
          try {
            const response = await axios.get(`${apiBaseUrl}/api/news/${category.endpoint}`, { 
              timeout: 20000 
            });
            categorized[category.label] = response.data.articles || [];
          } catch (categoryError) {
            console.error(`Error fetching ${category.label} news:`, categoryError);
            categorized[category.label] = [];
          }
        }

        setCategorizedData(categorized);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading news...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="news-app">
      <h1>News App</h1>
      {Object.keys(categorizedData).map(category => (
        <NewsCategory 
          key={category}
          category={category} 
          articles={categorizedData[category]} 
        />
      ))}
    </div>
  );
}

export default NewsApp;

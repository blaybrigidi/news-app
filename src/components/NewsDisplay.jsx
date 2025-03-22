import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsDisplay = () => {
  const [newsData, setNewsData] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  const categories = [
    { endpoint: 'apple', label: 'Apple' },
    { endpoint: 'tesla', label: 'Tesla' },
    { endpoint: 'business', label: 'Business' },
    { endpoint: 'techcrunch', label: 'TechCrunch' },
    { endpoint: 'wsj', label: 'Wall Street Journal' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let allNews = [];
        
        for (let category of categories) {
          try {
            const response = await axios.get(`/api/news/${category.endpoint}`);
            if (response.data && response.data.articles) {
              // Add category to each article for filtering
              const articlesWithCategory = response.data.articles.map(article => ({
                ...article,
                category: category.label
              }));
              allNews = [...allNews, ...articlesWithCategory];
            }
          } catch (categoryError) {
            console.error(`Error fetching ${category.label} news:`, categoryError);
          }
        }
        
        setNewsData(allNews);
        setFilteredNews(allNews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to load news. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = newsData;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, newsData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const NewsCard = ({ article }) => (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={article.urlToImage || 'https://via.placeholder.com/800x400'} 
        alt={article.title}
        className="h-48 w-full object-cover hover:opacity-80 transition-opacity duration-300"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
        }}
      />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-blue-400">
            {article.category}
          </div>
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-300 line-clamp-3">
            {article.description}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-400 bg-blue-900 rounded-full hover:bg-blue-800"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 overflow-auto">
      <div className="w-full max-w-7xl p-8">
        <h1 className="text-6xl font-bold text-white text-center mb-12">Latest News</h1>
        
        <div className="flex flex-col sm:flex-row justify-center items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Search news..."
            className="w-full sm:w-96 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="w-full sm:w-48 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.endpoint} value={cat.label}>{cat.label}</option>
            ))}
          </select>
        </div>

        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentItems.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-xl py-12">
            No news articles found. Try changing your search or category.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-blue-400 border border-blue-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDisplay;
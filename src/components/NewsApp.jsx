// src/components/NewsApp.jsx
import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Pagination from './Pagination';

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

function NewsApp() {
  const [newsData, setNewsData] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 articles per page

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        let allNews = [];
        for (let item of urls) {
          const response = await fetch(item.url);
          if (!response.ok) {
            throw new Error(`Failed fetching: ${response.status}`);
          }
          const data = await response.json();
          if (data.articles) {
            // Attach a "category" field to each article
            allNews = [
              ...allNews,
              ...data.articles.map(article => ({
                ...article,
                category: item.category,
              })),
            ];
          }
        }
        setNewsData(allNews);
        setFilteredNews(allNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchData();
  }, []);

  // Filter news whenever searchQuery or selectedCategory changes
  useEffect(() => {
    let filtered = newsData;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1); // Reset to first page
  }, [searchQuery, selectedCategory, newsData]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Introduction */}
      <header className="py-10 text-center">
        <h1 className="text-5xl font-extrabold text-blue-600">Latest News</h1>
        <h2 className="text-xl font-semibold mt-2">Daily News Hub 📰</h2>
        <p className="text-gray-500 mt-2">
          Stay updated with the latest news from around the world.
        </p>
      </header>

      {/* Search and Category Filter */}
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search news..."
          className="w-full md:w-1/2 p-3 border border-blue-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="p-3 border border-blue-300 rounded-md shadow focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Apple">Apple</option>
          <option value="Tesla">Tesla</option>
          <option value="Business">Business</option>
          <option value="TechCrunch">TechCrunch</option>
          <option value="Wall Street Journal">Wall Street Journal</option>
        </select>
      </div>

      {/* News Grid */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentNews.length > 0 ? (
          currentNews.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No news articles found.
          </p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        totalItems={filteredNews.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default NewsApp;

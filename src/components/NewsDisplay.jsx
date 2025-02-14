import React, { useState, useEffect } from 'react';

const NewsDisplay = () => {
  const [newsData, setNewsData] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const urls = [
    { url: "https://newsapi.org/v2/everything?q=apple&from=2025-02-13&to=2025-02-13&sortBy=popularity&apiKey=50007d6b75d84100915829d1c35556e4", category: "Apple" },
    { url: "https://newsapi.org/v2/everything?q=tesla&from=2025-01-14&sortBy=publishedAt&apiKey=50007d6b75d84100915829d1c35556e4", category: "Tesla" },
    { url: "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=50007d6b75d84100915829d1c35556e4", category: "Business" },
    { url: "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=50007d6b75d84100915829d1c35556e4", category: "TechCrunch" },
    { url: "https://newsapi.org/v2/everything?domains=wsj.com&apiKey=50007d6b75d84100915829d1c35556e4", category: "Wall Street Journal" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allNews = [];
        for (let item of urls) {
          const response = await fetch(item.url);
          const data = await response.json();
          if (data.articles) {
            allNews = [...allNews, ...data.articles.map(article => ({ ...article, category: item.category }))];
          }
        }
        setNewsData(allNews);
        setFilteredNews(allNews);
      } catch (error) {
        console.error("Error fetching news:", error);
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
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        src={article.urlToImage || '/api/placeholder/800/400'} 
        alt={article.title}
        className="h-48 w-full object-cover hover:opacity-80 transition-opacity duration-300"
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
            <option value="Apple">Apple</option>
            <option value="Tesla">Tesla</option>
            <option value="Business">Business</option>
            <option value="TechCrunch">TechCrunch</option>
            <option value="Wall Street Journal">Wall Street Journal</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentItems.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>

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
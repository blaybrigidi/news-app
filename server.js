import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy endpoint
app.get('/api/news/:category', async (req, res) => {
  const { category } = req.params;
  const apiKey = '50007d6b75d84100915829d1c35556e4';
  
  console.log(`/api/news/${category} - Request received`);
  
  try {
    let url;
    switch(category) {
      case 'apple':
        url = `https://newsapi.org/v2/everything?q=apple&from=2023-01-01&sortBy=popularity&apiKey=${apiKey}`;
        break;
      case 'tesla':
        url = `https://newsapi.org/v2/everything?q=tesla&from=2023-01-01&sortBy=publishedAt&apiKey=${apiKey}`;
        break;
      case 'business':
        url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;
        break;
      case 'techcrunch':
        url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`;
        break;
      case 'wsj':
        url = `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${apiKey}`;
        break;
      default:
        console.log(`/api/news/${category} - Invalid category`);
        return res.status(400).json({ error: 'Invalid category' });
    }
    
    console.log(`/api/news/${category} - Fetching from NewsAPI: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    const response = await axios.get(url, { timeout: 20000 });
    console.log(`/api/news/${category} - Response received from NewsAPI, status: ${response.status}, articles: ${response?.data?.articles?.length || 0}`);
    
    // Special case to check for NewsAPI 'corsNotAllowed' error
    if (response.data && response.data.status === 'error' && response.data.code === 'corsNotAllowed') {
      console.error(`/api/news/${category} - NewsAPI returned corsNotAllowed error`);
      return res.status(403).json({
        error: 'NewsAPI returned corsNotAllowed error - this is happening because NewsAPI free plan does not allow production usage',
        message: response.data.message,
        details: 'Your NewsAPI key is working, but the free plan only works in development (localhost). You need a paid plan for production use.'
      });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error(`/api/news/${category} - Error:`, error.message);
    if (error.response) {
      console.error(`/api/news/${category} - Error response:`, {
        status: error.response.status,
        data: error.response.data
      });
    }
    res.status(500).json({ 
      error: 'Failed to fetch news data',
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint to check server configuration
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    serverTime: new Date().toISOString(),
    serverDir: __dirname,
    staticDir: path.join(__dirname, 'dist')
  });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  console.log(`Catchall route for: ${req.url}, serving index.html`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Static files served from: ${path.join(__dirname, 'dist')}`);
}); 
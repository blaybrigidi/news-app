const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { createRequire } = require('module');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy endpoint
app.get('/api/news/:category', async (req, res) => {
  const { category } = req.params;
  const apiKey = '50007d6b75d84100915829d1c35556e4';
  
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
        return res.status(400).json({ error: 'Invalid category' });
    }
    
    const response = await axios.get(url, { timeout: 20000 });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
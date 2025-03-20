const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware for JSON parsing
app.use(express.json());

// Storage for our parsed egg data
let eggData = [];

// Parse the CSV file when the server starts
fs.createReadStream(path.join(__dirname, 'egg.csv'))
  .pipe(csvParser())
  .on('data', (row) => {
    eggData.push({
      seriesId: row['Series ID'],
      year: parseInt(row['Year']),
      period: row['Period'],
      monthLabel: row['Label'],
      value: parseFloat(row['Value']),
      monthlyChange: row['1-Month Net Change'] === 'N/A' ? null : parseFloat(row['1-Month Net Change'])
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Egg Price API',
    endpoints: {
      '/api/prices': 'Get all egg prices',
      '/api/prices/:year': 'Get egg prices for a specific year',
      '/api/prices/:year/:month': 'Get egg price for a specific year and month (month as M01-M12)',
      '/api/yearly-averages': 'Get average egg prices by year'
    }
  });
});

// Get all egg prices
app.get('/api/prices', (req, res) => {
  res.json(eggData);
});

// Get egg prices for a specific year
app.get('/api/prices/:year', (req, res) => {
  const year = parseInt(req.params.year);
  const yearData = eggData.filter(item => item.year === year);
  
  if (yearData.length === 0) {
    return res.status(404).json({ error: `No data found for year ${year}` });
  }
  
  res.json(yearData);
});

// Get egg price for a specific year and month
app.get('/api/prices/:year/:month', (req, res) => {
  const year = parseInt(req.params.year);
  const month = req.params.month;
  
  // Validate month format (M01-M12)
  if (!/^M(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'Month should be in format M01-M12' });
  }
  
  const priceData = eggData.find(item => item.year === year && item.period === month);
  
  if (!priceData) {
    return res.status(404).json({ error: `No data found for ${month}/${year}` });
  }
  
  res.json(priceData);
});

// Get average egg prices by year
app.get('/api/yearly-averages', (req, res) => {
  // Group data by year and calculate average
  const yearlyAverages = eggData.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = {
        year: item.year,
        prices: [],
        count: 0,
        total: 0
      };
    }
    
    acc[item.year].prices.push(item.value);
    acc[item.year].total += item.value;
    acc[item.year].count += 1;
    
    return acc;
  }, {});
  
  // Calculate averages and format the response
  const result = Object.values(yearlyAverages).map(yearData => {
    return {
      year: yearData.year,
      averagePrice: Number((yearData.total / yearData.count).toFixed(2)),
      minPrice: Number(Math.min(...yearData.prices).toFixed(2)),
      maxPrice: Number(Math.max(...yearData.prices).toFixed(2))
    };
  }).sort((a, b) => a.year - b.year);
  
  res.json(result);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
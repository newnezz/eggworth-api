# Egg Price API

A simple REST API that provides historical egg price data from 1980 to 2025, based on the U.S. Bureau of Labor Statistics data.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Get API Information
```
GET /
```
Returns information about available endpoints.

### Get All Egg Prices
```
GET /api/prices
```
Returns all egg price data from 1980 to 2025.

### Get Egg Prices for a Specific Year
```
GET /api/prices/:year
```
Returns all egg price data for a specific year.

Example: `/api/prices/2022`

### Get Egg Price for a Specific Year and Month
```
GET /api/prices/:year/:month
```
Returns egg price data for a specific year and month. Month should be in the format M01-M12.

Example: `/api/prices/2022/M04`

### Get Yearly Average Prices
```
GET /api/yearly-averages
```
Returns the average, minimum, and maximum egg prices for each year.

## Data Structure

Each data point contains:

- `seriesId`: The series ID from the BLS data
- `year`: The year (numeric)
- `period`: The month code (M01-M12)
- `monthLabel`: Human-readable month and year
- `value`: The price of eggs in USD
- `monthlyChange`: The change in price from the previous month

## Data Source

The data is sourced from the U.S. Bureau of Labor Statistics, specifically the Average Price Data series for Eggs, Grade A, Large (per dozen). 
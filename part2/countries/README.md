# Countries Application  
**Full Stack Open – Part 2**

A React application for searching countries and viewing detailed information, including real-time weather data for the capital city.

## Features
- Filter countries by name
- View detailed country information
- Select a country on the list
- Display capital city weather data
- Fetch data from external APIs

## APIs Used
- REST Countries API
- OpenWeatherMap API

## Technologies
- React
- Axios

## Environment Variables
Create a `.env` file in the project root and put there your API key from that https://openweathermap.org/
```bash
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```
Restart the development server after adding the .env file.

## Setup
```bash
npm install
npm run dev
```

The application will be available at: http://localhost:5173

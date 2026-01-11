import axios from "axios";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY; 

const weather = (capital) => {
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`);

  return request.then(response => {
    return {
      capital,
      temp: response.data.main.temp,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      description: response.data.weather[0].description,
      wind: response.data.wind.speed
    }
  })
}

export default weather;
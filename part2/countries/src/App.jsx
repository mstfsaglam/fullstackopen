import { useState, useEffect } from 'react'
import CountryResults from './components/CountryResults'
import getAllCountries from './services/countries'
import weather from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countriesError, setCountriesError] = useState(false)
  const [countryName, setCountryName] = useState('')
  const [filterCountries, setFilterCountries] = useState([])
  const [capitalWeather, setCapitalWeather] = useState(null);

  const capital = filterCountries.length === 1 ? filterCountries[0].capital?.[0] : null;
  
  useEffect(() => {
    getAllCountries()
    .then(returnedCountries => setCountries(returnedCountries))
    .catch(() => setCountriesError(true))

  }, [])
  
  useEffect(() => {
    if(!capital) return;
    weather(capital)
    .then(weatherData => setCapitalWeather(weatherData))
    .catch(() => setCapitalWeather(null))
    
  }, [capital])

  const handleInputValue = (event) => {
    const inputValue = event.target.value;
    const filteredList = countries.filter(country => country.name.common.toLowerCase().includes(inputValue.toLowerCase().trim()));

    inputValue ? setFilterCountries(filteredList) : setFilterCountries([])
    setCountryName(inputValue)
  }
  
  const showCountryClick = (country) => {
    setFilterCountries([country])
  }

  return(
    <div>
      <div>
        find countries <input value={countryName} onChange={handleInputValue} />
      </div>
      {countriesError ?
        <div>
          <br />
          Countries data not available
        </div>
      :
        <CountryResults filterCountries={filterCountries} showCountryClick={showCountryClick} capitalWeather={capitalWeather}/>    
      }
    </div>
  )
}

export default App;
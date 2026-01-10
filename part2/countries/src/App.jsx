import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryResults from './components/CountryResults'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryName, setCountryName] = useState('')
  const [filterCountries, setFilterCountries] = useState([])

  useEffect(() => {
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all/')
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleInputValue = (event) => {
    const inputValue = event.target.value;
    const filteredList = countries.filter(country => country.name.common.toLowerCase().includes(inputValue));
    
    inputValue ? setFilterCountries(filteredList) : setFilterCountries([])
    setCountryName(inputValue)
  }
  const showCountryClick = (country) => {
    setFilterCountries(Array(country))
  }

  return(
    <div>
      <div>
        find countries <input value={countryName} onChange={handleInputValue} />
      </div>
      <CountryResults filterCountries={filterCountries} showCountryClick={showCountryClick}/>
    </div>
  )
}

export default App;
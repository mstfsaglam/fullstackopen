const CountryResults = ({ filterCountries, showCountryClick, capitalWeather }) => {

  if(filterCountries.length >= 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  else if(filterCountries.length === 1) {
    const country = filterCountries[0];
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => <li key={language + country.cca3}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        {capitalWeather ? 
          <div>
            <h2>Weather in {capitalWeather.capital}</h2>
            <div>Temperature {capitalWeather.temp} Celsius </div>
            <img src={capitalWeather.icon} alt={capitalWeather.description}></img>
            <div>Wind {capitalWeather.wind} m/s</div>
          </div>
        :
          <div>
            <br />
            Weather data not available!
          </div>
        }
      </div>
    )
  }
    
  return (
    <div>
      {filterCountries.map(country => {
      return (
        <div key={country.cca3}>
          <div>{country.name.common}</div>
          <button onClick={() => showCountryClick(country)}>Show</button>
        </div>
      )
      })}
    </div>
  )    
} 

export default CountryResults;
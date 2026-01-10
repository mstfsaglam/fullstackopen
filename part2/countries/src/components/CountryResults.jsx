const CountryResults = ({ filterCountries }) => {

  if(filterCountries.length >= 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  else if(filterCountries.length === 1) {
    const country = filterCountries[0];
    return (
      <div key={country.cca3}>
        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
      </div>
    )
  }
    
  return (
    <div>
      {filterCountries.map(country => {
      return <div key={country.name.common}>{country.name.common}</div>
      })}
    </div>
  )    
} 

export default CountryResults;
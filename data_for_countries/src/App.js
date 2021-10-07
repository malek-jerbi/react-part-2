import React, { useEffect, useState } from 'react'
import axios from 'axios' 
const api_key = process.env.REACT_APP_API_KEY

const Country = ({country, weather}) => {
  return (
    <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital}</p>
    <p>region {country.region}</p>
    <h3>languages</h3>
    <ul>{Object.values(country.languages).map(language => <li key={language}>{language}</li>)}</ul>
    <img src={country.flags.png} alt={`flag of ${country.name.common}`}/>
    <h2>Weather in {country.capital[0]}</h2>
       <div><strong>temperature: </strong> {weather.current.temperature}</div> 
       <div><img src={weather.current.weather_icons[0]} alt='weather icon' /></div> 
       <div><strong>wind: </strong> {weather.current.wind_speed}</div>
  </div>
  )
}

const Countries = ({countries,filter,changeState,showCountry,setShowCountry}) => {
  const [weather, changeWeather] = useState([])
  const [capital, setCapital] = useState('New York')
 
  useEffect( ()=> {
    
        axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
      .then(response=> {
        changeWeather(response.data)
        console.log(response.data);
      })  
      
     
  },[capital])
  const filteredList=countries
  .filter(country=>country.name.common.toLowerCase().includes(filter.toLowerCase()))
 
  const mappedList =filteredList
  .map( (country,index) => 
    <div key={country.name.official}> 
      {country.name.common}
      <button onClick={
        ()=>{changeState() ; setShowCountry([filteredList[index]]); } 
      }> show 
      </button>
    </div>
  )
  if(showCountry.length===1) { 
    if(capital !== showCountry[0].capital[0])
    setCapital(showCountry[0].capital[0])
    return (
      <div>
        <Country country={showCountry[0]} weather={weather}/>
      </div>)
 }
  if(filteredList.length===1) {
    if(capital !== filteredList[0].capital[0])
       setCapital(filteredList[0].capital[0])
    return (
      <div>
        <Country country={filteredList[0]} weather={weather}/>  
      </div>
   )  
    }
  if (filteredList.length<=10) return(mappedList)
  else return (<div>Too many matches, specify another filter</div>)
}
const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [state, setState] = useState(0)
  const [showCountry,setShowCountry] = useState([])
  
  useEffect(() =>
    axios
    .get('https://restcountries.com/v3.1/all')
    .then(response=> {
      setCountries(response.data)
    })
    ,[]) 
  
  const handleFilter = (event) => {
    setFilter(event.target.value)
    setShowCountry([])
  }
  const changeState= () => {
    setState(state+1)
  }

  return (
  
  <div>
    <p>find countries</p>
    <input value={filter} onChange={handleFilter}></input>
    <Countries showCountry={showCountry} setShowCountry={setShowCountry} 
    countries={countries} filter={filter} changeState={changeState} />
  </div>
)
}
export default App
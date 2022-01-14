import React, {useState, useEffect } from "react";
import {MenuItem, FormControl, Select,Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table";






function App() {
  const[countries, setCountries]=useState([]);
  const[country, setcountry] = useState('worldwide');
  const[countryInfo, setCountryInfo] = useState({});
  const[tableData, setTableData] =useState([]);



  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
     
  
             useEffect(() => {
               const getCountriesData = async () => {
                 await fetch("https://disease.sh/v3/covid-19/countries")
                 .then((response) => response.json())
                 .then((data) => {
                   const countries =data.map((country) => ({
                     name: country.country,
                     value: country.countryInfo.iso2,
                   }));


                   
                   setTableData(data);
                   setCountries(countries);
                   
                 });
               };
               getCountriesData();

              },  []);

   const onCountryChange= async (event) => {
     const countryCode = event.target.value;
     
     const url =
     countryCode === "worldwide"
       ? "https://disease.sh/v3/covid-19/all"
       : `https://disease.sh/v3/covid-19/countries/${countryCode}`;


       await fetch(url)
       .then((response) => response.json())
       .then((data) => {
        setcountry(countryCode);

         setCountryInfo(data);

       });

   };
        console.log("COUNTRY INFO >>>",countryInfo); 


  return (
    <div className="app">
    <div className='app_left'>
    <div className="app_header">
      <h1> COVID-19 TRACKER</h1>
      <FormControl classname="app_dropdown">
        <Select variant ="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {
            countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))} 

        </Select>
      </FormControl>
    </div>


    <div classname="app_stats">
      <InfoBox title='Coronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases} />

      <InfoBox title='Recoverd' cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

      <InfoBox title='Death'cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
    </div>


   <Map/>
  

    </div>  
    <Card className='app_right'>
    <CardContent>
      <h3>Live Cases by Country</h3>
      <Table countries={tableData} />
      <h3>Worldwide new Cases</h3>

     {/*Graph*/}
    </CardContent>

    </Card>
   </div>

  );
 }
  
  export default App;





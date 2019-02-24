import React, { Component } from "react";
import axios from "axios";
import Country from "./components/Country";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      countries: []
    };
  }
  componentDidMount() {
    this.getData();
  }

  sortData = data => {
    // Create copy of state / new countries array
    const countries = [];
    // Loop through result from API,
    // Validate IF country is a country(rather than aggregate/region)
    // Push that country's info into the new countries array
    data.forEach((country, i) => {
      if (country.region.value !== "Aggregates") {
        countries.push({
          id: country.id,
          name: country.name,
          capital: country.capitalCity,
          region: country.region.value.trim(),
          incomeLevel: country.incomeLevel.value,
          latitude: country.latitude,
          longitude: country.longitude
        });
      }
    });

    // alphabetize countries
    countries.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    // replace state with new countries array
    this.setState({
      countries: countries
    });
  };

  getData = () => {
    axios
      // .get("http://api.worldbank.org/v2/countries/?format=json", {
      .get("http://api.worldbank.org/v2/countries/?format=json", {
        params: {
          per_page: "500"
        }
      })
      .then(res => {
        const data = res.data[1];
        this.sortData(data);
        console.log(data);
      });
  };

  getCountriesByRegion = e => {
    const countries = [...this.state.countries];
    const region = e.target.innerText;
    const countriesInRegion = countries.filter(
      country => country.region === region
    );
    this.setState({
      filteredCountries: countriesInRegion
    });
  };

  getCountriesByLetter = e => {
    const letter = e.target.innerText.toUpperCase();
    const countries = [...this.state.countries];
    const countriesByLetter = countries.filter(country =>
      country.name.startsWith(letter)
    );
    this.setState({
      filteredCountries: countriesByLetter
    });
  };

  getCountriesByIncomeLevel = e => {
    const incomeLevel = e.target.innerText;
    const countries = [...this.state.countries];
    const countriesByIncomeLevel = countries.filter(
      country => country.incomeLevel === incomeLevel
    );
    this.setState({
      filteredCountries: countriesByIncomeLevel
    });
  };

  render() {
    const countries = [...this.state.countries];
    const regions = [];
    const incomeLevels = [];
    // Loop through countries array
    countries.forEach((country) => {
      const region = country.region;
      const incomeLevel = country.incomeLevel;
      // IF it doesn't already exist in the regions/incomeLevels array, push into respective array
      if (!regions.includes(region)) regions.push(region);
      if (!incomeLevels.includes(incomeLevel)) incomeLevels.push(incomeLevel);
    });


    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const alphaLetters = alphabet.split("");

    return (
      <div className="App">
        <div className="wrapper">
          {alphaLetters.map((letter, i) => {
            return (
              <button key={`${i}${letter}`} onClick={this.getCountriesByLetter}>
                {letter}
              </button>
            );
          })}

          {regions.map((region, i) => {
            return (
              <button key={i} onClick={this.getCountriesByRegion}>
                {region}
              </button>
            );
          })}
          {incomeLevels.map((incomeLevel, i) => {
            return (
              <button key={i} onClick={this.getCountriesByIncomeLevel}>
                {incomeLevel}
              </button>
            );
          })}
          <div className="countries">
            {this.state.filteredCountries && (
              <p>
                {this.state.filteredCountries.length} Countries Match Your
                Search
              </p>
            )}
            {!this.state.filteredCountries && (
              <p>There are {this.state.countries.length} countries</p>
            )}

            {!this.state.filteredCountries &&
              this.state.countries.map((country, i) => (
                <Country key={i} country={country} />
              ))}

            {/* /// ADD FILTER BY incomeLevel */}

            {this.state.filteredCountries &&
              this.state.filteredCountries.map((country, i) => (
                <Country key={i} country={country} />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

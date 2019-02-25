import React, { Component } from "react";
import axios from "axios";
import Country from "./components/Country";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      countries: [],
      filteredCountries: []
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
          longitude: country.longitude,
          NShemisphere: country.latitude > 0 ? "Northern" : "Southern",
          WEhemisphere: country.longitude > 0 ? "Eastern" : "Western"
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
      .get("http://api.worldbank.org/v2/countries/?format=json", {
        params: {
          per_page: "500"
        }
      })
      .then(res => {
        const data = res.data[1];
        this.sortData(data);
      });
  };

  removeDupes = (newFilteredCountries, comp) => {
    // spread new filtered countries into state (which will create dupes depending on search criteria)
    const dupes = [...this.state.filteredCountries, ...newFilteredCountries];
    // remove duplicates
    const filteredCountries = dupes
      .map(e => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => dupes[e])
      .map(e => dupes[e]);
    return filteredCountries;
  };

  setFilteredToState = filtered => {
    this.setState({
      filteredCountries: filtered
    });
  };

  getCountriesByRegion = e => {
    const countries = [...this.state.countries];
    const region = e.target.innerText;
    const countriesInRegion = countries.filter(
      country => country.region === region
    );
    const filteredCountries = this.removeDupes(countriesInRegion, "name");
    this.setFilteredToState(filteredCountries);
  };

  getCountriesByLetter = e => {
    const letter = e.target.innerText.toUpperCase();
    const countries = [...this.state.countries];
    const countriesByLetter = countries.filter(country =>
      country.name.startsWith(letter)
    );
    const filteredCountries = this.removeDupes(countriesByLetter, "name");
    this.setFilteredToState(filteredCountries);
  };

  getCountriesByIncomeLevel = e => {
    const incomeLevel = e.target.innerText;
    const countries = [...this.state.countries];
    const countriesByIncomeLevel = countries.filter(
      country => country.incomeLevel === incomeLevel
    );
    const filteredCountries = this.removeDupes(countriesByIncomeLevel, "name");
    this.setFilteredToState(filteredCountries);
  };

  getCountriesByHemisphere = e => {
    const hemisphere = e.target.innerText;
    const countries = [...this.state.countries];
    const countriesByHemisphere = countries.filter(country => {
      return (
        country.NShemisphere === hemisphere ||
        country.WEhemisphere === hemisphere
      );
    });
    const filteredCountries = this.removeDupes(countriesByHemisphere, "name");
    this.setFilteredToState(filteredCountries);
  };

  render() {
    const countries = [...this.state.countries];
    const regions = [];
    const incomeLevels = [];
    // Loop through countries array
    countries.forEach(country => {
      const region = country.region;
      const incomeLevel = country.incomeLevel;
      // IF it doesn't already exist in the regions/incomeLevels array, push into respective array
      if (!regions.includes(region)) regions.push(region);
      if (!incomeLevels.includes(incomeLevel)) incomeLevels.push(incomeLevel);
    });

    // REGION BUTTONS MAP
    const regionBtns = regions.map((region, i) => {
      return (
        <button key={i} onClick={this.getCountriesByRegion}>
          {region}
        </button>
      );
    });

    // INCOME BUTTONS MAP
    const incomeBtns = incomeLevels.map((incomeLevel, i) => {
      return (
        <button key={i} onClick={this.getCountriesByIncomeLevel}>
          {incomeLevel}
        </button>
      );
    });

    // ALPHABET BUTTONS MAP
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const alphaLetters = alphabet.split("");

    const letterBtns = alphaLetters.map((letter, i) => {
      return (
        <button key={`${i}${letter}`} onClick={this.getCountriesByLetter}>
          {letter}
        </button>
      );
    });

    const hemispheres = ["Northern", "Southern", "Western", "Eastern"];

    const hemisphereBtns = hemispheres.map((hemisphere, i) => {
      return (
        <button
          key={`${i}${hemisphere}`}
          onClick={this.getCountriesByHemisphere}
        >
          {hemisphere}
        </button>
      );
    });

    return (
      <div className="App">
        <div className="wrapper">
          {/* {hemispheres.map()} */}

          {letterBtns}
          {regionBtns}
          {incomeBtns}
          {hemisphereBtns}

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

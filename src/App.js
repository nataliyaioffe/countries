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

  // *** API CALL ***
  getData = () => {
    // get data
    axios
      .get("http://api.worldbank.org/v2/countries/?format=json", {
        params: {
          per_page: "500"
        }
      })
      // then pass result to sort function
      .then(res => {
        const data = res.data[1];
        this.sortData(data);
      });
  };

  // *** SORT RESULT FROM API CALL ***
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
    // replace state with new countries array
    this.setState({
      countries: countries
    });
  };

  // *** ALPHABETIZE ***
  alphabetize = array => {
    array.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  };

  // *** SEARCH BY LETTER ***
  getCountriesByLetter = e => {
    const letter = e.target.innerText.toUpperCase();
    const countries = [...this.state.countries];
    const countriesByLetter = countries.filter(country =>
      country.name.startsWith(letter)
    );
    const filteredCountries = this.removeDupes(countriesByLetter, "name");
    this.setFilteredToState(filteredCountries);
  };

  // *** SEARCH BY REGION ***
  getCountriesByRegion = e => {
    const region = e.target.innerText;
    const countries = [...this.state.countries];
    const countriesInRegion = countries.filter(
      country => country.region === region
    );
    const filteredCountries = this.removeDupes(countriesInRegion, "name");
    this.setFilteredToState(filteredCountries);
  };

  // *** SEARCH BY INCOME LEVEL ***
  getCountriesByIncomeLevel = e => {
    const incomeLevel = e.target.innerText;
    const countries = [...this.state.countries];
    const countriesByIncomeLevel = countries.filter(
      country => country.incomeLevel === incomeLevel
    );
    const filteredCountries = this.removeDupes(countriesByIncomeLevel, "name");
    this.setFilteredToState(filteredCountries);
  };

  // *** SEARCH BY HEMISPHERE ***
  getCountriesByHemisphere = e => {
    console.log(e);
    const hemisphere = e.target.value;
    const countries = [...this.state.countries];
    const countriesByHemisphere = countries.filter(country => {
      return (
        country.NShemisphere === hemisphere ||
        country.WEhemisphere === hemisphere
      );
    });
    if (e.target.checked) {
      const filteredCountries = this.removeDupes(countriesByHemisphere, "name");
      this.setFilteredToState(filteredCountries);
    } else {
      this.removeCriteria(hemisphere, e);
    }
  };

  // *** REMOVING SEARCH CRITERIA ***

  removeCriteria = (criteriaToRemove, e) => {
    console.log("removing");
    const filteredCountries = [...this.state.filteredCountries];
    const newFilteredCountries = filteredCountries.filter(country => {
      return !country.hemisphere === criteriaToRemove;
    });

    this.setState({
      filteredCountries: newFilteredCountries
    });
  };

  // *** REMOVING DUPLICATES ***
  removeDupes = (newFilteredCountries, comp) => {
    const dupes = [...this.state.filteredCountries, ...newFilteredCountries];
    const filteredCountries = dupes
      .map(e => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => dupes[e])
      .map(e => dupes[e]);
    return filteredCountries;
  };

  // ***** SET FILTERED COUNTRIES TO STATE *****
  setFilteredToState = filtered => {
    this.alphabetize(filtered);
    this.setState({
      filteredCountries: filtered
    });
  };

  // ********************** RENDER **********************
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

    // *** REGION BUTTONS MAP ***
    const regionBtns = regions.map((region, i) => {
      return (
        <button key={i} onClick={this.getCountriesByRegion}>
          {region}
        </button>
      );
    });

    // *** INCOME BUTTONS MAP ***
    const incomeBtns = incomeLevels.map((incomeLevel, i) => {
      return (
        <button key={i} onClick={this.getCountriesByIncomeLevel}>
          {incomeLevel}
        </button>
      );
    });

    // *** ALPHABET BUTTONS MAP ***
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const alphaLetters = alphabet.split("");

    const letterBtns = alphaLetters.map((letter, i) => {
      return (
        <button key={`${i}${letter}`} onClick={this.getCountriesByLetter}>
          {letter}
        </button>
      );
    });

    // *** HEMISPHERE BUTTONS MAP ***
    const hemispheres = ["Northern", "Southern", "Western", "Eastern"];
    const hemisphereBtns = hemispheres.map((hemisphere, i) => {
      return (
        <form action="" key={`${i}${hemisphere}`}>
          <label htmlFor={hemisphere}>{hemisphere}</label>
          <input
            className="nataliya"
            onClick={this.getCountriesByHemisphere}
            type="checkbox"
            name={hemisphere}
            value={hemisphere}
          />
        </form>

        // <button
        //   key={`${i}${hemisphere}`}
        //   onClick={this.getCountriesByHemisphere}
        // >
        //   {hemisphere}
        // </button>
      );
    });
    // ********************** RETURN **********************
    return (
      <div className="App">
        <div className="wrapper">
          <div className="searchBy">
            <p>
              <span className="criteriaHeadline">Search by Alphabet:</span>{" "}
              {letterBtns}
            </p>
          </div>
          <div className="searchBy">
            <p>
              <span className="criteriaHeadline">Search by Region: </span>
              {regionBtns}
            </p>
          </div>
          <div className="searchBy">
            <p>
              <span className="criteriaHeadline">Search by Income Level: </span>
              {incomeBtns}
            </p>
          </div>
          <div className="searchBy">
            <p>
              <span className="criteriaHeadline">Search by Hemisphere: </span>
              {hemisphereBtns}
            </p>
          </div>

          {this.state.filteredCountries && (
            <p className="resultsInfo">
              {this.state.filteredCountries.length} Countries Match Your Search
            </p>
          )}
          {!this.state.filteredCountries && (
            <p>There are {this.state.countries.length} countries</p>
          )}

          <div className="countries">
            {/* {!this.state.filteredCountries &&
              this.state.countries.map((country, i) => (
                <Country key={i} country={country} />
              ))} */}

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

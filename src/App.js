import React, { Component } from "react";
import axios from "axios";
import Country from "./components/Country";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      countries: [],
      filteredCountries: [],
      checked: {}
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
    const allCountries = [];
    // Loop through result from API,
    // Validate IF country is a country(rather than aggregate/region)
    // Push that country's info into the new countries array
    data.forEach((country, i) => {
      if (country.region.value !== "Aggregates") {
        allCountries.push({
          id: country.id,
          name: country.name,
          capital: country.capitalCity,
          region: country.region.value.trim(),
          incomeLevel: country.incomeLevel.value,
          latitude: country.latitude,
          longitude: country.longitude,
          hemisphere: [
            country.latitude > 0 ? "Northern" : "Southern",
            country.longitude > 0 ? "Eastern" : "Western"
          ]
        });
      }
    });
    // replace state with new countries array
    this.alphabetize(allCountries);
    this.setState({
      countries: allCountries
    });
  };

  // *** ALPHABETIZE ***
  alphabetize = array => {
    array.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  };

  getAllCountries = e => {
    const all = e.target.value;

    if (e.target.checked) {
      const allCountries = [...this.state.countries];
      const updatedChecked = { ...this.state.checked, [all]: true };
      this.updateState(allCountries, updatedChecked);
    } else {
      this.removeCriteria(all);
    }
  };

  // *** SEARCH BY LETTER ***
  getCountriesByLetter = e => {
    const letter = e.target.innerText.toUpperCase();
    const updatedChecked = { ...this.state.checked, [letter]: true };
    const countries = [...this.state.countries];
    const countriesByLetter = countries.filter(country =>
      country.name.startsWith(letter)
    );
    const filteredCountries = this.removeDupes(countriesByLetter, "name");
    this.updateState(filteredCountries, updatedChecked);
  };

  // *** SEARCH BY REGION ***
  getCountriesByRegion = e => {
    const region = e.target.value;

    if (e.target.checked) {
      const updatedChecked = { ...this.state.checked, [region]: true };
      const countries = [...this.state.countries];
      const countriesInRegion = countries.filter(
        country => country.region === region
      );
      const filteredCountries = this.removeDupes(countriesInRegion, "name");
      this.updateState(filteredCountries, updatedChecked);
    } else {
      console.log("hi");
      this.removeCriteria(region, e);
    }
  };

  getCountriesByIncomeLevel = e => {
    const incomeLevel = e.target.value;
    if (e.target.checked) {
      const updatedChecked = { ...this.state.checked, [incomeLevel]: true };
      const countries = [...this.state.countries];
      const countriesByIncomeLevel = countries.filter(
        country => country.incomeLevel === incomeLevel
      );
      const filteredCountries = this.removeDupes(
        countriesByIncomeLevel,
        "name"
      );
      this.updateState(filteredCountries, updatedChecked);
    } else {
      console.log("hi");
      this.removeCriteria(incomeLevel, e);
    }
  };

  // *** SEARCH BY HEMISPHERE ***
  getCountriesByHemisphere = e => {
    const hemisphere = e.target.value;
    const updatedChecked = { ...this.state.checked, [hemisphere]: true };
    const countries = [...this.state.countries];
    const countriesByHemisphere = countries.filter(country => {
      return (
        country.hemisphere[0] === hemisphere ||
        country.hemisphere[1] === hemisphere
      );
    });
    if (e.target.checked) {
      const filteredCountries = this.removeDupes(countriesByHemisphere, "name");
      this.updateState(filteredCountries, updatedChecked);
    } else {
      this.removeCriteria(hemisphere, e);
    }
  };

  // ~~~ REMOVING SEARCH CRITERIA ~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // TRYING IT WITH REGIONS FIRST...
  removeCriteria = (criteriaToRemove, e) => {
    const criteriaHeadline = e.target.name;
    // console.log("removing", criteriaToRemove);

    const filteredCountries = [...this.state.filteredCountries];
    // console.log(filteredCountries, "filtered Countries");

    const checked = { ...this.state.checked };
    delete checked[criteriaToRemove];

    const checkedRegions = Object.keys(checked);
    // console.log(checkedRegions, "checked Regions");

    const countriesToRemove = filteredCountries.filter(country => {
      if (checkedRegions[country[criteriaHeadline]]) return country;
    });
    // console.log(countriesToRemove, "countries to remove");

    const newFilteredCountries = filteredCountries.filter((country, i) => {
      if (countriesToRemove.includes(country.name)) {
        return country;
      }
    });
    // console.log(newFilteredCountries, "new filtered");

    this.setState({
      filteredCountries: newFilteredCountries,
      checked: checked
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
  updateState = (countries, checked) => {
    this.alphabetize(countries);
    this.setState({
      filteredCountries: countries,
      checked: checked
    });
  };

  // ********************** RENDER **********************
  // ****************************************************
  // ****************************************************
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
    // render input / labels for every region
    const regionBtns = regions.map((region, i) => {
      return (
        <div key={`${i}${region}`}>
          <label htmlFor="region">{region}</label>
          <input
            className="region nataliya"
            onClick={this.getCountriesByRegion}
            type="checkbox"
            name="region"
            value={region}
          />
        </div>
      );
    });

    // *** INCOME BUTTONS MAP ***
    // render input / labels for every income level
    const incomeBtns = incomeLevels.map((incomeLevel, i) => {
      return (
        <div key={`${i}${incomeLevel}`}>
          <label htmlFor={incomeLevel}>{incomeLevel}</label>
          <input
            className="nataliya"
            onClick={this.getCountriesByIncomeLevel}
            type="checkbox"
            name={incomeLevel}
            value={incomeLevel}
          />
        </div>
      );
    });

    // *** ALPHABET BUTTONS MAP ***
    // render input / labels for every letter in alphabet
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
    // render input / labels for every hemisphere
    const hemispheres = ["Northern", "Southern", "Western", "Eastern"];
    const hemisphereBtns = hemispheres.map((hemisphere, i) => {
      return (
        <div key={`${i}${hemisphere}`}>
          <label htmlFor={hemisphere}>{hemisphere}</label>
          <input
            className="nataliya"
            onClick={this.getCountriesByHemisphere}
            type="checkbox"
            name={hemisphere}
            value={hemisphere}
          />
        </div>
      );
    });
    // ********************** RETURN **********************
    // ****************************************************
    // ****************************************************
    return (
      <div className="App">
        <div className="wrapper">
          {/* ALL COUNTRIES */}
          <div className="searchBy">
            <label htmlFor="allCountries">All Countries</label>
            <input
              className="nataliya"
              onClick={this.getAllCountries}
              type="checkbox"
              name="allCountries"
              value="allCountries"
            />
          </div>
          {/* ALPHABET Choices */}
          <div className="searchBy">
            <span className="criteriaHeadline">Search by Alphabet: </span>
            {letterBtns}
          </div>
          {/* REGION Choices */}
          <div className="searchBy">
            <span className="criteriaHeadline">Search by Region: </span>
            {regionBtns}
          </div>
          {/* INCOME Choices */}
          <div className="searchBy">
            <span className="criteriaHeadline">Search by Income Level: </span>
            {incomeBtns}
          </div>
          {/* HEMISPHERE Choices */}
          <div className="searchBy">
            <span className="criteriaHeadline">Search by Hemisphere: </span>
            {hemisphereBtns}
          </div>

          {/* RENDER COUNTRY COMPONENTS WHEN THERE ARE FILTERED RESULTS FROM SEARCH CRITERIA */}
          <div className="countries">
            {this.state.filteredCountries && (
              <p className="resultsInfo">
                {this.state.filteredCountries.length} Countries Match Your
                Search
              </p>
            )}
            {this.state.filteredCountries.map((country, i) => (
              <Country key={i} country={country} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

/// OLD ------------------------------
// <button key={i} onClick={this.getCountriesByRegion}>
//   {region}
// </button>

// <button key={i} onClick={this.getCountriesByIncomeLevel}>
//   {incomeLevel}
// </button>

// <button
//   key={`${i}${hemisphere}`}
//   onClick={this.getCountriesByHemisphere}>
//   {hemisphere}
// </button>

// ---------
// const updatedChecked = { ...this.state.checked, [incomeLevel]: true };
// const countries = [...this.state.countries];
// const countriesByIncomeLevel = countries.filter(
//   country => country.incomeLevel === incomeLevel
// );
// const filteredCountries = this.removeDupes(countriesByIncomeLevel, "name");
// this.updateState(filteredCountries, updatedChecked);

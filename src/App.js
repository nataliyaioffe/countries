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
    const countries = this.state.countries;
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
          incomeLevel: country.incomeLevel.value
        });
      }
    });
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

  getCountriesByRegion = e => {
    const countries = this.state.countries;
    const region = e.target.innerText;
    const countriesInRegion = countries.filter(
      country => country.region === region
    );
    this.setState({
      filteredCountries: countriesInRegion
    });
  };

  getCountriesByLetter = e => {
    const letter = e.target.innerText;
    const countries = this.state.countries;
    const countriesByLetter = countries.filter(country =>
      country.name.startsWith(letter)
    );
    this.setState({
      filteredCountries: countriesByLetter
    });
  };

  render() {
    const countries = this.state.countries;
    const regions = [];
    // Loop through countries array
    countries.forEach((country, i) => {
      const region = country.region;
      // IF it doesn't already exist in the regions array, push the country's region into the regions array
      if (regions.includes(region) === false) regions.push(region);
    });

    return (
      <div className="App">
        <div className="wrapper">
          <button className="letter" onClick={this.getCountriesByLetter}>
            A
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            B
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            C
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            D
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            E
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            F
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            G
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            H
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            {" "}
            I
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            J
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            K
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            L
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            M
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            N
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            O
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            P
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            Q
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            R
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            S
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            T
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            U
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            V
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            W
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            X
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            Y
          </button>
          <button className="letter" onClick={this.getCountriesByLetter}>
            Z
          </button>

          {regions.map((region, i) => {
            return (
              <button key={i} onClick={this.getCountriesByRegion}>
                {region}
              </button>
            );
          })}
          <div className="countries">
            {/* /// DEFAULT == show ALL countries */}
            {/* /// ADD FILTER BY incomeLevel */}
            {/* /// ADD POPULATION SOMEHOW?????? */}
            {/* /// THEN ADD FILTER BY POPULATION */}
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

{
  /* // {this.state.countries !== 0 */
}
//   ? this.state.region.map((country, i) => {
//       return <Country key={i} country={country} />;
//     })
//   : this.state.countries !== 0
//   ? this.state.countriesByLetter.map((country, i) => {
//       return <Country key={i} country={country} />;
//     })
//   : null}

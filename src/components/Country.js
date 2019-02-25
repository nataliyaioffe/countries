import React, { Component } from "react";
import CountryDetails from "./CountryDetails";

class Country extends Component {
  constructor() {
    super();
    this.state = {
      clicked: false
    };
  }
  showDetails = () => {
    console.log("SUP");

    if (!this.state.clicked) {
      this.setState({
        clicked: true
      });
    } else {
      this.setState({
        clicked: false
      });
    }
  };

  render() {
    return (
      <div className="country" onClick={this.showDetails}>
        <p className="countryName">
          <span>{this.props.country.name}</span>
        </p>

        {this.state.clicked &&
            <CountryDetails key={this.props.key} country={this.props.country} />
          }
      </div>
    );
  }
}

export default Country;

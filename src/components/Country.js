import React, { Component } from "react";

class Country extends Component {
  render() {
    return (
      <div className="country">
        <p className="countryName">{this.props.country.name}</p>
        <p>Capital City: {this.props.country.capital}</p>
        <p>Income Level: {this.props.country.incomeLevel}</p>
      </div>
    );
  }
}

export default Country;

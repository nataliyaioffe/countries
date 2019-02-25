import React, { Component } from "react";

class CountryDetails extends Component {
    render() {
        return (
            <div className="details">
                <p><span>Capital City:</span> {this.props.country.capital}</p>
                <p><span>Region:</span> {this.props.country.region}</p>
                <p><span>Income Level:</span> {this.props.country.incomeLevel}</p>
                <p><span>Longitude:</span> {this.props.country.longitude}</p>
                <p><span>Latitude: </span> {this.props.country.latitude}</p>
                <p><span>Hemispheres:</span> <br />{this.props.country.NShemisphere} / {this.props.country.WEhemisphere}</p>
            </div>
        );
    }
}

export default CountryDetails;

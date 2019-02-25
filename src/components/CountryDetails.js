import React, { Component } from "react";

class CountryDetails extends Component {

    render() {
        const { capital, region, incomeLevel, longitude, latitude, hemisphere } = this.props.country;

        return (
            <div className="details">
                <p><span>Capital City:</span> {capital}</p>
                <p><span>Region:</span> {region}</p>
                <p><span>Income Level:</span> {incomeLevel}</p>
                <p><span>Longitude:</span> {longitude}</p>
                <p><span>Latitude: </span> {latitude}</p>
                <p><span>Hemispheres:</span> <br />{hemisphere[0]} / {hemisphere[1]}</p>
            </div>
        );
    }
}

export default CountryDetails;

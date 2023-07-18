import React from "react";

function ProductCard({ name, model, make, location }) {

    return (
        <li className="cards__item">
            <div className="card">
                <div className="card__content">
                    <div className="card__title">Product Model: {model}</div>
                    <p className="card__text">Name: {name}</p>
                    <p className="card__text">Manufacturer: {make}</p>
                    <p className="card__text">Available Locations: {location}</p>

                </div>
            </div>
        </li>
    )
}

export default ProductCard;
import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ id, name, model, make, location }) {

    // function handleClick (){
    //     <Link to={`/equipment/${id}`}></Link>
    // }

    return (
        <li className="cards__item">
            <div className="card">
            <Link to={`/equipment/${id}`}>
                <div className="card__content">
                    <div className="card__title">Product Model: {model}</div>
                    <p className="card__text">Name: {name}</p>
                    <p className="card__text">Manufacturer: {make}</p>
                    <p className="card__text">Available Locations: {location}</p>
                </div>
             </Link>
            </div>
        </li>
    )
}

export default ProductCard;


// The link should take you to a display page,
//Was suggested to use NavLink

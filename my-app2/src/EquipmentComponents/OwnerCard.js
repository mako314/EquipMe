import React from "react";
import { Link } from "react-router-dom";

function OwnerCard({ id, email, name, location, phone, equipmentArray, handleEdit, item}) {
    
    const equipmentNames = equipmentArray?.map((data) => {
        return data.make + " " + data.model + " - "
    })
    

    //test can likely delete below
    // console.log(item)

    return (
        <li className="cards__item">
            <div className="card">
            <Link to={`/equipment_owners/${id}`}>
                <div className="card__content">
                    <div className="card__title">Owner Name: {name}</div>
                    <p className="card__text">Owner Location: {location}</p>
                    <p className="card__text">Owner Phone Number: {phone}</p>
                    <p className="card__text">Owner Equipment Names: {equipmentNames}</p>
                    <p className="card__text">Owner Email: {email}</p>
                </div>
            </Link>
            <button onClick = {() => handleEdit(item)}>EDIT</button>
            </div>
        </li>
    )
}

export default OwnerCard;
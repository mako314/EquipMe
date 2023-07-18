import React from "react";

function OwnerCard({ email, name, location, phone, equipmentArray }) {

    const equipmentNames = equipmentArray?.map((data) => {
        return data.make + " " + data.model + " - "
    })

    return (
        <li className="cards__item">
            <div className="card">
                <div className="card__content">
                    <div className="card__title">Owner Name: {name}</div>
                    <p className="card__text">Owner Location: {location}</p>
                    <p className="card__text">Owner Phone Number: {phone}</p>
                    <p className="card__text">Owner Equipment Names: {equipmentNames}</p>
                    <p className="card__text">Owner Email: {email}</p>

                </div>
            </div>
        </li>
    )
}

export default OwnerCard;
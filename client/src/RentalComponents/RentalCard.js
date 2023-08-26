import React from "react";

function RentalCard({ equipmentName, rentalDates,renterFirstName, renterLastName }) {


    return (
        <li className="cards__item">
            <div className="card">
                <div className="card__content">
                    <div className="card__title">Equipment Name: {equipmentName} </div>
                    <p className="card__text">Rental Dates: {rentalDates}</p>
                    <p className="card__text">Renter Name: {renterFirstName}  {renterLastName}</p>

                </div>
            </div>
        </li>
    )
}

export default RentalCard;
import React from "react";

function RentalCard({ equipmentName, rentalDates, renterName }) {


    return (
        <li className="">
            <div className="">
                <div className="">
                    <div className="">Equipment Name: {equipmentName} </div>
                    <p className="">Rental Dates: {rentalDates}</p>
                    <p className="">Renter Name: {renterName}</p>

                </div>
            </div>
        </li>
    )
}

export default RentalCard;
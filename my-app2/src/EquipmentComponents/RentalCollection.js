import React, { useState, useEffect } from "react";
import RentalCard from "./RentalCard"

function RentalCollection({ }) {
    const [rentalAgreementArray, setRentalAgreementArray] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5555/rental_agreements")
            .then((resp) => resp.json())
            .then((data) => {
                setRentalAgreementArray(data)
            })
    }, [])

    const rentalCards = rentalAgreementArray?.map((item) => {
        return <RentalCard key={item.id} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterName={item.renter.name} />
    })

    return (<div className="cards">
        {rentalCards}
    </div>)
}

export default RentalCollection;
import React, { useState, useEffect } from "react";
import RentalCard from "./RentalCard"

function RentalCollection({ }) {
    const [rentalAgreementArray, setRentalAgreementArray] = useState([])

    useEffect(() => {
        fetch("/rental_agreements")
            .then((resp) => resp.json())
            .then((data) => {
                setRentalAgreementArray(data)
            })
    }, [])
    console.log(rentalAgreementArray)

    const rentalCards = rentalAgreementArray?.map((item) => {
        console.log(item)
        if(item && item.equipment && item.renter){
        return <RentalCard key={item.id} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterName={item.renter.name} />
        }
    })

    return (<div className="cards">
        {rentalCards}
    </div>)
}

export default RentalCollection;
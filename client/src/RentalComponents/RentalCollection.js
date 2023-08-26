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
    

    const rentalCards = rentalAgreementArray?.map((item) => {
        console.log(item)
        if(item && item.equipment && item.user){
        return (<RentalCard key={item.id} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterFirstName={item.user.firstName} renterLastName={item.user.lastName}/> )
        }
    })

    // let rentalCards

    // rentalCards = rentalAgreementArray.map((item) => {
    //     console.log(item)
    //     // return(item.equipment.name)
    //     return (<RentalCard key={item.id} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterFirstName={item.user.firstName} renterLastName={item.user.lastName} />)
    // })

    console.log(rentalCards)

    return (
    <div>
        TESTING TESTING
        {rentalCards}
    </div>
    )
}

export default RentalCollection;
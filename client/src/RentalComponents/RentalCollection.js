import React, { useState, useContext, useEffect } from "react";
import RentalCard from "./RentalCard"
import UserContext from "../UserComponents/UserContext";

function RentalCollection({ }) {
    const [rentalAgreementArray, setRentalAgreementArray] = useState([])
    const [user, setUser] = useContext(UserContext)

    useEffect(() => {
        fetch("/rental_agreements")
            .then((resp) => resp.json())
            .then((data) => {
                setRentalAgreementArray(data)
            })
    }, [])

    //Check if user is logged in, I may just make this context and wrap it around my whole app too.
    useEffect(() => {
        fetch("/check_session").then((response) => {
          if (response.ok) {
            response.json().then((user) => setUser(user));
          }
        });
      }, []);
    
    

    const rentalCards = rentalAgreementArray?.map((item) => {
        console.log(item)
        if(item && item.equipment && item.user){
        return (<RentalCard key={item.id} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterFirstName={item.user.firstName} renterLastName={item.user.lastName}/> )
        }
    })

    let UserRentalCards

    if (user){
    UserRentalCards = rentalAgreementArray.filter((item) => item.user.id === user.id).map((item) => (
    <RentalCard
      key={item.id}
      equipmentName={item.equipment.name}
      rentalDates={item.rental_dates}
      renterFirstName={item.user.firstName}
      renterLastName={item.user.lastName}
    />
  ))}
    
    console.log(user)
    console.log(UserRentalCards)

    // let rentalCards

    // rentalCards = rentalAgreementArray.map((item) => {
    //     console.log(item)
    //     // return(item.equipment.name)
    //     return (<RentalCard key={item.id} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterFirstName={item.user.firstName} renterLastName={item.user.lastName} />)
    // })

    // console.log(rentalCards)

    return (
    <div>
        TESTING TESTING
        {UserRentalCards}
    </div>
    )
}

export default RentalCollection;
import React, { useState, useContext, useEffect } from "react";
import RentalAgreementCard from "./RentalAgreementCard"
import UserContext from "../UserComponents/UserContext";
import ApiUrlContext from "../Api";
import { UserSessionContext } from "../UserComponents/SessionContext";

function RentalAgreementsCollection({ }) {
    const { currentUser, role} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)
    console.log(currentUser)
    // Map over fetched rental data and make them into cards. This is ALL rental agreements.
    // const rentalCards = rentalAgreementArray?.map((item) => {
    //     console.log(item)
    //     if(item && item.equipment && item.user){
    //     return (<RentalCard key={item.id} item={item} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterFirstName={item.user.firstName} renterLastName={item.user.lastName}/> )
    //     }
    // })

  // console.log(currentUser.cart[0].cart_item[0].agreements)


  // Need to find a way to map over an array that's nested inside of an array.
  //Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
  //Luckily with flatmap, everything was available!
 
  let rentalCards = currentUser.cart?.flatMap(cart => 
    cart.cart_item?.flatMap(item => 
      item.agreements?.map(agreement=>
      <RentalAgreementCard
      key={item.id}
      cartName={cart.cart_name}
      equipmentName={item.equipment.name}
      rentalStart={agreement.rental_start_date}
      rentalEnd={agreement.rental_end_date}
      renterFirstName={currentUser.firstName}
      renterLastName={currentUser.lastName}
      location={item.equipment.location}
      ownerEmail ={item.equipment.owner.email}
      ownerFirstName = {item.equipment.owner.firstName}
      ownerLastName ={item.equipment.owner.lastName}
      />
        ) || []
      ) || []
  )

  // if (Array.isArray(cart.cart_item)) {
  //   return cart.cart_item.map(item => console.log(item.agreements.rental_start_date))

  // console.log("The rental cards",rentalCards)

    return (
    <div>
        {rentalCards}
    </div>
    )
}

export default RentalAgreementsCollection;
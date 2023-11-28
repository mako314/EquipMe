import React, { useState, useContext, useEffect } from "react";
import RentalAgreementCard from "./RentalAgreementCard"
import UserContext from "../UserComponents/UserContext";
import ApiUrlContext from "../Api";
import { UserSessionContext } from "../UserComponents/SessionContext";

function RentalAgreementsCollection({ }) {
    const { currentUser, role} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)
    console.log(currentUser)

  const formatDate = (date) => {
    // Was having a lot of issues and couldn't tell where from, so I wrote some validations to test what could be going wrong
    let newDate = new Date(date)
    if (!(newDate instanceof Date)) {
      console.error('Invalid date provided to formatDate:', newDate)
      return null
    }
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    let options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
      hour12: true
    }

    return newDate.toLocaleDateString('en-US', options)
  }


  // Need to find a way to map over an array that's nested inside of an array.
  //Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
  //Luckily with flatmap, everything was available!
 
  let rentalCards = currentUser.cart?.flatMap(cart => 
    cart.cart_item?.flatMap(item => 
      item.agreements?.map(agreement=>
      <RentalAgreementCard
      key={item.id}
      cartName={cart.cart_name}
      quantity={item.quantity}
      equipmentName={item.equipment.name}
      rentalStart={formatDate(agreement.rental_start_date)}
      rentalEnd={formatDate(agreement.rental_end_date)}
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
    <div className="flex flex-row flex-wrap justify-start ml-6">
        {rentalCards}
    </div>
    )
}

export default RentalAgreementsCollection;
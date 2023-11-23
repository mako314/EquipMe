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



 
  // let rentalCards = currentUser.cart?.flatMap(cart => {
  //   if (Array.isArray(cart)) {
  //     return cart.cart_item.map(item => item.agreements)
  //   } else {
  //     console.log('cart is not an array:', cart)
  //     return []  // Return an empty array if it's not an array
  //   }
  // })

  // console.log("The rental cards",rentalCards)



  //   // Filters the rental agreements based on whether or not the signed in Users ID matches the userID of the rental agreement.
  //   let UserRentalCards
  //   if (user){
  //   UserRentalCards = rentalAgreementArray?.filter((item) => item.user.id === user.id)?.map((item) => (
  //   <RentalCard
  //     key={item.id}
  //     equipmentName={item.equipment.name}
  //     rentalDates={item.rental_dates}
  //     renterFirstName={item.user.firstName}
  //     renterLastName={item.user.lastName}
  //     location={item.equipment.location}
  //     ownerEmail ={item.equipment.email}
  //     ownerName = {item.equipment.owner_name}
  //   />
  // ))}
    
  //   console.log(user)
  //   console.log(UserRentalCards)

    // let rentalCards

    // rentalCards = rentalAgreementArray.map((item) => {
    //     console.log(item)
    //     // return(item.equipment.name)
    //     return (<RentalAgreementCard key={item.id} equipmentName={item.equipment.name} rentalDates={item.rental_dates} renterFirstName={item.user.firstName} renterLastName={item.user.lastName} />)
    // })

    // console.log(rentalCards)

    return (
    <div>
        {/* {UserRentalCards} */}
    </div>
    )
}

export default RentalAgreementsCollection;
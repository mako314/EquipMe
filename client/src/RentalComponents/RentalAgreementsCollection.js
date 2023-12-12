import React, { useState, useContext, useEffect } from "react";
import RentalAgreementCard from "./RentalAgreementCard"
import UserContext from "../UserComponents/UserContext";
import ApiUrlContext from "../Api";
import { UserSessionContext } from "../UserComponents/SessionContext";

function RentalAgreementsCollection({ setFromOwnerDash, fromOwnerDash, agreementFiltering}) {
    const { currentUser, role} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)
    const [sortedCards, setSortedCards] = useState([])
    console.log(currentUser)

  //This formatdate function takes the created_at and updated_at dates and changes them into a much simpler format. This reads like the following:

  // Created At: Dec 8, 2023, 07:00:00 PM
  // Updated At: Dec 8, 2023, 07:00:00 PM

  const formatDate = (date) => {
    // Was having a lot of issues and couldn't tell where from, so I wrote some validations to test what could be going wrong
    let newDate = new Date(date)
    // if not an instance of date, return null, but it should always be a date instance because of the newDate creation above
    if (!(newDate instanceof Date)) {
      console.error('Invalid date provided to formatDate:', newDate)
      return null
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    // Use options found inside of the above
    let options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
      hour12: true
    }

    return newDate.toLocaleDateString('en-US', options)
  }

  // userSortOption, checks whether newest is selected, only other option here is oldest, and sorts by that
  let userSortOption = agreementFiltering === 'newest' ?
  ((a, b) => new Date(b.created_at) - new Date(a.created_at)) : // Newest first
  ((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Oldest first

  //useEffect to track the agreementFiltering 
  useEffect(() => {
    // Flatten the agreements into a single array, I needed the cart, the cart_item for quantity etc, when everything is flattened, spread it into allAgreements
    const allAgreements = role === 'user' ? (currentUser?.cart ?? []).flatMap(cart => 
      (cart.cart_item ?? []).flatMap(item => 
        (item.agreements ?? []).map(agreement => ({
          ...agreement,
          cartName: cart.cart_name,
          item,
        }))
      )
    ) : currentUser.agreements.map(agreement => ({
      ...agreement,
    }))
  
    // Sort all agreements based on the selected option
    const sortedAgreements = allAgreements?.sort(userSortOption)
  
    // Map over sorted agreements to create the cards

    // Need to find a way to map over an array that's nested inside of an array.
    //Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
    //Luckily with flatmap, everything was available!
    
    const cards = sortedAgreements?.map(agreement => (
      role === 'user' ? (
        <RentalAgreementCard
          key={`${agreement.id}-${agreement.created_at}`} // Unique key based on ID and created_at
          rentalId={agreement.item.id}
          cartName={agreement.cart_name}
          quantity={agreement.item.quantity}
          equipmentName={agreement.item.equipment.name}
          rentalStart={formatDate(agreement.rental_start_date)}
          rentalEnd={formatDate(agreement.rental_end_date)}
          rentalDelivery={agreement.delivery}
          rentalDeliveryAddress={agreement.delivery_address}
          rentalRevisions={agreement.revisions}
          rentalStatus={agreement.agreement_status}
          rentalCreatedAt={agreement.created_at}
          rentalUpdatedAt={agreement.updated_at}
          renterFirstName={currentUser.firstName}
          renterLastName={currentUser.lastName}
          renterId={currentUser.id}
          location={agreement.item.equipment.location}
          ownerEmail={agreement.item.equipment.owner.email}
          ownerFirstName={agreement.item.equipment.owner.firstName}
          ownerLastName={agreement.item.equipment.owner.lastName}
          ownerId={agreement.item.equipment.owner.id}
          setFromOwnerDash={setFromOwnerDash}
          fromOwnerDash={fromOwnerDash}
          existingReviews={agreement.review}
        />
      ) : (
      <RentalAgreementCard
        key={agreement.id}
        rentalId={agreement.id}
        cartName={agreement.cart_item.cart.cart_name}
        quantity={agreement.cart_item.quantity}
        equipmentName={agreement.cart_item.equipment.name}
        rentalStart={formatDate(agreement.rental_start_date)}
        rentalEnd={formatDate(agreement.rental_end_date)}
        rentalDelivery={agreement.delivery}
        rentalDeliveryAddress={agreement.delivery_address}
        rentalRevisions={agreement.revisions}
        rentalStatus={agreement.agreement_status}
        rentalCreatedAt={agreement.created_at}
        rentalUpdatedAt={agreement.updated_at}
        renterFirstName={agreement.cart_item.cart.user.firstName}
        renterLastName={agreement.cart_item.cart.user.lastName}
        renterId = {agreement.cart_item.cart.user.id}
        location={currentUser.location}
        ownerEmail ={currentUser.email}
        ownerFirstName = {currentUser.firstName}
        ownerLastName ={currentUser.lastName}
        ownerId = {currentUser.id}
        setFromOwnerDash={setFromOwnerDash} 
        fromOwnerDash={fromOwnerDash}
        existingReviews={agreement.review}
      />
      )
  ))
  
    // Update state to cause re-render
    setSortedCards(cards)
  
  }, [currentUser, agreementFiltering])
  
  // let rentalCards
  // // Need to find a way to map over an array that's nested inside of an array.
  // //Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
  // //Luckily with flatmap, everything was available!
  // // OLD
  // // rentalCards = currentUser?.cart?.flatMap(cart => 
  // //   cart.cart_item?.flatMap(item => 
  // //     item.agreements?.map(agreement=>

  // if (role === 'user'){
  // rentalCards = (currentUser?.cart ?? []).flatMap(cart => 
  //   cart.cart_item?.flatMap(item => 
  //     [...(item.agreements ?? [])].sort(userSortOption)
  //     .map(agreement =>
  //     <RentalAgreementCard
  //     key={item.id}
  //     rentalId={item.id}
  //     cartName={cart.cart_name}
  //     quantity={item.quantity}
  //     equipmentName={item.equipment.name}
  //     rentalStart={formatDate(agreement.rental_start_date)}
  //     rentalEnd={formatDate(agreement.rental_end_date)}
  //     rentalDelivery={agreement.delivery}
  //     rentalDeliveryAddress={agreement.delivery_address}
  //     rentalRevisions={agreement.revisions}
  //     rentalStatus={agreement.agreement_status}
  //     rentalCreatedAt={agreement.created_at}
  //     rentalUpdatedAt={agreement.updated_at}
  //     renterFirstName={currentUser.firstName}
  //     renterLastName={currentUser.lastName}
  //     renterId = {currentUser.id}
  //     location={item.equipment.location}
  //     ownerEmail ={item.equipment.owner.email}
  //     ownerFirstName = {item.equipment.owner.firstName}
  //     ownerLastName ={item.equipment.owner.lastName}
  //     ownerId = {item.equipment.owner.id}
  //     setFromOwnerDash={setFromOwnerDash} 
  //     fromOwnerDash={fromOwnerDash}
  //     existingReviews={agreement.review}
  //     />
  //       ) || []
  //     ) || []
  // )} else {
  //   rentalCards = currentUser?.agreements?.map(agreement => 
  //     <RentalAgreementCard
  //     key={agreement.id}
  //     rentalId={agreement.id}
  //     cartName={agreement.cart_item.cart.cart_name}
  //     quantity={agreement.cart_item.quantity}
  //     equipmentName={agreement.cart_item.equipment.name}
  //     rentalStart={formatDate(agreement.rental_start_date)}
  //     rentalEnd={formatDate(agreement.rental_end_date)}
  //     rentalDelivery={agreement.delivery}
  //     rentalDeliveryAddress={agreement.delivery_address}
  //     rentalRevisions={agreement.revisions}
  //     rentalStatus={agreement.agreement_status}
  //     rentalCreatedAt={agreement.created_at}
  //     rentalUpdatedAt={agreement.updated_at}
  //     renterFirstName={agreement.cart_item.cart.user.firstName}
  //     renterLastName={agreement.cart_item.cart.user.lastName}
  //     renterId = {agreement.cart_item.cart.user.id}
  //     location={currentUser.location}
  //     ownerEmail ={currentUser.email}
  //     ownerFirstName = {currentUser.firstName}
  //     ownerLastName ={currentUser.lastName}
  //     ownerId = {currentUser.id}
  //     setFromOwnerDash={setFromOwnerDash} 
  //     fromOwnerDash={fromOwnerDash}
  //     existingReviews={agreement.review}
  //     />
  //     )
  // }

  // rentalCards.sort(userSortOption)

    return (
    <div className="flex flex-row flex-wrap justify-start ml-6">
        {sortedCards}
    </div>
    )
}

export default RentalAgreementsCollection;
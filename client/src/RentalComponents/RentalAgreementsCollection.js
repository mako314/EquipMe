import React, { useState, useContext, useEffect } from "react";
import RentalAgreementCard from "./RentalAgreementCard"
import UserContext from "../UserComponents/UserContext";
import ApiUrlContext from "../Api";
import { UserSessionContext } from "../UserComponents/SessionContext";

function RentalAgreementsCollection({ setFromOwnerDash, fromOwnerDash}) {
    const { currentUser, role} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)
    const [sortedCards, setSortedCards] = useState([])
    const [agreementFiltering, setAgreementFiltering] = useState('newest')
    const [filterKeyWord, setFilterKeyWord] = useState('none')

  // console.log(filterKeyWord)
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
  
  // Make sure to incorporate a radio button or some sort of filtering ,capture it with a const function, and then delcare the if in line 63
  const handleRadioChange = (event) => {
    setFilterKeyWord(event.target.value)
  }

  // https://stackoverflow.com/questions/72193794/how-to-sort-array-of-objects-by-date-but-with-most-current-date-first
  // https://stackoverflow.com/questions/72191289/sort-objects-by-datetime-in-javascript
  // https://stackoverflow.com/questions/68136203/how-to-use-javascript-sort-to-order-by-year-month-day
  // https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
  // userSortOption, checks whether newest is selected, only other option here is oldest, and sorts by that
  let userSortOption = agreementFiltering === 'newest' ?
  ((a, b) => new Date(b.created_at) - new Date(a.created_at)) : // Newest first
  ((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Oldest first

  //useEffect to track the agreementFiltering 
  useEffect(() => {

    // take an agreement and filter it, it's called on all agreements which is an array with the agreement data we need. It's been flatmapped twice if it's a user, and then mapped over for the data we need. We compare it with the selected filter key word, which is decided by the radio buttons and compared with agreement_status of the agreement.
    const filterAgreementsByStatus = (agreement) => {
      // console.log("Agreement status: ", agreement.agreement_status, "Filter keyword: ", filterKeyWord)
      return filterKeyWord ? agreement.agreement_status === filterKeyWord : true
    }

    // const filterAgreementsByName = (agreement) => {
    //   console.log("Agreement status: ", agreement.agreement_status, "Filter keyword: ", filterKeyWord)
    //   return filterKeyWord ? agreement.agreement_status === filterKeyWord : true
    // }

    // Flatten the agreements into a single array, I needed the cart, the cart_item for quantity etc, when everything is flattened, spread it into allAgreements
    let allAgreements = role === 'user' ? (currentUser?.cart ?? []).flatMap(cart => 
      (cart.cart_item ?? []).flatMap(item => 
        (item.agreements ?? []).map(agreement => ({
          ...agreement,
          cartName: cart.cart_name,
          item,
        }))
      )
    ) :  currentUser.agreements.map(agreement => ({
      ...agreement,
    }))


    // Check agreements before filtering
    // console.log("Agreements before filtering:", allAgreements) 

    //If filterKeyWord exists and is not equal to none, go ahead and filter with the function 
    if (filterKeyWord && filterKeyWord !== 'none') {
      // Check agreements after filtering
      // console.log("Agreements after filtering:", allAgreements) 
      allAgreements = allAgreements.filter(filterAgreementsByStatus)
    }

    // if (filterKeyWord && filterKeyWord !== 'none') {
    //   // Check agreements after filtering
    //   console.log("Agreements after filtering:", allAgreements) 
    //   allAgreements = allAgreements.filter(filterAgreements)
    // }

  


    // Sort the ( possibly filtered) agreements. Agreements are always sorted regardless if filtering occurs or not.
    const sortedAgreements = allAgreements.sort(userSortOption)
    // console.log("Sorted agreements:", sortedAgreements)

    // Map over sorted agreements to create the cards
    // Need to find a way to map over an array that's nested inside of an array.
    //Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
    //Luckily with flatmap, everything was available!
    const cards = sortedAgreements?.map(agreement => (
      role === 'user' ? (
        <RentalAgreementCard
          key={`${agreement?.id}-${agreement?.created_at}`} // Unique key based on ID and created_at
          rentalId={agreement?.id}
          cartName={agreement?.cart_name}
          quantity={agreement?.item.quantity}
          equipmentName={agreement?.item?.equipment?.name}
          equipmentModel={agreement?.item?.equipment?.model}
          equipmentMake={agreement?.item?.equipment?.make}
          rentalStart={formatDate(agreement?.rental_start_date)}
          rentalEnd={formatDate(agreement?.rental_end_date)}
          rentalDelivery={agreement?.delivery}
          rentalDeliveryAddress={agreement?.delivery_address}
          rentalRevisions={agreement?.revisions}
          rentalStatus={agreement?.agreement_status}
          rentalCreatedAt={agreement?.created_at}
          rentalUpdatedAt={agreement?.updated_at}
          renterFirstName={currentUser?.firstName}
          renterLastName={currentUser?.lastName}
          renterId={currentUser?.id}
          state={agreement?.item?.equipment?.state }
          city={agreement?.item?.equipment?.city }
          address={agreement?.item?.equipment?.address }
          address_line_2={agreement?.item?.equipment?.address_line_2 }
          postal_code={agreement?.item?.equipment?.postal_code}
          ownerEmail={agreement?.item?.equipment?.owner?.email}
          ownerFirstName={agreement?.item?.equipment?.owner?.firstName}
          ownerLastName={agreement?.item?.equipment?.owner?.lastName}
          ownerId={agreement?.item?.equipment?.owner.id}
          setFromOwnerDash={setFromOwnerDash}
          fromOwnerDash={fromOwnerDash}
          existingReviews={agreement.review}
        />
      ) : (
      <RentalAgreementCard
        key={agreement?.id}
        rentalId={agreement?.id}
        cartName={agreement?.cart_item?.cart?.cart_name}
        quantity={agreement?.cart_item?.quantity}
        equipmentName={agreement?.cart_item?.equipment?.name}
        equipmentModel={agreement?.cart_item?.equipment?.model}
        equipmentMake={agreement?.cart_item?.equipment?.make}
        rentalStart={formatDate(agreement?.rental_start_date)}
        rentalEnd={formatDate(agreement?.rental_end_date)}
        rentalDelivery={agreement?.delivery}
        rentalDeliveryAddress={agreement?.delivery_address}
        rentalRevisions={agreement?.revisions}
        rentalStatus={agreement?.agreement_status}
        rentalCreatedAt={agreement?.created_at}
        rentalUpdatedAt={agreement?.updated_at}
        renterFirstName={agreement?.cart_item.cart.user.firstName}
        renterLastName={agreement?.cart_item.cart.user.lastName}
        renterId = {agreement?.cart_item?.cart.user?.id}
        state={currentUser?.state}
        city={currentUser?.city}
        address={currentUser?.address}
        address_line_2={currentUser?.address_line_2}
        postal_code={currentUser?.postal_code}
        ownerEmail ={currentUser?.email}
        ownerFirstName = {currentUser?.firstName}
        ownerLastName ={currentUser?.lastName}
        ownerId = {currentUser?.id}
        setFromOwnerDash={setFromOwnerDash} 
        fromOwnerDash={fromOwnerDash}
        existingReviews={agreement.review}
      />
      )
  ))
    // Update state to cause re-render
    setSortedCards(cards)
      //Refires whenever current user changes, agreementFiltering(prop brought in from the parent to decide what you're filtering by) and key word
  }, [currentUser, agreementFiltering, filterKeyWord])

  const handleAgreementSelection = (event) => {
    // console.log('Selected value:', event.target.value)
    setAgreementFiltering(event.target.value)
  }

    return (
      <div className="ml-6">
        <select 
                className="block appearance-none w-auto bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 my-2"
                value={agreementFiltering}
                onChange={handleAgreementSelection}
            >
                <option value="" disabled>--Please choose an option--</option>
                <option name="newest_option" value="newest" id="newest">Newest First</option>
                <option name="oldest_option" value="oldest" id="oldest">Oldest First</option>
        </select>

        {/* Form that holds radio buttons for filter keyword */}
        <form className="flex flex-row items-center mb-4">
        <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value='none' 
              id="none" 
              onChange={handleRadioChange} 
              checked={filterKeyWord === 'none'}
            />
            <label htmlFor="none" className="ml-2 text-gray-700">None</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value='owner-accepted' 
              id="owner-accepted" 
              onChange={handleRadioChange} 
              checked={filterKeyWord === 'owner-accepted'}
            />
            <label htmlFor="owner-accepted" className="ml-2 text-gray-700">Owner Accepted</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value="user-accepted" 
              id="user-accepted" 
              onChange={handleRadioChange} 
              checked={filterKeyWord === 'user-accepted'}
            />
            <label htmlFor="user-accepted" className="ml-2 text-gray-700">User Accepted</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value="in-progress" 
              id="in-progress" 
              onChange={handleRadioChange} 
              checked={filterKeyWord === 'in-progress'}
            />
            <label htmlFor="in-progress" className="ml-2 text-gray-700">In-Progress</label>
          </div>

          <div className="flex items-center mr-2">
            <input 
              type="radio" 
              className="form-radio h-5 w-5 text-gray-600" 
              name="fav_option" 
              value="completed" 
              id="completed" 
              onChange={handleRadioChange} 
              checked={filterKeyWord === 'completed'}
            />
            <label htmlFor="completed" className="ml-2 text-gray-700">Completed</label>
          </div>

        </form>

        
  
  <div className="flex flex-row flex-wrap justify-start"> 
    {sortedCards?.length > 0 ? sortedCards : currentUser?.equipment?.length > 0 ? (
                <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
                    <img
                        src="https://www.kaser-albehar.com/wp-content/uploads/2018/10/110819093004-1.jpg"
                        alt="More Heavy Equipment just Sitting Out"
                        className="max-w-xs md:max-w-sm lg:max-w-md mb-4 rounded-lg shadow-lg"
                    />
                    <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 font-semibold">
                      There are currently no rental agreements formed, try getting touch with users or sending them a link to reserve your equipment!
                    </p>
                </div>
            ): (
                <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
                    <img
                        src="https://www.kaser-albehar.com/wp-content/uploads/2018/10/110819093004-1.jpg"
                        alt="More Heavy Equipment just Sitting Out"
                        className="max-w-xs md:max-w-sm lg:max-w-md mb-4 rounded-lg shadow-lg"
                    />
                    <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 font-semibold">
                      Once you've uploaded Equipment that's available to be rented, You'll be able to view and handle your rental agreements here!
                    </p>
                </div>
            )}
  </div>
  </div>
    )
}

export default RentalAgreementsCollection;




//Need to find a way to map over an array that's nested inside of an array.
//Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
//Luckily with flatmap, everything was available!

import React, {useState, Fragment } from 'react';

function AgreementFiltering({currentUser, role}) {
    // https://stackoverflow.com/questions/72193794/how-to-sort-array-of-objects-by-date-but-with-most-current-date-first
    // https://stackoverflow.com/questions/72191289/sort-objects-by-datetime-in-javascript
    // https://stackoverflow.com/questions/68136203/how-to-use-javascript-sort-to-order-by-year-month-day
    // https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property

    // console.log("CURRENT USER IN AGREEMENT FILTERING:", currentUser.cart)

    const [agreementFiltering, setAgreementFiltering] = useState('newest')

    // Set variable for date sorting for the OWNER roles
    let agreementsForDateSorting = Array.isArray(currentUser?.agreements) ? [...currentUser.agreements] : []

    // Same variable as above, but it's for date sorting for the USER roles
    let userAgreementsForDateSorting = []
    
    if (role === 'user'){
     const flatMappedUserAgreement = currentUser?.cart?.flatMap(item => {
        // console.log('FULL ITEM:', item) 
        return item.cart_item?.map(cartItem  => {
            // console.log('Cart Item:', cartItem) 
            return cartItem.agreements.map(agreement => { 
                // console.log('Agreement:', agreement) 
            return {
                id : agreement.id,
                agreement_status: agreement.agreement_status,
                user_decision: agreement.user_decision,
                owner_decision: agreement.owner_decision,
                created_at: agreement.created_at,
                ownerFirstName: cartItem?.equipment.owner?.firstName,
                ownerLastName:  cartItem?.equipment.owner?.lastName,
            }
            })
        })
    }) || []

    userAgreementsForDateSorting = flatMappedUserAgreement.flatMap(item => item)
}

    // I couldn't do this directly inside of the sorting stuff for some reason, so I opted to make a const here and do it here
    const conditionalAgreementData = role === 'owner' ? [...agreementsForDateSorting] : [...userAgreementsForDateSorting]


    

        // return {
        //     agreements: itemsInCart.agreements,
        //     agreement_status: itemsInCart.agreements.agreement_status,
        //     ownerFirstName: itemsInCart?.equipment.owner?.firstName,
        //     ownerLastName:  itemsInCart?.equipment.owner?.firstName
        // }

    // console.log("USER AGREEMENTS:", flatMappedUserAgreement)
    // console.log("HOPEFULLY FLATENNED MAP:",  userAgreementsForDateSorting)
    

    const formatDateToLocalTimezone = (utcDateTimeString) => {
        // Create a date object for the UTC time
        const utcDate = new Date(utcDateTimeString)
      
        // Get the user's local time offset in hours from UTC
        const localTimeOffsetInHours = utcDate.getTimezoneOffset() / -60
      
        // Convert the date to the local timezone by adding the timezone offset
        // adjust the hours of the UTC date using setHours() by adding the local time offset
        const localDate = new Date(utcDate.setHours(utcDate.getHours() + localTimeOffsetInHours))
      
        // Use toLocaleString to format the date in the local time zone
        const options = {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        }
      
        // Format the date in a more readable format
        return localDate.toLocaleString('en-US', options)
      }

      const handleAgreementSelection = (event) => {
        // console.log('Selected value:', event.target.value)
        setAgreementFiltering(event.target.value)
    }

    // let userSortOption = (a, b) => new Date(a.created_at) - new Date(b.created_at)

    let sortedAscendingAgreements = conditionalAgreementData
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((agreement) => (
        <Fragment key={agreement.id}>
            <div className="w-full rounded overflow-hidden shadow-lg bg-white text-gray-800">
            <div className="px-6 py-4">

                <div className="font-bold text-xl mb-2">Agreement Details For: <br/>

                {role === 'owner' ?
                    <>
                        {agreement?.cart_item?.cart?.user?.firstName} {agreement?.cart_item?.cart.user?.lastName}
                    </> :

                    <>
                    {/* {console.log("trying to see",agreement)} */}
                    {agreement.ownerFirstName} {agreement.ownerLastName}
                    </> 
                }
                 
                
                
                </div>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">Created At:</span> 
                {/* {console.log("AGREEMENT INSIDE DATA:", agreement)} */}
                {formatDateToLocalTimezone(agreement.created_at)}
                </p>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">Agreement Status:</span> {agreement.agreement_status}
                </p>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">User Decision:</span> {agreement.user_decision}
                </p>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">Owner Decision:</span> {agreement.owner_decision}
                </p>
            </div>
        </div>
        </Fragment>
    ))


    let sortedDescendingAgreements = conditionalAgreementData
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((agreement) => (
        <Fragment key={agreement.id}>
        <div className="w-full rounded overflow-hidden shadow-lg bg-white text-gray-800">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Agreement Details For: <br/>
                {role === 'owner' ?
                    <>
                        {agreement?.cart_item?.cart?.user?.firstName} {agreement?.cart_item?.cart?.user?.lastName}
                    </> :

                    <>
                    {/* {console.log("trying to see",agreement)} */}
                    {agreement?.ownerFirstName} {agreement?.ownerLastName}
                    </> 
                }
                </div>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">Created At:</span> {formatDateToLocalTimezone(agreement.created_at)}
                </p>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">Agreement Status:</span> {agreement.agreement_status}
                </p>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">User Decision:</span> {agreement.user_decision}
                </p>
                <p className="text-gray-700 text-base">
                <span className="font-semibold">Owner Decision:</span> {agreement.owner_decision}
                </p>
            </div>
        </div>
    </Fragment>
    ))

    // let sortedTestingAscending = [...agreementsForDateSorting]
    // .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    // let sortedTestingDescending = [...agreementsForDateSorting]
    // .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
    // console.log("TESTING DESCENDING ORDER:", sortedTestingDescending)
    // console.log("TESTING ASCENDING ORDER:", sortedTestingAscending)

    if (sortedDescendingAgreements.length === 0 || sortedAscendingAgreements.length === 0){
        return (
            <div className="flex items-center justify-center h-full text-center text-gray-800">
                <p className="text-lg font-medium">No rental agreements have been formed yet!</p>
            </div>
        )
    }

    return(
        <>
            <div className="mb-4">
            <select 
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={agreementFiltering}
                onChange={handleAgreementSelection}
            >
                <option value="" disabled>--Please choose an option--</option>
                <option name="newest_option" value="newest" id="newest">Newest First</option>
                <option name="oldest_option" value="oldest" id="oldest">Oldest First</option>
            </select>
            {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.5 7l4.5 4.5L14.5 7z" />
                </svg>
            </div> */}
            </div>

            {agreementFiltering === 'newest' ? (
            sortedDescendingAgreements
            ) : (
            sortedAscendingAgreements
            )}

        </>
    )
}

export default AgreementFiltering
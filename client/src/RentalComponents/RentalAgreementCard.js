import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import SubmitReview from "../ReviewComponents/SubmitReview";

function RentalAgreementCard({ equipmentName, rentalId, rentalStart, rentalEnd, renterFirstName, renterLastName, city, state ,address, address_line_2, postal_code, ownerEmail, ownerFirstName, ownerLastName, cartName, quantity, rentalDelivery, rentalDeliveryAddress, rentalRevisions, rentalStatus,rentalCreatedAt, rentalUpdatedAt, setFromOwnerDash, fromOwnerDash, renterId, ownerId, existingReviews}) {
    
    const navigate = useNavigate()
    // May be a good idea to draw how exactly status should work, 
    // one side accepted, both, in progress, etc
    // console.log("The rental status:", rentalStatus)
    // console.log("The type of:", typeof(rentalDelivery))
    // console.log(item)

    // console.log("THE REVIEWS:",existingReviews)

    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const rentalAgreementLocation = `${address_line_2 === '' ? address + ', ' + address_line_2 : address}, ${city}, ${state} ${postal_code} `

    // console.log('OWNER ID:', ownerId)
    const rentalAgreementStatuses = ['in-progress', 'user-accepted', 'owner-accepted', 'Owner has DECLINED this agreement', 'User has DECLINED this agreement','both-accepted']

    // 'in-progress',
    const showHandleButton = rentalAgreementStatuses.includes(rentalStatus)

    const navigateToAgreementHandling = () => {
        // setFromOwnerDash(!fromOwnerDash)
        setFromOwnerDash(fromOwnerDash)
        navigate(`/handle/agreements/${rentalId}`, { state: { fromOwnerDash: fromOwnerDash} })
    }

    // const navigateToReviewHandling = () => {
    //     // setFromOwnerDash(!fromOwnerDash)
    //     setFromOwnerDash(!fromOwnerDash)
    //     navigate(`/handle/agreements/${rentalId}`)
    // }

    const toggleReviewModal = () => {
        setIsModalOpen(!isModalOpen)
        // console.log("Modal State: ", !isModalOpen)
    }


    //This is used to take the created_at and updated_at to become a more readable time in a users time zone
    const formatDateToLocalTimezone = (utcDateTimeString) => {
        // Create a date object for the UTC time
        const utcDate = new Date(utcDateTimeString)
      
        // Get the user's local time offset in hours from UTC
        // getTimezoneOffset() method returns the time zone difference, in minutes, from current locale (host system settings) to UTC. This value is positive if the local timezone is behind UTC and negative if it's ahead. Since getTimezoneOffset() returns the value with the opposite sign, we divide by -60 to get the offset in hours
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
      

    return (

            <div className="flex flex-col w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg mb-4 mt-3 mx-2">
                <div className="flex-grow"> 
        <div className="px-6 py-3 bg-gray-900 flex items-center">
            {/*  SVG for the cart icon  */}
            <svg aria-label="cart icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-cart4 ml-0" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
            <h2 className="text-lg font-semibold text-white mx-3">Cart: {cartName} <br></br>Item: {equipmentName} x {quantity}</h2>
        </div>

        <div className="px-6 py-4">
            <h1 className="text-xl font-semibold">{renterFirstName} {renterLastName}</h1>
            <p className="py-2">{rentalStart} to {rentalEnd}</p>
            
            {/*  Flex container for each detail line  */}
            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the truck icon  */}
                <svg aria-label="truck icon" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 0 24 24" >
                    <path d="M19.15 8a2 2 0 0 0-1.72-1H15V5a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 1 1.73 3.49 3.49 0 0 0 7 .27h3.1a3.48 3.48 0 0 0 6.9 0 2 2 0 0 0 2-2v-3a1.07 1.07 0 0 0-.14-.52zM15 9h2.43l1.8 3H15zM6.5 19A1.5 1.5 0 1 1 8 17.5 1.5 1.5 0 0 1 6.5 19zm10 0a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z"></path>
                </svg>
                <h3 className="text-sm px-2">{rentalDelivery === true ? `Scheduled for Delivery to ${rentalDeliveryAddress}` : "Delivery not Scheduled"}</h3>
            </div>
            
            {/*  Repeat the flex container for other details  */}
            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the owner icon  */}
                <svg aria-label="suitcase icon" className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 11H10V13H14V11Z"/><path fillRule="evenodd" clipRule="evenodd" d="M7 5V4C7 2.89545 7.89539 2 9 2H15C16.1046 2 17 2.89545 17 4V5H20C21.6569 5 23 6.34314 23 8V18C23 19.6569 21.6569 21 20 21H4C2.34314 21 1 19.6569 1 18V8C1 6.34314 2.34314 5 4 5H7ZM9 4H15V5H9V4ZM4 7C3.44775 7 3 7.44769 3 8V14H21V8C21 7.44769 20.5522 7 20 7H4ZM3 18V16H21V18C21 18.5523 20.5522 19 20 19H4C3.44775 19 3 18.5523 3 18Z"/>
                </svg>
                <h3 className="text-sm px-2">Owner: {ownerFirstName} {ownerLastName}</h3>
            </div>
            
            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the location pin icon  */}
                <svg aria-label="location pin icon" className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.063 10.063 6.27214 12.2721 6.27214C14.4813 6.27214 16.2721 8.063 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16757 11.1676 8.27214 12.2721 8.27214C13.3767 8.27214 14.2721 9.16757 14.2721 10.2721Z"/><path fillRule="evenodd" clipRule="evenodd" d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.3941 5.48178 3.79418C8.90918 0.194258 14.6059 0.0543983 18.2059 3.48179C21.8058 6.90919 21.9457 12.606 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.9732 6.93028 5.17326C9.59603 2.37332 14.0268 2.26454 16.8268 4.93029C19.6267 7.59604 19.7355 12.0269 17.0698 14.8268Z"/>
                </svg>
                <h3 className="text-sm px-2">{rentalAgreementLocation}</h3>
            </div>
            
            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the email icon  */}
                <svg aria-label="email icon" className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z"/>
                </svg>
                <h3 className="text-sm px-2">Email: {ownerEmail}</h3>
            </div>

            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the updated at icon  */}
                <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor"className="w-6 h-6 fill-current" viewBox="0 0 18 18">
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0"/>
                </svg>
                <h3 className="text-sm px-2">Created At: {formatDateToLocalTimezone(rentalCreatedAt)}</h3>
            </div>
            
            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the updated at icon  */}
                <svg aria-label="refresh icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path>
                </svg>
                <h3 className="text-sm px-2">Updated At: {formatDateToLocalTimezone(rentalUpdatedAt)}</h3>
            </div>
            
            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the revisions icon  */}
                <svg aria-label="pencil icon" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
                <h3 className="text-sm px-2">Revisions: {rentalRevisions}</h3>
            </div>
            
            <div className="flex items-center text-gray-700 my-2">
                {/*  SVG for the status icon  */}
                <svg aria-label="person checkmark icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 fill-current" viewBox="0 0 18 18">
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                </svg>
                <h3 className="text-sm px-2">Status: {rentalStatus}</h3>
            </div>

        </div>
        </div>
        {showHandleButton && fromOwnerDash && 
        <button className="inline-flex w-full h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={navigateToAgreementHandling}>
        Handle This Agreement
        </button>}

        {/* {fromOwnerDash && 
        <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={toggleModal}>
        RENTAL MODAL
        </button>} */}

        {rentalStatus === 'completed' && <SubmitReview toggleReviewModal={toggleReviewModal} isModalOpen={isModalOpen} rentalStatus={rentalStatus} renterId={renterId} ownerId={ownerId} rentalId={rentalId} renterFirstName={renterFirstName} renterLastName={renterLastName} ownerFirstName={ownerFirstName} ownerLastName={ownerLastName} existingReviews={existingReviews}/>
        }
    </div>
        
    )
}



export default RentalAgreementCard;
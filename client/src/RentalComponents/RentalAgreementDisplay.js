import React, {useState, useContext, useEffect} from "react"
import RentalAgreementCard from "./RentalAgreementCard";
import { UserSessionContext } from "../UserComponents/SessionContext";
import { CartAvailProviderContext } from "../CheckoutComponents/AvailToCheckoutContext";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import ApiUrlContext from "../Api";
import {toast} from 'react-toastify'

function RentalAgreementDisplay() {
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, checkSession} = UserSessionContext()
    
    const [rentalComment, setRentalComment] = useState("")
    const [currentAgreementIndex, setCurrentAgreementIndex] = useState(0)
    const [selectedDecision, setSelectedDecision] = useState('')
    const [isDelivery, setIsDelivery] = useState(false)
    const [deliveryChoice, setDeliveryChoice] = useState(null)
    const [isDeliveryAddress, setIsDeliveryAddress] = useState(false)
    const [deliveryAddress, setDeliveryAddress] = useState(false)
    const [toggleDelete, setToggleDelete] = useState(false)
    const [allRentalAgreementsState, setAllRentalAgreementsState] = useState(false)
    const { rental_agreement_id } = useParams()
    const { calculateReadyToCheckout } = CartAvailProviderContext()

    const navigate = useNavigate()
    const location = useLocation()
    const { fromOwnerDash } = location.state || {}

    // console.log("FROM OWNER DASH:?", fromOwnerDash)

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
    
    let rentalCardDisplay = []
    let allAgreements = []
    // console.log(rentalCardDisplay)
    let rentalCard
    // Need to find a way to map over an array that's nested inside of an array.
    //Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
    // Had to change USER to contain OWNER information for comments, changed USER to owner in this IF with user. The one under it was already properly done!
    //Luckily with flatmap, everything was available!

    useEffect(() => {
        setAllRentalAgreementsState(allAgreements)
    }, [currentUser])


    if (role === 'user'){
        (rentalCard = currentUser?.cart?.flatMap(cart => 
        cart.cart_item?.flatMap(item => 
        item.agreements?.map(agreement=>{
        rentalCard = (<RentalAgreementCard
        key={agreement.id}
        id={agreement.id}
        cartName={cart.cart_name}
        quantity={item.quantity}
        equipmentName={item.equipment.name}
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
        state={item.equipment.state}
        postal_code={item.equipment.postal_code}
        city={item.equipment.city}
        address={item.equipment.address}
        addressLine2={item.equipment.address_line_2}
        ownerEmail ={item.equipment.owner.email}
        ownerFirstName = {item.equipment.owner.firstName}
        ownerLastName ={item.equipment.owner.lastName}
        />)
        rentalCardDisplay.push(rentalCard)
        // console.log("LOOKING FOR OWNER",item.equipment.owner)
        // I CAN'T BELIEVE THIS TOOK ME SO FREAKING LONG TO NOTICE!!! SINCE IT WAS THE USER I WAS RETURNING THE SAME DARN USER WHEN IT'S THE CURRENT USER AT THE TIME! BUT INSTEAD I NEEDED TO RETURN OWNER HERE TO GET THE PROPER THING!
        const singleAgreement = agreement
        allAgreements.push({theAgreement : singleAgreement, owner: item.equipment.owner})

        }) || []
        ) || []
        ))} else {
        currentUser?.agreements?.map(agreement => {
        rentalCard = <div className="ml-16"><RentalAgreementCard
        key={agreement.id}
        id={agreement.id}
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
        state={currentUser.state}
        postal_code={currentUser.postal_code}
        city={currentUser.city}
        address={currentUser.address}
        addressLine2={currentUser.address_line_2}
        ownerEmail ={currentUser.email}
        ownerFirstName = {currentUser.firstName}
        ownerLastName ={currentUser.lastName}
        />  
        </div>
        rentalCardDisplay.push(rentalCard)
        const singleAgreement = agreement
        // console.log("LOOKING FOR USER", agreement.cart_item.cart.user)
        allAgreements.push({theAgreement : singleAgreement, user: agreement.cart_item.cart.user})
    })
    }

    // iterate over allAgreements and find the agreement within each theAgreement property, match it with useParams that was clicked on the card. 
   
    // const selectedAgreement = allRentalAgreementsState?.find(agreementObj => agreementObj.theAgreement.id.toString() === rental_agreement_id)?.theAgreement
    
    
    // console.log("THE TYPE OF allRentalAgreementsState.theAgreement:", typeof(allRentalAgreementsState))
    // console.log("THE RENTAL ID:", rental_agreement_id)
    // console.log("THE SELECTED AGREEMENT:",selectedAgreement)

    // https://www.w3schools.com/jsref/jsref_findindex.asp
    // Take what we just did with find, but we're only really looking for the index since we have all the agreement information anyway.
    // const selectedAgreementIndex = allRentalAgreementsState.findIndex(agreementObj => 
    //     agreementObj.theAgreement.id.toString() === rental_agreement_id
    // )
    // setCurrentAgreementIndex(selectedAgreementIndex)

    // if(selectedAgreementIndex){
    //  
    // }

    // Looping because issue where it causes an infinite loop

    useEffect(() => {
        if (Array.isArray(allRentalAgreementsState)) {
            const selectedAgreementIndex = allRentalAgreementsState.findIndex(agreementObj => 
                agreementObj.theAgreement.id.toString() === rental_agreement_id
            )

            // console.log("THE SELECTED AGREEMENT INDEX:", selectedAgreementIndex)

            if (selectedAgreementIndex !== -1) {
                setCurrentAgreementIndex(selectedAgreementIndex)
            }
        }
    }, [rental_agreement_id, allRentalAgreementsState])

    

    // console.log(currentUser)
    // console.log("RENTAL AGREEMENT ARRAY LENGTH:",allRentalAgreementsState)

    // console.log("The current rental card:", rentalCardDisplay[0])
    // console.log("currentUser agreements OWNER:", currentUser?.agreements[0])

    // console.log("TESTING allRentalAgreementsState CURRENTAGREEMENT INDEX USER AND OWNER:", allRentalAgreementsState[currentAgreementIndex])
    // console.log("TESTING allRentalAgreementsState CURRENTAGREEMENT INDEX USER AND OWNER:", allRentalAgreementsState[currentAgreementIndex])

    // if (role === 'owner'){
    //     otherUser = allRentalAgreementsState[currentAgreementIndex]?.user
    // } else if (role === 'user'){
    //     otherUser = allRentalAgreementsState[currentAgreementIndex]?.owner
    // }

    let otherUser = allRentalAgreementsState[currentAgreementIndex]?.user || allRentalAgreementsState[currentAgreementIndex]?.owner

    // console.log("Other USER:", otherUser)

    //So I decided to make an object be pushed into allRentalAgreementsState, that way I'll have access to user information too, and it'll be much cleaner. It's one rental agreement per, so I didn't need to grab the currentAgreementIndex for it. This puts out all the comments
    // const test = allRentalAgreementsState[currentAgreementIndex]?.theAgreement.comment?.map((item) => console.log("THE ITEMS INSIDE OF THIS", item))

    // I'm pretty sure what I had before would've worked, but I eventually needed to include origin. Initially I had a ternary that would test the user_id being present or owner_id being present, and in my seed file I was only sending one in. However since I have two types of users, both an owner and a regular user, I can have two IDS of 1. So the user_id can match the currentUser.id of 1, and it could be two different people. This is the reason I decided to include an origin. 

    // Also, when I was mapping:         allRentalAgreementsState.push({theAgreement : singleAgreement, owner: item.equipment.owner})
    // I had this as user: cart.user, this being the mapped rental agreements for user, meant I was just filling the array with more user information that was already available since they're the currently signed in user. However, I spotted it in time for my sanity, and realized that it was just the same user as the currently signed in user. It would be different for owner, because there I remembered to properly set it to grab the users information that is acquiring the rental agreement. 

    // Such a foolish mistake that took so long, but we learn and move on!

    const comments = allRentalAgreementsState[currentAgreementIndex]?.theAgreement.comment?.map((item) => {
        let profileImage, firstName, lastName
    
        if (item.user_id === currentUser.id && item.origin === role) {
            // Current user made the comment and has a role of USER
            profileImage = currentUser.profileImage
            firstName = currentUser.firstName
            lastName = currentUser.lastName
        } else if (item.owner_id === currentUser.id && item.origin === role) {
            // Current user made the comment and has a role of OWNER
            profileImage = currentUser.profileImage
            firstName = currentUser.firstName
            lastName = currentUser.lastName
        } else {
            // Comment made by someone else
            profileImage = otherUser?.profileImage
            firstName = otherUser?.firstName
            lastName = otherUser?.lastName
        }

        // console.log(profileImage)
    
        return (
            <div key={item.id} className="mb-6 w-full overflow-hidden bg-[#f2f2f7] p-8 rounded-sm border-b border-black">
                <div className="flex items-start mb-2">
                    <img src={profileImage} alt="" className="inline-block h-12 w-12 object-cover rounded-full mr-4"/>
                    <h5 className="text-xl font-bold mt-2">{firstName} {lastName}</h5>
                </div>
                <div className="flex items-start justify-between">
                    <p className="text-xl font-bold">Comment Created At: <br /> {item.created_at}</p>
                    <span> 👈👉 </span>
                    <p className="text-xl font-bold">Comment Updated At: <br /> {item.updated_at}</p>
                </div>
                <div className="w-full overflow-hidden mb-4 max-w-[640px] lg:max-w-[960px] mt-4">
                    <p className="max-[479px]:text-sm">{item.comment}</p>
                </div>
            </div>
        )
    })

    
    // console.log("All Agreements:", allRentalAgreementsState[currentAgreementIndex])
    // console.log("THE SPECIFIC AGREEMENT:", allRentalAgreementsState[currentAgreementIndex]?.theAgreement)
    
    // Handles the editing of the agreement, be it delivery address change, or changing the decision
    const handleAgreementEdit = () => {
        let decision = role === 'owner' ? 'owner_decision' : 'user_decision'
        let updatedAgreement

        // console.log("DELIVERY CHOICE:", deliveryChoice)
        // console.log("DELIVERY ADDRESS:", deliveryAddress)
        //Handle agreement submission
        if((deliveryChoice || deliveryChoice === true) && deliveryAddress){
        updatedAgreement = {
            [decision]: selectedDecision,
            delivery: deliveryChoice,
            delivery_address: deliveryAddress
        }}else if (deliveryChoice || deliveryChoice === false){
        updatedAgreement = {
            [decision]: selectedDecision,
            delivery: deliveryChoice,
        }}else if (deliveryAddress){
        updatedAgreement = {
            [decision]: selectedDecision,
            delivery_address: deliveryAddress
        }}else{
        updatedAgreement = {
            [decision]: selectedDecision,}
        }

        if(deliveryChoice === true && deliveryAddress === '' ){
            return toast.warn(`📆 It seems you've selected delivery, please submit a delivery address.`,
            {
            "autoClose" : 2000
            })
        } else if (selectedDecision === ''){
            return toast.warn(`📝 Please DECLINE or ACCEPT the rental agreement.`,
            {
            "autoClose" : 2000
            })
        }

        // console.log("THE AGREEMENT:",updatedAgreement)

        

        fetch(`${apiUrl}rental/agreements/${allRentalAgreementsState[currentAgreementIndex]?.theAgreement.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAgreement),
        }).then((resp) => {
            if (resp.ok) {
                // console.log(resp)
                if ((updatedAgreement.user_decision || updatedAgreement.owner_decision ) === 'accept'){
                toast.success(`📝 You've succesfully ACCEPTED ✅ this agreement! Once both parties have accepted you can proceed to checkout. `,
                {
                  "autoClose" : 6000
                })}
                if ((updatedAgreement.user_decision || updatedAgreement.owner_decision ) === 'decline'){
                toast.warn(`📝 You've DECLINED ❌ this agreement! Once both parties have accepted you can proceed to checkout. `,
                {
                    "autoClose" : 6000
                })}
                

                // Test if role is user, take the returned promise, and pass it to calculateReadyCartTotal for real time update on how many cart items available for checkout.
                if (role === 'user'){
                checkSession().then(updatedUserData => {
                    // console.log("THE CONDITIONAL RAN CART SHOULD UPDATE")
                    calculateReadyToCheckout(updatedUserData.cart)
                    
                  }).catch(error => {
                    console.error("Error in checkSession:", error)
                  })
                } else {
                    // or else just send a regular check session!
                    checkSession()
                }
                
                }
        })
    }

    
    //HANDLES POSTING A COMMENT, 
    const handleAddComment = (e) => {
        e.preventDefault()

    const newComment = {
        comment : rentalComment,
        user_id: role === 'user' ? currentUser?.id : allRentalAgreementsState[currentAgreementIndex]?.theAgreement.user_id,
        owner_id: role === 'owner' ? currentUser?.id : allRentalAgreementsState[currentAgreementIndex]?.theAgreement.owner_id,
        origin : role,
        agreement_id: allRentalAgreementsState[currentAgreementIndex]?.theAgreement.id
    }

    // console.log( "RENTAL COMMENT:", rentalComment)
    fetch(`${apiUrl}rental/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
    }).then((resp) => {
        if (resp.ok) {
            // console.log(resp)
            setRentalComment('')
            checkSession()
            toast.success(`✍ Successfully left a comment! `,
            {
              "autoClose" : 2000
            })
            // Going to do a spread operator thing 
        }
    })}

    // USEEFFECT FOR HAVING RIGHT ARROW NAD LEFT ARROW KEY trigger next and previous 
    useEffect(() => {
        const keyDownHandler = (e) => {
        if(e.key === 'ArrowRight'){
            goToNextAgreement()
        } else if(e.key === 'ArrowLeft'){
            goToPreviousAgreement()
        }}
        document.addEventListener("keydown", keyDownHandler)
        // console.log(`You pressed ${e.code}.`)

        // clean up
        return () => {
          document.removeEventListener("keydown", keyDownHandler)
        }
      }, [allRentalAgreementsState.length])


    // Go to next agreement,
    const goToNextAgreement = () => {
        //go to next agreement
        setCurrentAgreementIndex((prevIndex) =>
          prevIndex < allRentalAgreementsState.length - 1 ? prevIndex + 1 : 0
        )
        resetAgreementForm()
      }
    
    // Go to previous agreement,
    const goToPreviousAgreement = () => {
        //go to previous agreement
        setCurrentAgreementIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : allRentalAgreementsState.length - 1))
        resetAgreementForm()
    }

    // Handle a decision change, i.e accept / decline an agreement
    const handleDecisionChange = (e) => {
        // If pickup selected setDelivery to false
        setSelectedDecision(e.target.value)
        // If the checkbox is unchecked, clear the delivery address
    }
    
    // Handle a change in the delivery
    const handleDeliveryChange = (e) => {
        // IF IsDelivery set to false ( meaning it the checkbox was clicked again you set choice to false)
        setDeliveryChoice(e.target.value === 'true')
    }

    // Handles the actual toggle of the delivery /address
    const handleDeliveryToggle = () => {
        //Toggle delivery field, then set delivery to false if you click it again
        setIsDelivery(!isDelivery)
        // setDeliveryChoice(false)
    }


    // Handles toggling the delivery address
    const handleDeliveryAddressToggle = ()  => {
        //Toggle delivery address field, then set delivery address to be blank if you unclick it
        setIsDeliveryAddress(!isDeliveryAddress)
        setDeliveryAddress('')
    }

    // Resets the agreement form
    const resetAgreementForm = () => {
        setIsDelivery(false);
        setIsDeliveryAddress(false);
        setDeliveryAddress('');
        setSelectedDecision('');
        setDeliveryChoice(null); // Explicitly set to null
    }

    // console.log(deliveryChoice)
    // console.log(typeof(deliveryChoice))
    // console.log(deliveryChoice)
    // console.log(typeof(deliveryChoice))
    // console.log("DELIVERY ADDRESS:",deliveryAddress)
    // console.log("DELIVERY ADDRESS:", typeof(deliveryAddress))

    // Delete a cart item
    const handleDeleteRentalAgreement = async (rentalAgreementId) => {
        try {
            const response = await fetch(`${apiUrl}rental/agreements/${rentalAgreementId}/${role}`, {
            method: 'DELETE',
            })
            
            if (response.ok) {
            // Filter out the deleted item
            const updatedAgreements = allRentalAgreementsState.filter(agreement => agreement.theAgreement.id !== rentalAgreementId)
            setAllRentalAgreementsState(updatedAgreements)
            toast.success(`💥 You've succesfully deleted this agreement `,
            {
              "autoClose" : 3000
            })
            goToNextAgreement()
            checkSession()
            } else {
            // console.log("Error in deleting the rental agreement")
            toast.error(`Error in deleting the rental agreement`,
            {
                "autoClose" : 2000
            })
            }
        } catch (error) {
            console.error('Fetch Error:', error)
            toast.error(`Error in deleting the rental agreement: ${error}`,
            {
                "autoClose" : 2000
            })
            // Handle fetch errors
        }
        }
    
        // Toggle for delete button
        const handleToggleDelete = () => {
        setToggleDelete(!toggleDelete)
        }

        // console.log("All Agreements?:", allRentalAgreementsState)

        const navigateBackToOwnerDash = () => {
            navigate(`/dashboard`)
        }
    
    return(
        <section>
        <div key={currentAgreementIndex} className="py-16 md:py-24 lg:py-32 mx-auto w-full max-w-7xl px-5 md:px-10">
            <div className="flex flex-col items-start lg:flex-row lg:space-x-20">
           
            <div className="flex-[1_1_500px] max-[991px]:w-full max-[991px]:flex-none">
                <div className="max-w-3xl mb-8 md:mb-12 lg:mb-16">
                {rentalCardDisplay[currentAgreementIndex]}
                </div>

                { allRentalAgreementsState[currentAgreementIndex]?.theAgreement.agreement_status !== 'both-accepted' && role === 'owner' && (
                <div> 

                <input
                type="checkbox"
                id="delivery_checkbox"
                name="delivery"
                value="delivery"
                checked={isDelivery}
                onChange={handleDeliveryToggle}
                />
                <label htmlFor="delivery_checkbox"> Edit delivery option</label>

                {isDelivery && (

                    <div className="mt-6 flex justify-between"> 

                    <label className="inline-flex items-center font-bold text-gray-900">
                        <input
                            type="radio"
                            className="form-radio"
                            name="decline_delivery"
                            value="false"
                            checked={deliveryChoice === false}
                            onChange={handleDeliveryChange}
                        />
                        <span className="ml-2"> NO Delivery </span>
                    </label>

                    <label className="inline-flex items-center font-bold text-gray-900">
                        <input
                            type="radio"
                            className="form-radio"
                            name="allow_delivery"
                            value="true"
                            checked={deliveryChoice === true}
                            onChange={handleDeliveryChange}
                        />
                        <span className="ml-2"> ALLOW Delivery </span>
                    </label>

                    </div>
                )
                
                }

                <br></br>
                {deliveryChoice && 
                <div> 
                <input
                type="checkbox"
                id="delivery_address_checkbox"
                name="delivery_address"
                value="delivery_address"
                checked={isDeliveryAddress}
                onChange={handleDeliveryAddressToggle}
                />
                <label htmlFor="delivery_address_checkbox"> Edit delivery address</label>
                </div>
                }
                {/* only show if deliveryAddress and choice exists. Basically if you don't choose to have delivery, you won't see the field */}
                {isDeliveryAddress && deliveryChoice && (
                    <> 
                    {/* https://www.w3schools.com/jsref/prop_radio_defaultchecked.asp#:~:text=Description,default%2C%20otherwise%20it%20returns%20false. */}
                    <input
                        type="text"
                        placeholder="Delivery Address"
                        name="delivery_address"
                        className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                    </>
                )}
                    <br></br>
                </div>
            )}
            { allRentalAgreementsState[currentAgreementIndex]?.theAgreement.agreement_status !== 'both-accepted' &&
            <>
            <div className="mt-6 flex justify-between"> 

                <label className="inline-flex items-center font-bold text-gray-900">
                    <input
                        type="radio"
                        className="form-radio"
                        name="decline_option"
                        value="decline"
                        checked={selectedDecision === 'decline'}
                        onChange={handleDecisionChange}
                    />
                    <span className="ml-2"> Decline Agreement </span>
                </label>

                <label className="inline-flex items-center font-bold text-gray-900">
                    <input
                        type="radio"
                        className="form-radio"
                        name="accept_option"
                        value="accept"
                        checked={selectedDecision === 'accept'}
                        onChange={handleDecisionChange}
                    />

                    <span className="ml-2"> Accept Agreement </span>
                </label>

            </div>

            <div className="flex justify-between"> 

                    <button
                        onClick={handleToggleDelete}
                        className="bg-red-500 text-white text-sm px-6 py-3 mt-8 rounded-lg shadow transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none"
                    >
                        Delete this Rental Agreement
                    </button>


                    <button 
                    onClick={handleAgreementEdit}
                    className="bg-black text-white text-sm px-6 py-3 mt-8 rounded-lg shadow transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none">
                    Submit Changes
                    </button>

                    

                  {/* {toggleDelete && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 overflow-y-auto h-full w-full" onClick={() => setToggleDelete(false)}>
                    <div className="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Are you sure you want to delete this item?</h3>
                      <p className="mt-2 text-red-600">Warning: Deleting this Rental Agreement {role === 'owner' ? 'will remove this item from the Users Cart' : 'will also remove the item from your cart.'} will also delete any associated rental agreement.</p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleDeleteRentalAgreement(allRentalAgreementsState[currentAgreementIndex]?.theAgreement?.id)}
                          className="mr-2 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
                        >
                          Yes, Remove This Rental Agreement and the associated Cart Item.
                        </button>
                        <button
                          onClick={handleToggleDelete}
                          className="rounded bg-gray-500 py-2 px-4 text-white hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )} */}

                    {toggleDelete && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 overflow-y-auto h-full w-full" onClick={() => setToggleDelete(false)}>
                            <div className="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Are you sure you want to delete this item?</h3>
                                <p className="mt-4 mb-6 text-red-600">
                                    Warning: Deleting this Rental Agreement {role === 'owner' ? 'will remove this item from the Users Cart' : 'will also remove the item from your cart.'} will also delete any associated rental agreement.
                                </p>
                                <div className="flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => handleDeleteRentalAgreement(allRentalAgreementsState[currentAgreementIndex]?.theAgreement?.id)}
                                        className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
                                    >
                                        Yes, Remove This Rental Agreement and the associated Cart Item.
                                    </button>
                                    <button
                                        onClick={handleToggleDelete}
                                        className="rounded bg-gray-500 py-2 px-4 text-white hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}



            </div>
            
            </>

            
            }

            </div>


            <div className="flex-[1_1_500px] max-[991px]:w-full max-[991px]:flex-none bg-[#f2f2f7]">
                {comments}
                <div className="mb-6 h-full w-full overflow-auto bg-[#f2f2f7] p-8 rounded-sm">

                <div className="flex flex-row gap-4">
                    <img src={currentUser?.profileImage} alt="" className="inline-block h-12 w-12 object-cover rounded-full"/>
                    <div className="flex flex-col gap-1.5">
                    <h5 className="text-xl font-bold">Need an Agreement revision?</h5>
                    <div className="max-w-[380px]">
                        <p className="text-[#636262] max-[479px]:text-sm">Forgot to add delivery or require extra help? Post a comment to find a solution!</p>
                    </div>
                    </div>
                </div>
                
                <div className="mb-6 mt-8 h-[0.5px] w-full bg-[#a6a6a6]">
                    
                </div>
                    <form className="flex flex-col space-y-2 w-full" onSubmit={handleAddComment}>
                        <textarea
                        type="text"
                        className="resize-y p-3 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        name="comment"
                        value={rentalComment}
                        placeholder="Type your comment here..."
                        onChange={(e) => setRentalComment(e.target.value)}
                        />
                        <button 
                        type="submit"
                        className="bg-black text-white text-sm px-6 py-3 rounded-lg shadow transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none">
                        Leave Comment
                        </button>
                    </form>
                </div>
                <div className="flex justify-center items-center space-x-4 mb-8">
                    <button
                        onClick={goToPreviousAgreement} 
                        className="p-2"
                        aria-label="Previous Agreement">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-12 h-12" viewBox="0 0 16 16">
                        <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
                        </svg>
                    </button>

                    <button 
                        onClick={goToNextAgreement} 
                        className="p-2"
                        aria-label="Next Agreement">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-12 h-12" viewBox="0 0 16 16">
                        <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1"/>
                        </svg>
                    </button>
                </div>

                {fromOwnerDash && 
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={navigateBackToOwnerDash}>
               Return to Dashboard
              </button>}
            </div>
            </div>

        </div>
        </section>
    )
}

export default RentalAgreementDisplay;
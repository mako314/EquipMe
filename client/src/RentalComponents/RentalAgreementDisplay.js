import React, {useState} from "react"
import RentalAgreementCard from "./RentalAgreementCard";
import { UserSessionContext } from "../UserComponents/SessionContext";

function RentalAgreementDisplay() {
    const { currentUser, role} = UserSessionContext()
    
    const [ownerResponse, setOwnerResponse] = useState({
        owner_decision: '',
        delivery: '',
        delivery_address: ''
    })
    

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
    console.log(rentalCardDisplay)
    let rentalCard
    // Need to find a way to map over an array that's nested inside of an array.
    //Went with flat map, but since there's another nested array inside of cart.cart_item, I needed to flatten that also, and finally, I map over item.agreements to get the agreement dates.
    //Luckily with flatmap, everything was available!
    if (role === 'user'){
        (rentalCard = currentUser?.cart?.flatMap(cart => 
        cart.cart_item?.flatMap(item => 
        item.agreements?.map(agreement=>{

        rentalCard = (<RentalAgreementCard
        key={item.id}
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
        location={item.equipment.location}
        ownerEmail ={item.equipment.owner.email}
        ownerFirstName = {item.equipment.owner.firstName}
        ownerLastName ={item.equipment.owner.lastName}
        />)

        rentalCardDisplay.push(rentalCard)
        }) || []
        ) || []
        ))} else {
        currentUser?.agreements?.map(agreement => {
        rentalCard = <div className="ml-16"><RentalAgreementCard
        key={agreement.id}
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
        location={currentUser.location}
        ownerEmail ={currentUser.email}
        ownerFirstName = {currentUser.firstName}
        ownerLastName ={currentUser.lastName}
        />  </div>
        rentalCardDisplay.push(rentalCard)
    })
    }

    console.log("The current rental card:", rentalCardDisplay[0])
    // console.log("currentUser agreements OWNER:", currentUser?.agreements[0])
    const comments = currentUser?.agreements?.[0]?.comment?.map((item) => (
    <div key={item.id} className="mb-6 w-full overflow-hidden bg-[#f2f2f7] p-8 rounded-sm border-b border-black">
    <div className="flex items-start justify-between">
        <p className="text-xl font-bold">Comment Created At: <br></br> {item.created_at}</p>
        <span> 👈👉 </span>
        <p className="text-xl font-bold">Comment Updated At: <br></br> {item.updated_at}</p>
    </div>
    <div className="w-full overflow-hidden mb-4 max-w-[640px] lg:max-w-[960px] mt-4">
        <p className="max-[479px]:text-sm">{item.comment}</p>
    </div>
    </div>
    ))
    


    return(
        <section>
        <div className="py-16 md:py-24 lg:py-32 mx-auto w-full max-w-7xl px-5 md:px-10">
            <div className="flex flex-col items-start lg:flex-row lg:space-x-20">
            <div className="flex-[1_1_500px] max-[991px]:w-full max-[991px]:flex-none">
                <div className="max-w-3xl mb-8 md:mb-12 lg:mb-16">
                {rentalCardDisplay[0]}
                </div>
            </div>
            <div className="flex-[1_1_500px] max-[991px]:w-full max-[991px]:flex-none bg-[#f2f2f7]">
                {comments}
                <div className="mb-6 h-full w-full overflow-auto bg-[#f2f2f7] p-8 rounded-sm">

                <div className="flex flex-row gap-4">
                    <img src={currentUser.profileImage} alt="" className="inline-block h-12 w-12 object-cover rounded-full"/>
                    <div className="flex flex-col gap-1.5">
                    <h5 className="text-xl font-bold">Need an Agreement revision?</h5>
                    <div className="max-w-[380px]">
                        <p className="text-[#636262] max-[479px]:text-sm">Forgot to add delivery or require extra help? Post a comment to find a solution!</p>
                    </div>
                    </div>
                </div>
                
                <div className="mb-6 mt-8 h-[0.5px] w-full bg-[#a6a6a6]">
                    
                </div>
                    <div className="flex justify-end"> 
                        <div className="flex flex-col space-y-2 w-full">
                        <textarea 
                            className="flex-1 h-12 p-3 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                            placeholder="Type your comment here..."
                        />
                            <button className="bg-black text-white text-sm px-6 py-3 rounded-lg shadow transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none">
                                Leave Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            {/* <button className="inline-block items-center bg-black px-6 py-3 text-center font-semibold text-white">Leave Comment</button> */}
        </div>
        </section>
    )
}

export default RentalAgreementDisplay;
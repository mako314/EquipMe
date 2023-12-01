import React from "react"
import RentalAgreementCard from "./RentalAgreementCard";
import { UserSessionContext } from "../UserComponents/SessionContext";

function RentalAgreementDisplay() {
    const { currentUser, role} = UserSessionContext()
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
        (rentalCard = currentUser.cart?.flatMap(cart => 
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
        currentUser.agreements?.map(agreement => {
        rentalCard = <RentalAgreementCard
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
        renterFirstName={agreement.cart_item.cart.user.firstName}
        renterLastName={agreement.cart_item.cart.user.lastName}
        location={currentUser.location}
        ownerEmail ={currentUser.email}
        ownerFirstName = {currentUser.firstName}
        ownerLastName ={currentUser.lastName}
        /> 
        rentalCardDisplay.push(rentalCard)
    })
    }


    return(
        
        
        <section>
        <div className="py-16 md:py-24 lg:py-32 mx-auto w-full max-w-7xl px-5 md:px-10">
            <div className="flex flex-col items-start lg:flex-row lg:space-x-20">
            <div className="flex-[1_1_500px] max-[991px]:w-full max-[991px]:flex-none">
                <div className="max-w-3xl mb-8 md:mb-12 lg:mb-16">
                {rentalCardDisplay[0]}
                </div>
                <div className="mb-6 h-full w-full overflow-auto bg-[#f2f2f7] p-8 rounded-sm">
                <div className="flex flex-row gap-4">
                    <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/64772e4ec124557640300fd8_Column.png" alt="" className="inline-block h-12 w-12 object-cover rounded-full"/>
                    <div className="flex flex-col gap-1.5">
                    <h5 className="text-xl font-bold">Still have questions?</h5>
                    <div className="max-w-[380px]">
                        <p className="text-[#636262] max-[479px]:text-sm">Can’t find the answer you’re looking for? Please chat to lorem</p>
                    </div>
                    </div>
                </div>
                <div className="mb-6 mt-8 h-[0.5px] w-full bg-[#a6a6a6]"></div>
                <a href="#" className="inline-block items-center bg-black px-6 py-3 text-center font-semibold text-white">Get In Touch</a>
                </div>
            </div>
            <div className="flex-[1_1_500px] max-[991px]:w-full max-[991px]:flex-none">
                <div className="mb-6 w-full overflow-hidden bg-[#f2f2f7] p-8 rounded-sm">
                <div className="flex cursor-pointer items-start justify-between">
                    <p className="text-xl font-bold">What is your policy on distributon</p>
                    <div className="relative ml-10 mt-1 flex h-5 w-5 items-center justify-center">
                    <div className="absolute h-5 w-0.5 bg-[#0b0b1f]"></div>
                    <div className="h-0.5 w-5 bg-[#0b0b1f]"></div>
                    </div>
                </div>
                <div className="w-full overflow-hidden mb-4 max-w-[640px] lg:max-w-[960px]">
                    <p className="max-[479px]:text-sm">Pellentesque in nisi aliquet, pellentesque purus eget, imperdiet turpis. Fusce at enim quis neque viverra convallis. Vivamus ut elementum leo, eget tempus nisl. Sed viverra enim ac turpis posuere consectetur. Sed enim nibh, consequat vitae lacus eu, ullamcorper ullamcorper massa. Pellentesque purus eget, imperdiet turpis.</p>
                </div>
                </div>
                <div className="mb-6 w-full overflow-hidden bg-[#f2f2f7] p-8 rounded-sm">
                <div className="flex cursor-pointer items-start justify-between">
                    <p className="text-xl font-bold">How can I contribute to Flowspark?</p>
                    <div className="relative ml-10 mt-1 flex h-5 w-5 items-center justify-center">
                    <div className="absolute h-5 w-0.5 bg-[#0b0b1f]"></div>
                    <div className="h-0.5 w-5 bg-[#0b0b1f]"></div>
                    </div>
                </div>
                <div className="w-full overflow-hidden mb-4 max-w-[640px] lg:max-w-[960px]">
                    <p className="max-[479px]:text-sm">Pellentesque in nisi aliquet, pellentesque purus eget, imperdiet turpis. Fusce at enim quis neque viverra convallis. Vivamus ut elementum leo, eget tempus nisl. Sed viverra enim ac turpis posuere consectetur. Sed enim nibh, consequat vitae lacus eu, ullamcorper ullamcorper massa. Pellentesque purus eget, imperdiet turpis.</p>
                </div>
                </div>
                <div className="mb-6 w-full overflow-hidden bg-[#f2f2f7] p-8 rounded-sm">
                <div className="flex cursor-pointer items-start justify-between">
                    <p className="text-xl font-bold">What other themes do you have?</p>
                    <div className="relative ml-10 mt-1 flex h-5 w-5 items-center justify-center">
                    <div className="absolute h-5 w-0.5 bg-[#0b0b1f]"></div>
                    <div className="h-0.5 w-5 bg-[#0b0b1f]"></div>
                    </div>
                </div>
                <div className="w-full overflow-hidden mb-4 max-w-[640px] lg:max-w-[960px]">
                    <p className="max-[479px]:text-sm">Pellentesque in nisi aliquet, pellentesque purus eget, imperdiet turpis. Fusce at enim quis neque viverra convallis. Vivamus ut elementum leo, eget tempus nisl. Sed viverra enim ac turpis posuere consectetur. Sed enim nibh, consequat vitae lacus eu, ullamcorper ullamcorper massa. Pellentesque purus eget, imperdiet turpis.</p>
                </div>
                </div>

                <div className="mb-6 w-full overflow-hidden bg-[#f2f2f7] p-8 rounded-sm">
                <div className="flex cursor-pointer items-start justify-between">
                    <p className="text-xl font-bold">What is your policy on distributon</p>
                    <div className="relative ml-10 mt-1 flex h-5 w-5 items-center justify-center">
                    <div className="absolute h-5 w-0.5 bg-[#0b0b1f]"></div>
                    <div className="h-0.5 w-5 bg-[#0b0b1f]"></div>
                    </div>
                </div>
                <div className="w-full overflow-hidden mb-4 max-w-[640px] lg:max-w-[960px]">
                    <p className="max-[479px]:text-sm">Pellentesque in nisi aliquet, pellentesque purus eget, imperdiet turpis. Fusce at enim quis neque viverra convallis. Vivamus ut elementum leo, eget tempus nisl. Sed viverra enim ac turpis posuere consectetur. Sed enim nibh, consequat vitae lacus eu, ullamcorper ullamcorper massa. Pellentesque purus eget, imperdiet turpis.</p>
                </div>
                </div>

            </div>
            </div>
        </div>
        </section>
    )
}

export default RentalAgreementDisplay;
import React, { useState } from "react";
import ProductCard from "./ProductCard"
import Pagination from '../PaginationComponents/Pagination'

function ProductCollection({ equipmentArray, handleEquipmentDelete, handleEditEquipment }) {

    //Can change this so show x amount of cards per page
    const [cardsPerPage] = useState(8)
    const [cardOffset, setCardOffset] = useState(0)
    const endOffset = cardOffset + cardsPerPage
    // console.log(equipmentArray)

    //changed the key to item.id which is unique
    const equipmentCards = equipmentArray?.map((item) => {
        return <ProductCard key={item.id} id={item.id} name={item.name} model={item.model} make={item.make} address_line_2={item.address_line_2} address={item.address} city={item.city} state={item.state} postal_code={item.postal_code} item={item} handleEquipmentDelete={handleEquipmentDelete} handleEditEquipment={handleEditEquipment} equipment_image={item.equipment_image}/>
    })
    // console.log(equipmentCards)
    const currCards = equipmentCards?.slice(cardOffset, endOffset);
    const pageCount = Math.ceil(equipmentArray.length / cardsPerPage);

    const paginate = (event) => {
        const newCardOffset = (event.selected * cardsPerPage);
        setCardOffset(newCardOffset)
    }

    return (
        <div className="p-4">
            {currCards.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {currCards}
                    </div>
                    <Pagination
                        paginate={paginate}
                        array={currCards}
                        cardsPerPage={cardsPerPage}
                        pageCount={pageCount}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
                    <img
                        src="https://www.modernmachinery.com/wp-content/uploads/2022/04/2H1A9567-Edit-1.jpg"
                        alt="Heavy Duty Equipment"
                        className="max-w-xs md:max-w-sm lg:max-w-md mb-4 rounded-lg shadow-lg"
                    />
                    <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 font-semibold">
                        You haven't uploaded anything yet. Let's fill this space together!
                        <br/>
                        <br/>
                        Look for the "List Item" button in the top right of your Dashboard
                    </p>
                </div>
            )}
        </div>
    )
}

export default ProductCollection;
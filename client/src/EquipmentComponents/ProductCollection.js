import React, { useState } from "react";
import ProductCard from "./ProductCard"
import Pagination from '../PaginationComponents/Pagination'

function ProductCollection({ equipmentArray, handleEquipmentDelete, handleEditEquipment }) {

    //Can change this so show x amount of cards per page
    const [cardsPerPage] = useState(8)
    const [cardOffset, setCardOffset] = useState(0)
    const endOffset = cardOffset + cardsPerPage;
    console.log(equipmentArray)

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
        <div className="p-4"> {/* Add padding to the container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currCards}
            </div>

            {/* <div className="w-full flex justify-center mt-4"> */}
            <Pagination
                paginate={paginate}
                array={currCards}
                cardsPerPage={cardsPerPage}
                pageCount={pageCount}

            />
            {/* </div> */}

        </div>)
}

export default ProductCollection;
import React, { useState } from "react";
import ProductCard from "./ProductCard"
// import Pagination from "./Pagination";
import Pagination from '../PaginationComponents/Pagination'

function ProductCollection({ equipmentArray, handleEquipmentDelete, handleEditEquipment }) {

    const [cardsPerPage] = useState(16)
    const [cardOffset, setCardOffset] = useState(0)
    const endOffset = cardOffset + cardsPerPage;

    //changed the key to item.id which is unique
    const equipmentCards = equipmentArray?.map((item) => {
        return <ProductCard key={item.id} id={item.id} name={item.name} model={item.model} make={item.make} location={item.location} item={item} handleEquipmentDelete={handleEquipmentDelete} handleEditEquipment={handleEditEquipment} />
    })
    console.log(equipmentCards)
    const currCards = equipmentCards?.slice(cardOffset, endOffset);
    const pageCount = Math.ceil(equipmentArray.length / cardsPerPage);

    const paginate = (event) => {
        const newCardOffset = (event.selected * cardsPerPage);
        setCardOffset(newCardOffset)
    };

    return (
        <div>
            <div className="cards">
                {currCards}
            </div>
            <Pagination
                paginate={paginate}
                array={currCards}
                cardsPerPage={cardsPerPage}
                pageCount={pageCount}

            />
        </div>)
}

export default ProductCollection;
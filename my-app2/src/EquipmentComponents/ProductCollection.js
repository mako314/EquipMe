import React, { useState } from "react";
import ProductCard from "./ProductCard"
import Pagination from "./Pagination";

function ProductCollection({ equipmentArray }) {

    // const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(16)
    // const indexOfLastCard = currentPage * cardsPerPage
    const [cardOffset, setCardOffset] = useState(0);

    const endOffset = cardOffset + cardsPerPage;

    // const paginated_equipment = equipmentArray.sort((a, b) => a.quantity - b.quantity);

    // const currentEquipmentCards = () => {
    //     return equipmentArray.slice(indexOfFirstCard, indexOfLastCard);
    // }


    const baseEquipmentCardArray = equipmentArray?.map((item) => {
        return <ProductCard key={item.id} id={item.id} name={item.name} model={item.model} make={item.make} location={item.location} />
    })

    const currCards = baseEquipmentCardArray?.slice(cardOffset, endOffset);
    const pageCount = Math.ceil(baseEquipmentCardArray.length / cardsPerPage);

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
import React from "react";
import ProductCard from "./EquipmentCard"

function ProductCollection({ productCollection }) {

    const equipmentCards = productCollection?.map((item) => {
        return <ProductCard key={item.name} name={item.name} model={item.model} />
    })

    return (<div className="cards">
        {equipmentCards}
    </div>)
}

export default ProductCollection;
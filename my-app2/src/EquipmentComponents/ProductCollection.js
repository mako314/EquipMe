import React from "react";
import ProductCard from "./ProductCard"

function ProductCollection({ equipmentArray }) {

    //changed the key to item.id which is unique
    const equipmentCards = equipmentArray?.map((item) => {
        return <ProductCard key={item.id} id={item.id} name={item.name} model={item.model} make={item.make} location={item.location} />
    })

    return (<div className="cards">
        {equipmentCards}
    </div>)
}

export default ProductCollection;
import React from "react";
import ProductCard from "./ProductCard"

function ProductCollection({ equipmentArray }) {

    const equipmentCards = equipmentArray?.map((item) => {
        return <ProductCard key={item.name} name={item.name} model={item.model} make={item.make} location={item.location} />
    })

    return (<div className="cards">
        {equipmentCards}
    </div>)
}

export default ProductCollection;
import React from "react";
import ProductCard from "./ProductCard"

function ProductCollection({ equipmentArray, handleEquipmentDelete, handleEditEquipment }) {

    //changed the key to item.id which is unique
    const equipmentCards = equipmentArray?.map((item) => {
        return <ProductCard key={item.id} id={item.id} name={item.name} model={item.model} make={item.make} location={item.location} item={item} handleEquipmentDelete={handleEquipmentDelete} handleEditEquipment={handleEditEquipment} />
    })

    return (<div className="cards">
        {equipmentCards}
    </div>)
}

export default ProductCollection;
import React, { useState, useEffect } from 'react';
import OwnerCard from "./OwnerCard";

function OwnerCollection({ }) {
    const [equipmentOwnerArray, setEquipmentOwnerArray] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5555/equipment_owners")
            .then((resp) => resp.json())
            .then((data) => {
                setEquipmentOwnerArray(data)
            })
    }, [])

    const ownerCards = equipmentOwnerArray?.map((item) => {
        return <OwnerCard key={item.email} id={item.id} email={item.email} name={item.name} location={item.location} phone={item.phone} equipmentArray={item.equipment}/>
    })

    return (<div className="cards">
        {ownerCards}
    </div>)
}

export default OwnerCollection;
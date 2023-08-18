import React, { useState, useEffect } from 'react';
import OwnerCard from "./OwnerCard";


function OwnerCollection({ searchTerm, handleEditOwner, handleOwnerDelete, equipmentOwnerArray }) {
  
    // const [equipmentOwnerArray, setEquipmentOwnerArray] = useState([])

    // useEffect(() => {
    //     fetch("/equipment_owners")
    //         .then((resp) => resp.json())
    //         .then((data) => {
    //             setEquipmentOwnerArray(data)
    //         })
    // }, [])
    const ownerCards = equipmentOwnerArray?.map((item) => {

            if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.toLowerCase().includes(searchTerm.toLowerCase())){
            return <OwnerCard key={item.email} id={item.id} email={item.email} name={item.name} location={item.location} phone={item.phone} equipmentArray={item.equipment} handleEditOwner={handleEditOwner} item={item} handleOwnerDelete={handleOwnerDelete}/>}
    })

    return (<div className="cards">
        {ownerCards}
    </div>)
}

export default OwnerCollection;
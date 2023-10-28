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
            return <OwnerCard key={item.email} id={item.id} email={item.email} firstName={item.firstName} lastName={item.lastName} location={item.location} phone={item.phone} equipmentArray={item.equipment} profileImage={item.profileImage} handleEditOwner={handleEditOwner} item={item} handleOwnerDelete={handleOwnerDelete}/>}
    })

    return (
    <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ownerCards}
        </div>

    </div>)
}

export default OwnerCollection;
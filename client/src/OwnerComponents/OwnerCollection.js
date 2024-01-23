import React, { useState, useEffect } from 'react';
import OwnerCard from "./OwnerCard";


function OwnerCollection({ searchTerm, handleEditOwner, handleOwnerDelete, equipmentOwnerArray }) {
  
    // console.log(equipmentOwnerArray)
    const ownerCards = equipmentOwnerArray?.map((item) => {

            if (item.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||item.location?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.email?.toLowerCase().includes(searchTerm?.toLowerCase()) || item.phone?.toLowerCase().includes(searchTerm?.toLowerCase())){
            return <OwnerCard key={item.email} id={item.id} email={item.email} firstName={item.firstName} lastName={item.lastName}  address_line_2={item.address_line_2} address={item.address} city={item.city} state={item.state} postal_code={item.postal_code} phone={item.phone} equipmentArray={item.equipment} profileImage={item.profileImage} handleEditOwner={handleEditOwner} handleOwnerDelete={handleOwnerDelete}/>}
    })

    return (
    <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ownerCards}
        </div>

    </div>)
}

export default OwnerCollection;
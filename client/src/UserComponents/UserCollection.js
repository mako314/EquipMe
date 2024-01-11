import React, { useState, useEffect } from 'react';
import UserCard from "./UserCard";


function UserCollection({ searchTerm, users, fromOwnerDash }) {

    const userCards = Array.isArray(users) ? users.map((item) => {
        if (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
            || item.location?.toLowerCase().includes(searchTerm.toLowerCase()) 
            || item.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
            || item.phone?.toLowerCase().includes(searchTerm.toLowerCase())) {
            return <UserCard key={item.email} fromOwnerDash={fromOwnerDash} id={item.id} email={item.email} firstName={item.firstName} lastName={item.lastName} phone={item.phone} profileImage={item.profileImage} item={item} profession={item.profession} address_line_2={item.address_line_2} address={item.address} city={item.city} state={item.state} postal_code={item.postal_code}/>
        }
    }) : []

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {userCards}
        </div>
    )
}

export default UserCollection;
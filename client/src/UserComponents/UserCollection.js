import React, { useState, useEffect } from 'react';
import UserCard from "./UserCard";


function UserCollection({ searchTerm, users, fromOwnerDash }) {
  
    const userCards = users?.map((item) => {

            if (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.location?.toLowerCase().includes(searchTerm.toLowerCase()) || item.email?.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone?.toLowerCase().includes(searchTerm.toLowerCase())){
            return <UserCard key={item.email} fromOwnerDash={fromOwnerDash} id={item.id} email={item.email} firstName={item.firstName} lastName={item.lastName} location={item.location} phone={item.phone} profileImage={item.profileImage} item={item} profession={item.profession}/>}
    })


    return (
    <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userCards}
        </div>

    </div>)
}

export default UserCollection;
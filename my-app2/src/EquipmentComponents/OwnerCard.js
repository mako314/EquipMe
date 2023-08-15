import React from "react";
import { useNavigate } from "react-router-dom";

function OwnerCard({ id, email, name, location, phone, equipmentArray, handleEditOwner, item, handleOwnerDelete }) {


    //test can likely delete below
    // console.log(item)

    const navigate = useNavigate();

    function handleClick(e) {
        navigate(`/equipment_owners/${id}`)
    }

    return (

        <div className="min-h-screen bg-gray-100 flex items-center">
            <div className="container mx-auto p-9 bg-white max-w-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
                <img className="rounded-xl" src="https://static.vecteezy.com/system/resources/previews/007/335/692/original/account-icon-template-vector.jpg" alt="" />
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="mt-5 text-2xl font-semibold">{name}</h1>
                        <p className="mt-2">{email} <br /> {phone} <br /> {location} </p>
                    </div>
                    <div>
                        <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleClick}>More Info</button>
                        <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handleEditOwner(item)}>Edit Owner</button>
                        <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handleOwnerDelete(item)}>Delete Owner</button>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default OwnerCard;
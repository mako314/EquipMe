import React from "react";
import { useNavigate } from "react-router-dom";

function OwnerCard({ id, email, firstName, lastName, location, phone, profileImage, equipmentArray, handleEditOwner, handleOwnerDelete }) {


    //test can likely delete below
    // console.log(item)

    const navigate = useNavigate();

    function handleClick(e) {
        navigate(`/equipment_owner/${id}`)
    }

    // console.log(item)

    // <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handleOwnerDelete(item)}>Delete Owner</button>
    // <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handleEditOwner(item)}>Edit Owner</button>

    // <div className="min-h-screen bg-gray-100 flex items-center"></div>
    return (

        <div className="flex items-center mt-10 ml-4">
                <div className="container mx-auto p-9 bg-white max-w-sm rounded-2xl border-2 border-solid border-gray-900 overflow-hidden shadow-outline hover:shadow-2xl transition duration-300">
                <img className="rounded-xl" src={profileImage} alt={`${firstName} ${lastName} Image`} />
                <div className="flex flex-col justify-between items-start mt-4"> {/* Use flex-col and items-start */}
                    <div>
                        <h1 className="text-2xl font-semibold">{firstName} {lastName} </h1>
                        <p className="mt-2">{email}</p>
                        <p>{phone}</p>
                        <p>{location}</p>
                    </div>
                    
                        <button className= " ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleClick}>More Info</button>
                    
                </div>
            </div>
        </div>


    )
}

export default OwnerCard;
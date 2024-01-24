import React from "react";
import { useNavigate } from "react-router-dom";
// import EquipmentMap from "../MapComponents/EquipmentMap";

function ProductCard({ id, name, model, make, equipment_image, address, address_line_2, city, state, postal_code }) {

    // const equipmentLocation = `${address_line_2 === '' ?  address : address + ',' + address_line_2}, ${city}, ${state} ${postal_code} `

    const equipmentLocation = `${address}${address_line_2 ? ', ' + address_line_2 : ''}, ${city}, ${state} ${postal_code}`;

    const navigate = useNavigate();

    // placeholder image = https://t4.ftcdn.net/jpg/00/93/18/45/360_F_93184515_pMvi6Fz6o1Qu32kM6lXycawPq8igxjIc.jpg

    function handleClick() {
        navigate(`/equipment/${id}`)
        window.scrollTo(0, 0)
    }

    return (
        <div className="flex items-center mt-10 ml-4">
            <div className="container mx-auto p-9 bg-white max-w-sm rounded-2xl border-2 border-solid border-gray-900 overflow-hidden shadow-outline hover:shadow-2xl transition duration-300">
                <img className="rounded-xl h-48 w-full object-contain" src={equipment_image} alt="" />
                <div className="flex justify-between items-center p-4">
                    <div>
                        <h1 className="mt-5 text-2xl font-semibold">{model}</h1>
                        <p className="mt-2">{name} <br /> {make} <br /> {equipmentLocation} </p>
                    </div>
                    <div>
                        <button className="text-white bg-gray-800 hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-amber-500 dark:hover:bg-amber-500 dark:focus:ring-amber-500 dark:border-amber-500" onClick={handleClick}>More Info</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;


// The link should take you to a display page,
//Was suggested to use NavLink

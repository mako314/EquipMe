import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ id, name, model, make, location }) {

    const navigate = useNavigate();


    function handleClick(e) {
        navigate(`/equipment/${id}`)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center">
            <div className="container mx-auto p-9 bg-white max-w-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
                <img className="rounded-xl" src="https://t4.ftcdn.net/jpg/00/93/18/45/360_F_93184515_pMvi6Fz6o1Qu32kM6lXycawPq8igxjIc.jpg" alt="" />
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="mt-5 text-2xl font-semibold">{model}</h1>
                        <p className="mt-2">{name} <br /> {make} <br /> {location} </p>
                    </div>
                    <div>
                        <button className="text-white text-md font-semibold bg-green-400 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-500 transform-gpu hover:scale-110 " onClick={handleClick}>More Info</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;


// The link should take you to a display page,
//Was suggested to use NavLink

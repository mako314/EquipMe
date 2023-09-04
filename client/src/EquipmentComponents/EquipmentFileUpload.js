import React from "react";
import { useNavigate } from "react-router-dom";

function EquipmentFileUpload() {

    const navigate = useNavigate();

    const uploadImage = () => {

    }

    return (

        <div className="">
            <input type="file"/>
             <button onClick={uploadImage}> Upload Image </button>
        </div>


    )
}

export default EquipmentFileUpload;
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { storage } from "../CloudComponents/Firebase";
import { ref, uploadBytes } from 'firebase/storage';
import {v4} from 'uuid';

function EquipmentFileUpload() {

    const navigate = useNavigate();
    
    const [imageUpload, setImageUpload] = useState(null)
    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `equipmentImages/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then(() =>{
            alert("Image Uploaded!")
        })
    }

    return (

        <div className="">
            <input type="file" onChange={
                (event) => {setImageUpload(event.target.files[0])
                }}/>
             <button onClick={uploadImage}> Upload Image </button>
        </div>


    )
}

export default EquipmentFileUpload;
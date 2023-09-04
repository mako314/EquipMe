import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { storage } from "../CloudComponents/Firebase";
import { ref, uploadBytes, listAll, getDownloadURL} from 'firebase/storage';
import {v4} from 'uuid';

function EquipmentFileUpload() {

    const navigate = useNavigate();
    
    const [imageUpload, setImageUpload] = useState(null)
    const [imageList, setImageList] = useState([])

    const imageListRef = ref(storage, "equipmentImages/")

    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `equipmentImages/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then(() =>{
            alert("Image Uploaded!")
        })
    }

    useEffect(() => {
        listAll(imageListRef).then((resp) => {
            // console.log(resp)
            resp.items.map((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url])
                })
            })
        });
    }, [])

    return (

        <div className="">
            <input type="file" onChange={
                (event) => {setImageUpload(event.target.files[0])
                }}/>
             <button onClick={uploadImage}> Upload Image </button>

             {imageList.map((url) => {
                return <img src={url}/>
             })}
        </div>


    )
}

export default EquipmentFileUpload;
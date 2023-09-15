import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function BulkEquipmentUpload() {

    const [uploadFile, setUploadFile] = useState(null)

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        setUploadFile(selectedFile)
        console.log(selectedFile)
    }


    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', uploadFile);
        console.log(formData)

        try {
            const response = await fetch('http://127.0.0.1:5555/bulk_file_upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log("File Uploaded Successfully", data)
            } else {
                console.log("Error Uploading File")
            }
        } catch (error) {
            console.log("Error Caught in Bulk File Upload")
        }
    }



    return (

        <div className="flex items-center justify-center h-screen">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm" onSubmit={handleUpload} >
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="file" >
                        Choose a File
                    </label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Upload File
                    </button>
                </div>
            </form>
        </div>
    )
}
export default BulkEquipmentUpload;
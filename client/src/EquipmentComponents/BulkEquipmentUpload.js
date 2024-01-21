import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiUrlContext from "../Api";

function BulkEquipmentUpload() {
    const [uploadFile, setUploadFile] = useState(null);
    const apiUrl = useContext(ApiUrlContext);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const fileInputRef = React.createRef(); // Ref for the file input

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        setUploadFile(selectedFile);
        setFeedbackMessage('');
        console.log(selectedFile);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) {
            setFeedbackMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadFile);

        try {
            const response = await fetch(`${apiUrl}bulk_file_upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log("File Uploaded Successfully", data);
                setFeedbackMessage('File uploaded successfully.');
            } else {
                console.log("Error Uploading File");
                setFeedbackMessage('Error uploading file.');
            }
        } catch (error) {
            console.log("Error Caught in Bulk File Upload");
            setFeedbackMessage('Error caught in bulk file upload.');
        }
    };

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full max-w-2xl px-6 py-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Bulk Equipment Upload</h2>

                        {/* Image Section */}
                        <div className="flex justify-center mb-8">
                            <img src="path_to_your_image.jpg" alt="Bulk Upload Image" className="h-40" />
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleUpload} className="flex flex-col items-center">
    <div className="mb-4">
        <button type="button" onClick={triggerFileInput} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
            Choose File
        </button>
        <input
            ref={fileInputRef}
            type="file"
            id="file"
            name="file"
            accept=".csv, .xml, .xlsx"
            onChange={handleFileUpload}
            className="hidden"
        />
    </div>
    <div className="mb-4 text-center">
        {feedbackMessage && (
            <p className="text-sm text-red-500">{feedbackMessage}</p>
        )}
    </div>
    <div className="flex items-center justify-center">
        <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
            Upload
        </button>
    </div>
</form>


                        {/* Guide/Instruction Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-700">How It Works:</h3>
                            <ul className="mt-4 list-disc list-inside text-gray-600">
                                <li>Step 1: Click 'Choose File' and select your CSV, XML, or XLSX file.</li>
                                <li>Step 2: Review the selected file name displayed below the button.</li>
                                <li>Step 3: Click 'Upload' to upload the file.</li>
                                <li>Step 4: Wait for the upload confirmation message.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BulkEquipmentUpload;

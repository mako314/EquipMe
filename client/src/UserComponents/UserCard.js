import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

function UserCard({ id, email, name, location, phone, profileImage, item, profession }) {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    //test can likely delete below
    // console.log(item)

    const navigate = useNavigate();

    function handleClick(e) {
        navigate(`/user/profile/${id}`)
    }

//--------------------------------------------------------------------------- This handles opening the modal to contact the individual (user)---------------------------------
    function toggleModal() {
        setIsModalOpen(!isModalOpen)
    }

    // function SubjectForm(){
    //     <form className="space-y-6" action="#">
    //         <div>
    //             <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Subject: </label>
    //             <input type="text" name="subject" id="subject" placeholder="Subject" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
    //         </div>
    //     </form>
    // }

    // function MessageForm(){
    //     <form className="space-y-6" action="#">
    //         <div>
    //             {/* Message fields here */}
    //             <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Message: </label>
    //             <textarea  type="text" name="message" id="message" placeholder="Start typing your message..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
    //         </div>
    //     </form>
    // }

    function SubmitSubject (subject) {
        // might use this to separate the subject and the messaging, make a separate one for message for example
        fetch("/messages", {
            method: "POST",
            body: JSON.stringify(subject),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then((response) => response.json())
          .then((message) => {

          })
    }

    function ContactModal(){ 
    return(
    <> 
    <button onClick={toggleModal} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
    Contact
    </button>
    {isModalOpen && (
    <div 
        id="authentication-modal" 
        tabIndex="-1" 
        aria-hidden="true" 
        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto"
    >
        <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                
                <button 
                    onClick={toggleModal} 
                    type="button" 
                    className="absolute top-3 right-2.5 text-white bg-blue-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    X 
                </button>

                <div className="px-6 py-6 lg:px-8">
                    <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
                    <form className="space-y-6" action="#">
                        
                        <div>
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Subject: </label>
                        <input type="text" name="subject" id="subject" placeholder="Subject" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                        </div>
                        
                        <div>
                            {/* Message fields here */}
                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Message: </label>
                            <textarea  type="text" name="message" id="message" placeholder="Start typing your message..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                        </div>

                        <div className="flex justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    {/* Checkbox*/}
                                </div>
                                <label 
                                    htmlFor="remember" 
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Could include something extra here, 
                                </label>
                            </div>                        </div>
                        <button 
                            type="submit" 
                            className=" w-half text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Send Message
                        </button>
                        
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            testing what this looks like  
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
)}
</>
    )}


    return (

        <div className="flex items-center">
                <div className="container mx-auto p-9 bg-white max-w-sm rounded-2xl border-2 border-solid border-gray-900 overflow-hidden shadow-outline hover:shadow-2xl transition duration-300">
                <img className="rounded-xl" src={profileImage} alt="" />
                <div className="flex flex-col justify-between items-start mt-4"> {/* Use flex-col and items-start */}
                    <div>
                        <h1 className="text-2xl font-semibold">{name}</h1>
                        <p className="mt-2">{email}</p>
                        <p>{phone}</p>
                        <p>{location}</p>
                    </div>
                    
                        <button className= " ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleClick}>More Info</button>
                        {<ContactModal/>}
                </div>
            </div>
        </div>


    )
}

export default UserCard;
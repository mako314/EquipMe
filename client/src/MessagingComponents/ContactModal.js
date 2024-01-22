import React, { useContext, useState, useEffect } from 'react'
import ApiUrlContext from '../Api'
import {toast} from 'react-toastify'
import { UserSessionContext } from '../UserComponents/SessionContext'

function ContactModal({recipientID, firstName, lastName}){
    const { currentUser, role, checkSession } = UserSessionContext()

    const apiUrl = useContext(ApiUrlContext)

    //Definitely need to set validations and such to prevent double subjects,

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    // const sender = user || owner
    
    // if(sender === user){
    //     console.log("true")
    // }

    // console.log("Hi, I'm you're sender:", sender?.firstName)
    // console.log("Hi, I'm you're sender:", currentUser?.firstName)

    function toggleModal() {
        setIsModalOpen(!isModalOpen)
    }

    async function handleSendMessage(event) {
        const randomContext = Math.floor(Math.random() * 1000) + 1
        
        event.preventDefault()
        // 1. Create a new thread with the subject
        let response = await fetch(`${apiUrl}new/thread`, {
            method: "POST",
            body: JSON.stringify({ subject: subject }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        // console.log("THE RECIPIENT ID:", recipientID)
        let threadData = await response.json()
        if (response.ok && threadData) {
            // 2. Create two inboxes once the thread is successfully created.
            response = await fetch(`${apiUrl}new/inboxes`, {
                method: "POST",
                body: JSON.stringify({ 
                    // user_id: user ? user.id : recipientID,
                    user_id: role === 'user'? currentUser.id : recipientID,
                    owner_id: role === 'owner'? currentUser.id : recipientID,
                    // owner_id: owner ? owner.id : recipientID,
                    thread_id: threadData.id
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                // 3. Send the message once the inboxes are successfully created
                response = await fetch(`${apiUrl}messages`, {
                    method: "POST",
                    body: JSON.stringify({
                        recipient_id: recipientID,
                        // sender_id: sender.id,
                        sender_id: currentUser.id,
                        context_id: randomContext,
                        // user_type: sender === user ? "user": "owner",
                        user_type: role === 'user' ? "user" : "owner",
                        content: message,
                        message_status: "Delivered",
                        created_on: new Date().toISOString(),
                        thread_id: threadData.id
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if (response.ok) {
                    await checkSession()
                    toast.success(`✉️ Message to: ${firstName}, ${lastName} sent successfully!`,{
                    "autoClose" : 2000
                    })
                    // console.log("Message sent successfully")
                    
                    // window.alert("Message sent successfully!")
                } else {
                    console.error("Failed to send the message")
                }
            } else {
                console.error("Failed to create inboxes")
            }
        } else {
            console.error("Failed to create a new thread")
        }
    }
    
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
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Send a Message</h3>
                <form className="space-y-6" action="#">
                    
                    <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Subject: </label>
                    <input type="text" name="subject" id="subject" placeholder="Subject" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value={subject}
                    onChange={(e) => setSubject(e.target.value)} required/>
                    </div>
                    
                    <div>
                        {/* Message fields here */}
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Message: </label>
                        <textarea  type="text" name="message" id="message" placeholder="Start typing your message..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value={message}
                        onChange={(e) => setMessage(e.target.value)}required/>
                    </div>

                    

                    <button 
                        type="submit" 
                        onClick={handleSendMessage}
                        className=" w-half text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Send Message
                    </button>
                    
                    <div className="flex justify-between">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                            </div>
                            <label 
                                htmlFor="remember" 
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                            Remember to abide by our code of conduct.
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
)}
</>
)}

export default ContactModal;
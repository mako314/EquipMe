import React, { useEffect, useContext } from 'react';
import ApiUrlContext from '../Api'

function SuccesfulCheckout(){
    const apiUrl = useContext(ApiUrlContext)
    // https://developer.mozilla.org/en-US/docs/Web/API/EventSource
    // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

    useEffect(() => {
        const eventSource = new EventSource(`${apiUrl}sse/endpoint`)

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data)
            
            if (!data || Object.keys(data).length === 0) {
                // Ignore empty messages
                return
            }
            console.log("Update from Server:", data)
            // Update your component state or UI with this data

            // console.log("Update from Server:", data)
        }

        eventSource.onerror = function(err) {
            console.error("EventSource failed:", err)
            // Handle errors
        }

        return () => {
            eventSource.close() // Close the connection when component unmounts
        }
    }, [])


    return(
        <div className="bg-white min-h-screen">
    <div className="mx-auto items-center container flex flex-col">
        <img src="https://i.imgur.com/9L7Tjf9.png" alt="Successful Checkout Image - Digital shopping cart with checkout items and a
            tick mark" className="w-80 mt-20"/>
        <p className="font-semibold text-2xl mt-10 text-gray-700">Thank you for your rental!</p>
        <p className="mt-10 text-gray-600 text-center max-w-lg">Your rental was successful and you will receive a confirmation
            email soon. If delivery was possible, we'll be in touch soon with the Owner to coordinate the delivery of your Equipment!</p>
        <div className="mt-20">
        <button fontFamily="Arial" type="submit" className="inline-flex border border-indigo-500 focus:outline-none
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 justify-center rounded-md py-2 px-4 bg-indigo-600
            text-sm font-medium text-white shadow-sm">Continue Shopping</button>
        </div>
    </div>
    </div>
        )
}

export default SuccesfulCheckout
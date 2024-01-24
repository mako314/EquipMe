import React, { useEffect, useState, useContext } from 'react';
import ApiUrlContext from '../Api'
import { useNavigate} from 'react-router-dom';
import LoadingPage from '../ExtraPageComponents/LoadingPage';

function AfterCheckout(){
    const apiUrl = useContext(ApiUrlContext)
    const [eventData, setEventData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();

    const handleDashNav = () => {
        navigate(`/dashboard`)
    }

    const handleHomeNav = () => {
        navigate(`/`)
    }

    const handleCartNav = () => {
        navigate(`/cart`)
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/EventSource
    // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

    useEffect(() => {
        
        const eventSource = new EventSource(`${apiUrl}sse/endpoint`)

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data)
            
            if (!data || Object.keys(data).length === 0) {
                // Ignore empty messages
                console.log("THE DATA:", data)
                return
            }
            console.log("Update from Server:", data)
            setEventData(prevEvents => [...prevEvents, data])
            setIsLoading(false)
            // console.log("Update from Server:", data)
        }

        eventSource.onerror = function(err) {
            console.error("EventSource failed:", err)
            // Handle errors
            setIsLoading(false)
        }

        return () => {
            eventSource.close() // Close the connection when component unmounts
        }
    }, [])

    console.log("CHECKING STATE DATA:", eventData)

    if (isLoading){
        return <LoadingPage loadDetails={"your Order Confirmation"}/>
    }

    if (eventData){
    return(
        <div className="bg-white min-h-screen flex flex-col items-center pt-5 pb-5">

            {eventData.map((event, index) => (
                <div key={index} className="text-center">
                    {event.type === 'payment_intent.succeeded' && (
                        <div className="flex flex-col items-center justify-center">
                            <img src="https://i.imgur.com/9L7Tjf9.png" alt="Successful Checkout" className="w-80 mt-20"/>
                            <p className="text-green-600 text-2xl mt-4">Payment Successful - ID: {event.data.id}</p>
                            <p className="font-semibold text-2xl mt-10 text-gray-700">Thank you for your rental!</p>
                            <p className="mt-10 text-gray-600 max-w-lg">Your rental was successful and you will receive a confirmation email soon. If delivery was possible, we'll be in touch with the Owner to coordinate the delivery of your Equipment!</p>
                        </div>
                    )}
                    {/* Render other event types if necessary */}
                </div>
                ))}
            <div className='flex flex-row gap-4'> 
            <button 
                onClick={handleCartNav}
                className="mt-20 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-amber-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-transparent"
            >
                Back to Cart
            </button>

            <button
                onClick={handleHomeNav}
                className="mt-20 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-amber-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-transparent"
            >
                Home
            </button>

            <button 
                onClick={handleDashNav}
                className="mt-20 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-amber-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-transparent"
            >
                My Dashboard
            </button>

            </div>


        </div>
    )}
}

export default AfterCheckout
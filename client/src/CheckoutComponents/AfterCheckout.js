import React, { useEffect, useState, useContext } from 'react';
import ApiUrlContext from '../Api'
import { useNavigate} from 'react-router-dom';
import LoadingPage from '../ExtraPageComponents/LoadingPage';
import { UserSessionContext } from '../UserComponents/SessionContext';

function AfterCheckout(){
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, checkSession} = UserSessionContext()
    // const [eventData, setEventData] = useState([])
    const [paymentRecord, setPaymentRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const navigate = useNavigate();

    const handleDashNav = () => {
        window.scrollTo(0, 0)
        navigate(`/dashboard`)
    }

    const handleHomeNav = () => {
        window.scrollTo(0, 0)
        navigate(`/`)
    }

    const handleCartNav = () => {
        window.scrollTo(0, 0)
        navigate(`/cart`)
    }

    const handleSupportNav = () => {
        navigate(`/contact/us`)
        window.scrollTo(0, 0)
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/EventSource
    // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

    // useEffect(() => {
        
    //     const eventSource = new EventSource(`${apiUrl}sse/endpoint`)

    //     eventSource.onmessage = function(event) {
    //         const data = JSON.parse(event.data)
            
    //         if (!data || Object.keys(data).length === 0) {
    //             // Ignore empty messages
    //             console.log("THE DATA:", data)
    //             return
    //         }
    //         console.log("Update from Server:", data)
    //         setEventData(prevEvents => [...prevEvents, data])
    //         setIsLoading(false)
    //         // console.log("Update from Server:", data)
    //     }

    //     eventSource.onerror = function(err) {
    //         console.error("EventSource failed:", err)
    //         // Handle errors
    //         setIsLoading(false)
    //     }

    //     return () => {
    //         eventSource.close() // Close the connection when component unmounts
    //     }
    // }, [])

    // console.log("current user ID:", currentUser?.id)

    useEffect(() => {
        // console.log("USE EFFECT RUNNING")
        if (!hasFetchedData && currentUser?.id) {  // Ensure currentUser ID is defined
            const fetchPaymentRecord = async () => {
                try {
                    const response = await fetch(`${apiUrl}payment/record/user/${currentUser.id}`, {
                        method: 'GET', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setPaymentRecord(data);
                    checkSession()
                    setIsLoading(false);
                    setHasFetchedData(true)
                } catch (error) {
                    console.error("Fetch error:", error);
                    setIsLoading(false);
                    setHasFetchedData(true)
                }
            };
            fetchPaymentRecord();
        } else {
            console.log("User ID is undefined");
        }

    }, [currentUser, apiUrl, hasFetchedData]);

    // console.log("CHECKING STATE DATA:", paymentRecord)

    if (isLoading){
        return <LoadingPage loadDetails={"your Order Confirmation"}/>
    }

    if (paymentRecord){
    return(
        <div className="bg-white min-h-screen flex flex-col items-center pt-5 pb-5">

                <div className="flex flex-col items-center justify-center">
                    <img src="https://i.imgur.com/9L7Tjf9.png" alt="Successful Checkout" className="w-80 mt-20"/>

                    <p className="text-green-600 text-2xl mt-4">Payment Successful - ID: {paymentRecord.payment_intent_id}</p>

                    {/* Display the payment method */}
                    <p className="text-gray-700 mt-4">Payment Method: {paymentRecord.payment_method}</p>

                    {/* Display the amount received, converting cents to dollars */}
                    <p className="text-gray-700 mt-2">Amount Paid: ${(paymentRecord.amount_received / 100).toFixed(2)} {paymentRecord.currency.toUpperCase()}</p>

                    <p className="font-semibold text-2xl mt-10 text-gray-700">Thank you for your rental!</p>
                    <p className="mt-10 text-gray-600 max-w-lg">Your rental was successful and you will receive a confirmation email soon. If delivery was possible, we'll be in touch with the Owner to coordinate the delivery of your Equipment!</p>
                </div>

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
    )} else {
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center pt-5 pb-5">
                <div className="flex flex-col items-center justify-center">
                    <img src="https://i.imgur.com/ZK0b4sZ.png" alt="Payment Unsuccessful" className="w-80 mt-20"/>
                    <p className="text-red-600 text-2xl mt-4">Payment Unsuccessful</p>
                    <p className="font-semibold text-xl mt-10 text-gray-700">We encountered an issue processing your payment.</p>
                    <p className="mt-5 text-gray-600 max-w-lg">Please check your payment details and try again. If you continue to experience issues, contact our support team for assistance.</p>
                </div>
                <div className='flex flex-row gap-4 mt-20'> 
                    <button
                        onClick={handleSupportNav}
                        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border border-transparent"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }


}

export default AfterCheckout


// {paymentRecord.map((event, index) => (
//     <div key={index} className="text-center">
//         {event.type === 'payment_intent.succeeded' && (
//             <div className="flex flex-col items-center justify-center">
//                 <img src="https://i.imgur.com/9L7Tjf9.png" alt="Successful Checkout" className="w-80 mt-20"/>
//                 <p className="text-green-600 text-2xl mt-4">Payment Successful - ID: {paymentRecord.payment_intent_id}</p>
//                 <p className="font-semibold text-2xl mt-10 text-gray-700">Thank you for your rental!</p>
//                 <p className="mt-10 text-gray-600 max-w-lg">Your rental was successful and you will receive a confirmation email soon. If delivery was possible, we'll be in touch with the Owner to coordinate the delivery of your Equipment!</p>
//             </div>
//         )}
//         {/* Render other event types if necessary */}
//     </div>
//     ))}
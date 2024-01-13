import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { UserSessionContext } from '../UserComponents/SessionContext';
import LoadingPage from '../ExtraPageComponents/LoadingPage';

import ApiUrlContext from '../Api';

function OrderHistory(){
    const { currentUser, role} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)
    const [loading, setLoading] = useState(true)
    // view product should link to 
    const [orderHistory, setOrderHistory] = useState([])

    const navigate = useNavigate()
    
    function handleEquipmentNavigation(id) {
        navigate(`/equipment/${id}`)
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        const fetchOrderHistory = async () => {
            if (!currentUser || !currentUser.id) {
                console.error("currentUser or currentUser.id is undefined.")
                setLoading(false)
                return
            }
    
            try {
                const response = await fetch(`${apiUrl}order/history/${currentUser.id}`, {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
    
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(`Server error: ${errorData.message}`)
                }
    
                const data = await response.json()
                setOrderHistory(data)
                setLoading(false)
            } catch (error) {
                console.error('Fetch Error:', error.message)
                
            }
        };
    
        fetchOrderHistory()
    }, [apiUrl, currentUser])

        if (loading){
        return <LoadingPage loadDetails={"your Order History"}/>
    }

    if(!currentUser){
        return <div> Not available </div>
    }

    let OrderHistoryTotal = 0

    orderHistory.orders.forEach((item) => {
        console.log("FOR EACH ITEM CONSOLE LOG:", item)
        OrderHistoryTotal =+ item.total_amount
    })

    console.log("ORDER HISTORY TOTAL:", OrderHistoryTotal)

    let mappedOrderHistory
    console.log("TYPE OF ORDER HISTORY:", typeof(orderHistory.orders))
    if (Array.isArray(orderHistory.orders)) {
        mappedOrderHistory = orderHistory.orders.map((item) => {
            return(<li className="p-4 sm:p-6">
                <div className="flex items-center sm:items-start">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40">
                    <img src={item.equipment.equipment_image} alt={item.equipment.make + ' ' + item.equipment.model} className="w-full h-full object-center object-cover"/>
                </div>
                <div className="flex-1 ml-6 text-sm">
                    <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                    <h5>{item.order_details}</h5>
                    <p className="mt-2 sm:mt-0">${(item.total_amount / 100).toFixed(2)}</p>
                    </div>
                    <p className="hidden text-gray-500 sm:block sm:mt-2"> {item.notes}</p>
                </div>
                </div>

                <div className="mt-6 sm:flex sm:justify-between">
                <div className="flex items-center">

                    <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="ml-2 text-sm font-medium text-gray-500">Estimated Delivery on <time dateTime="2021-07-12">{item.estimated_delivery_date}</time></p>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4 flex items-center space-x-4 divide-x divide-gray-200 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                    <div className="flex-1 flex justify-center">
                    <span className="text-indigo-600 whitespace-nowrap hover:text-indigo-500 cursor-pointer" onClick={ () => handleEquipmentNavigation(item.equipment.id)}>View product</span>
                    </div>
                </div>
                </div>
            </li>)
        })
    } else {
        console.log("orderHistory is not an array");
        // mappedOrderHistory = <p>No order history available</p>
    }

    if (loading){
        return <LoadingPage loadDetails={"your Order History"}/>
    }
    console.log("THE STATE ORDER HISTORY:", orderHistory)
    // console.log(mappedOrderHistory)


    return(
        <div className="bg-white">
            
            <div className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-8">
                <div className="max-w-2xl mx-auto px-4 lg:max-w-4xl lg:px-0">
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
                    <p className="mt-2 text-sm text-gray-500">Check the status of recent orders, manage returns, and discover similar products.</p>
                </div>
                </div>

                <div className="mt-16">
                <h2 className="sr-only">Recent orders</h2>
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-8">
                    <div className="max-w-2xl mx-auto space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                    <div className="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border">
                        <h3 className="sr-only">Order placed on <time dateTime="2021-07-06">Jul 6, 2021</time></h3>

                        <div className="flex items-center p-4 border-b border-gray-200 sm:p-6 sm:grid sm:grid-cols-4 sm:gap-x-6">
                        <dl className="flex-1 grid grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                            <div>
                            <dt className="font-medium text-gray-900">Order number</dt>
                            <dd className="mt-1 text-gray-500">WU88191111</dd>
                            </div>
                            <div className="hidden sm:block">
                            <dt className="font-medium text-gray-900">Date placed</dt>
                            <dd className="mt-1 text-gray-500">
                                <time dateTime="2021-07-06">Jul 6, 2021</time>
                            </dd>
                            </div>
                            <div>
                            <dt className="font-medium text-gray-900">Total amount</dt>
                            <dd className="mt-1 font-medium text-gray-900">${OrderHistoryTotal.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="relative flex justify-end lg:hidden">
                            <div className="flex items-center">
                            <button type="button" className="-m-2 p-2 flex items-center text-gray-400 hover:text-gray-500" id="menu-0-button" aria-expanded="false" aria-haspopup="true">
                                <span className="sr-only">Options for order WU88191111</span>
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                            </div>

                            <div className="origin-bottom-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-0-button" tabIndex="-1">
                            <div className="py-1" role="none">
                                {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-0-item-0"> View </a>
                                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-0-item-1"> Invoice </a>
                            </div>
                            </div>
                        </div>

                        <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                            <a href="#" className="flex items-center justify-center bg-white py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span>View Order</span>
                            <span className="sr-only">WU88191111</span>
                            </a>
                            <a href="#" className="flex items-center justify-center bg-white py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span>View Invoice</span>
                            <span className="sr-only">for order WU88191111</span>
                            </a>
                        </div>
                        </div>

                        <h4 className="sr-only">Items</h4>
                        <ul role="list" className="divide-y divide-gray-200">
                            {mappedOrderHistory}


                        </ul>
                    </div>


                    </div>
                </div>
                </div>
            </div>
            </div>
    )
}

export default OrderHistory;
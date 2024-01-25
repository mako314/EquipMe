import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { UserSessionContext } from '../UserComponents/SessionContext';
import LoadingPage from '../ExtraPageComponents/LoadingPage';

import ApiUrlContext from '../Api';

function OrderHistory({fromOwnerDash}){
    const { currentUser, role} = UserSessionContext()
    const apiUrl = useContext(ApiUrlContext)
    const [loading, setLoading] = useState(true)
    // view product should link to 
    const [groupedOrders, setGroupedOrders] = useState({})
    const [orderFiltering, setOrderFiltering] = useState('newest')

    const navigate = useNavigate()

    // Handles navigating to the equipments display
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
                let fetchUrl
                role === 'owner' ?  fetchUrl = `${apiUrl}owner/order/history/${currentUser.id}` : fetchUrl = `${apiUrl}user/order/history/${currentUser.id}`
                const response = await fetch(`${fetchUrl}`, {
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
                // setOrderHistory(data)
                groupOrdersByNumber(data.orders)
                setLoading(false)
            } catch (error) {
                console.error('Fetch Error:', error.message)
                
            }
        }
    
        fetchOrderHistory()
    }, [apiUrl, currentUser])


    // Group the orders by order numbers
    // Declare an object to hold the data, push the data into the object if the order.order_number matches, from there we set our state to this!
    const groupOrdersByNumber = (orders) => {
        const grouped = {}
        orders.forEach(order => {
            const groupKey = order.order_number
            if (!grouped[groupKey]) {
                grouped[groupKey] = []
            }
            grouped[groupKey].push(order)
        })
        setGroupedOrders(grouped)
    }


    if (loading){
        return <LoadingPage loadDetails={"your Order History"}/>
    }

    if(!currentUser){
        return <div> Not available </div>
    }


    if (groupedOrders && typeof groupedOrders === 'object') {
        // This tested whether or not I could do an object.entries map, (would return an array), which i would then map over the orders, and display the data I'm trying to display. 
        // I implement this more functionally in the return
        Object.entries(groupedOrders).forEach(([orderNumber, orders]) => {
            // console.log("Order Number:", orderNumber)
            orders.forEach((order) => {
                console.log("Order ID:", order.id)
                console.log("ORDER ORDER ORDER:", order)
                console.log("Order Details:", order.order_details)
                console.log("Total Amount:", order.total_amount)
                console.log("Equipment Name:", order.equipment.name)
                console.log("Equipment Image URL:", order.equipment.equipment_image)
            })
        })
    } else {
        console.log("groupedOrders is not an object or is empty")
    }


    // Test for loading page
    if (loading){
        return <LoadingPage loadDetails={"your Order History"}/>
    }

    // console.log("THE STATE ORDER HISTORY:", groupedOrders)
    // console.log(mappedOrderHistory)


    // Use object.values to make this into an array, and from there sort it and return the sorted data. Kind of similar to how we did it with the rental agreements
    // Filters the order history
    const getSortedOrderArray = () => {
      // Convert object into an array of order groups
      const orderGroups = Object.values(groupedOrders);
  
      // Sort these groups based on the 'order_datetime' of the first order in each group
      return orderGroups.sort((groupA, groupB) => {
          // Assuming each group has at least one order and each order has an 'order_datetime'
          const dateA = new Date(groupA[0].order_datetime)
          const dateB = new Date(groupB[0].order_datetime)
  
          return orderFiltering === 'newest' ? dateB - dateA : dateA - dateB;
      })
  }


  // Handles the order history filtering
    const handleOrderHistoryFiltering = (event) => {
    //   console.log('Selected value:', event.target.value)
      setOrderFiltering(event.target.value)
    }

    // console.log("FUNCTION OF GET SORTED ORDER ARRAY:", getSortedOrderArray())

    const navigateToOrderHistory = () => {
        navigate(`/order/history`)
    }


    return (
      <div className="bg-white">
          <div className="py-16 sm:py-24">
              <div className="max-w-7xl mx-auto sm:px-2 lg:px-8">
                  <div className="max-w-2xl mx-auto px-4 lg:max-w-4xl lg:px-0">
                      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
                      <p className="mt-2 text-sm text-gray-500">Check the status of recent orders, manage returns, and discover similar products.</p>
                      
                      <div className='flex flex-row'> 
                      <select 
                      className="block appearance-none w-auto bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 my-2 mr-4"
                      value={orderFiltering}
                      onChange={handleOrderHistoryFiltering}
                  >
                      <option value="" disabled>--Please choose an option--</option>
                      <option name="newest_option" value="newest" id="newest">Newest First</option>
                      <option name="oldest_option" value="oldest" id="oldest">Oldest First</option>
                  </select>

                  {fromOwnerDash === true && 
                        <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
                            <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={navigateToOrderHistory}>
                            Order History Page
                            </button>
                    </div>}
                    </div>
                  </div>

              </div>
              {/* first map over the returned array from the sorting */}
              {getSortedOrderArray().length > 0 ? (
                  getSortedOrderArray().map((orders) => (
                      <div key={orders[0].order_number} className="mt-16">
                          <div className="max-w-7xl mx-auto sm:px-2 lg:px-8">
                              <div className="max-w-2xl mx-auto space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                                  <div className="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border">
                                      <div className="p-4 border-b border-gray-200 sm:p-6">
                                          <dl className="grid grid-cols-2 gap-x-6 text-sm sm:grid-cols-3">
                                              <div>
                                                  <dt className="font-medium text-gray-900">Order number</dt>
                                                  <dd className="mt-1 text-gray-500">{orders[0].order_number}</dd>
                                              </div>
                                              <div>
                                                  <dt className="font-medium text-gray-900">Date placed</dt>
                                                  <dd className="mt-1 text-gray-500">
                                                      <time dateTime={orders[0].order_datetime}>
                                                          {new Date(orders[0].order_datetime).toLocaleDateString()}
                                                      </time>
                                                  </dd>
                                              </div>
                                              <div>
                                                  <dt className="font-medium text-gray-900">Total amount</dt>
                                                  <dd className="mt-1 font-medium text-gray-900">${(orders[0].total_amount / 100).toFixed(2)}</dd>
                                              </div>
                                          </dl>
                                      </div>
  
                                      <ul role="list" className="divide-y divide-gray-200">
                                      {/* Afterwards, map over the array of orders we get from the sorted array. The sorted array returns an array of arrays, so we're able to map over the arrays! */}
                                          {orders.map((order) => (
                                              <li className="p-4 sm:p-6" key={order.id}>
                                                  <div className="flex items-center sm:items-start">
                                                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40">
                                                          <img src={order?.equipment?.equipment_image} alt={`${order?.equipment?.make} ${order?.equipment?.model}`} className="w-full h-full object-center object-cover"/>
                                                      </div>
                                                      <div className="flex-1 ml-6 text-sm">
                                                          <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                                              <h5>{order.equipment.name}</h5>
                                                              <p className="mt-2 sm:mt-0">${order.individual_item_total.toFixed(2)}</p>
                                                          </div>
                                                          <p className="hidden text-gray-500 sm:block sm:mt-2">{order.order_details}</p>
                                                      </div>
                                                  </div>
  
                                                  <div className="mt-6 sm:flex sm:justify-between">
                                                      <div className="flex items-center">
                                                          <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                          </svg>
                                                          <p className="ml-2 text-sm font-medium text-gray-500">Estimated Delivery on <time dateTime={order.estimated_delivery_date}>{new Date(order.estimated_delivery_date).toLocaleDateString()}</time></p>
                                                      </div>
                                                      <div className="mt-6 border-t border-gray-200 pt-4 flex items-center space-x-4 divide-x divide-gray-200 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                                                          <div className="flex-1 flex justify-center">
                                                              <span className="text-indigo-600 whitespace-nowrap hover:text-indigo-500 cursor-pointer" onClick={() => handleEquipmentNavigation(order.equipment.id)}>View product</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))
              ) : (
                  <p className="text-center text-gray-500">No order history available.</p>
              )}
          </div>
      </div>
  )
}

export default OrderHistory;
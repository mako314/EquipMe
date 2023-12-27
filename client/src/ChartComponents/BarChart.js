import React, { useState, useEffect, useRef} from "react";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {toast} from 'react-toastify'
import { Bar } from 'react-chartjs-2';
import { useEquipmentData } from "./BarChartDataContext";

// useRef
function BarChart({currentUser}){

    const [existingData, setExistingData] = useState(currentUser?.equipment); // initialData is existing data
    const [initialDataLoaded, setInititalDataLoaded] = useState(false)
    const [updateCounter, setUpdateCounter] = useState(0)
    const [showAll, setShowAll] = useState(false)

    const { barChartEquipmentData, setBarChartEquipmentData } = useEquipmentData()

    const [monthlyData, setMonthlyData] = useState({
      labels: [],
      datasets: []
    })

    ChartJS.register(
        ArcElement, 
        Tooltip, 
        Legend, 
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
    )
    
    let totalEquipment = 0
    // console.log("totalEquipment:",totalEquipment )
    if (Array.isArray(currentUser?.equipment)) {
        currentUser.equipment.forEach(equip => {
            // console.log("each equipment:",equip )
            totalEquipment += equip.status[0]?.total_quantity
        })
    }

    // console.log("TOTAL EQUIPMENT:", totalEquipment)
    // console.log("EQUIPMENT STATE SUMMARIES:", currentUser.equipment)
    // console.log("")

    //------------------------BAR CHART--------------------------------------
    // https://codesandbox.io/p/devbox/reactchartjs-react-chartjs-2-vertical-jebqk?file=%2FApp. tsx%3A38%2C1-52%2C3
    // https://www.chartjs.org/docs/latest/axes/cartesian/linear.html
    // https://www.chartjs.org/docs/latest/charts/bar.html
    //Options that are set to the Chart.js Bar, options prop, 
    let barChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Rental Data',
          },
        },
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true, // Start the y-axis from zero
                max: totalEquipment ? (totalEquipment + 5) : 10, // the maximum value for the y-axis
            }
        }
      }

    // Set basic month names and identify it with the getMonthName function, 
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // Function to get the month name from a date
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth
    const getMonthName = (dateString) => {
        // console.log("THE DATE COMING IN:",dateString)
        // console.log("THE DATE STRING:", dateString)
        const date = new Date(dateString)
        const userTimezoneOffset = date.getTimezoneOffset() * 60000
        const correctedDate = new Date(date.getTime() + userTimezoneOffset)
        // console.log("THE CORRECTED DATE:", correctedDate)
        const month = correctedDate.getMonth()
        // console.log("THE MONTH:", month)
        // Month gets a number, 0-11, from there I reference the month name array and get the name

        // if(dateString ===)

        return monthNames[month]
      }

    // Call the function with data and totalEquipment count
    // I HAD AN ARRAY OF AN ARRAY AAAH

    const countAgreementsByMonth = (data = []) => {
      const monthCounts = data.reduce((acc, equipment) => {
        // Check if the data item contains 'equipment_state_summary'
        if (equipment.equipment_state_summary && Array.isArray(equipment.equipment_state_summary)) {
          equipment.equipment_state_summary.forEach(summary => {
            processSummary(acc, summary)
          })
        } else if (equipment.equipment_history_id) {
          // Direct processing for new data structure
          processSummary(acc, equipment)
        }
        return acc
      }, {})
    
      return Object.keys(monthCounts).map(month => {
        const monthData = monthCounts[month]
        return {
          month,
          allEquipment: monthData.totalQuantity,
          idleItems: monthData.totalIdle,
          cartTotalItems: monthData.totalInCart,
          reservedEquipment: monthData.totalReserved,
          cancelledEquipment: monthData.totalCancelled,
          maintainedEquipment: monthData.totalMaintenanceQuantity,
          rentedOutItems: monthData.totalRentedOut,
        }
      })
    }

    function processSummary(acc, summary) {
      const month = getMonthName(summary.date || summary.month); // Handle both date formats
      // equipment?.created_at
      const uniqueId = `${summary.equipment_history_id}-${summary.date || summary.month}`;
    
      if (!acc[month]) {
        acc[month] = {
          totalQuantity: 0,
          totalIdle: 0,
          totalReserved: 0,
          totalCancelled: 0,
          totalMaintenanceQuantity: 0,
          totalRentedOut: 0,
          totalInCart: 0,
        };
      }
    
      acc[month].totalQuantity = (acc[month].totalQuantity || 0) + summary.total_quantity

      // console.log("THE MONTH:", acc[month])
      // console.log("THE TOTAL QUANTITY COUNT:", acc[month])

      acc[month].totalIdle = (acc[month].totalIdle || 0) +  summary.total_available

      // acc[month].totalReserved = (acc[month].totalReserved || 0) + summary.total_reserved

      acc[month].totalCancelled = (acc[month].totalCancelled || 0) + summary.total_cancelled

      acc[month].totalMaintenanceQuantity = (acc[month].totalMaintenanceQuantity || 0) + summary.total_maintenance_quantity

      acc[month].totalRentedOut = (acc[month].totalRentedOut || 0) + summary.total_rented_out

      acc[month].totalInCart = (acc[month].totalInCart || 0) + summary.total_reserved
    
      // console.log("Processing data item:", summary)
      // console.log("Month:", month, "UniqueId:", uniqueId)
      // console.log("Accumulator after processing:", acc)

      // console.log(`Month: ${month}, Equipment ID: ${summary.equipment_id}, Equipment History ID: ${summary.equipment_history_id},Total In MAINTENANCE: ${acc[month].totalMaintenanceQuantity}, Idle Equipment: ${acc[month].totalIdle}, Total Equipment: ${acc[month].totalQuantity}, Total In Cart: ${acc[month].totalInCart}`)
    }

      async function updateChartData( allVisible = false ) {

        console.log("THIS IS THE VISIBLE:", allVisible)
        setShowAll(allVisible)
        console.log("THIS IS THE SHOW ALL:", showAll)
      // setMonthlyData({
      //     labels: [],
      //     datasets: []
      //   })
          const updateYear = new Date().getFullYear();
          const updateMonth = new Date().getMonth() + 1;
      
          try {
              const response = await fetch(`/summarize/${updateMonth}/${updateYear}`);
              const newDataObject = await response.json()

              console.log("Received data:", newDataObject)
      
              // Transform the object into an array
              const newDataArray = Object.entries(newDataObject).map(([key, value]) => ({
                  ...value,
                  month: key // Assuming the key represents the month
              }))
      
              console.log("Transformed array:", newDataArray)
             
              // let mergedData
              // console.log("THIS IS THE MERGED DATA:", mergedData)
              // updatedData

              // Merge with existing data
              // if (updateCounter > 0){
              //   return toast.warn(`❌ Please limit refreshes to once per page load!`,
              //   {
              //   "autoClose" : 2000
              //   })
              // // Process merged data
              // }

              const mergedData = [...existingData, ...newDataArray]

              // const mergedData = initialDataLoaded ? [...existingData, ...newDataArray] : newDataArray
              console.log("Merged Array:", mergedData)


              // updatedData = countAgreementsByMonth(mergedData !== null ? mergedData : monthlyData)

              const updatedData = countAgreementsByMonth(mergedData)

              const currentMonthData = countAgreementsByMonth(newDataArray)

              console.log("Updated array:", updatedData)
      
              // Clear existing data in chart
              // clearChartData(chartRef.current);
              const newChartData = {
                labels: updatedData.map(item => item.month),
                datasets : [
                      {
                          label: 'Total Equipment',
                          data: updatedData.map(item => item.allEquipment),
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          borderColor: 'rgba(255, 64, 129, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: 'Idle Items',
                          data: updatedData.map(item => item.idleItems),
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                          borderColor: 'rgba(25, 99, 201, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: '# of Times Rented Out',
                          data: updatedData.map(item => item.rentedOutItems),
                          backgroundColor: 'rgba(75, 181, 67, 0.5)',
                          borderColor: 'rgba(34, 139, 34, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: '# of Times In Carts',
                          data: updatedData.map(item => item.cartTotalItems),
                          backgroundColor: 'rgba(153, 102, 255, 0.2)',
                          borderColor: 'rgba(153, 102, 255, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: '# of Times Maintained Equipment (Repairs, Cleaning, ETC.)',
                          data: updatedData.map(item => item.maintainedEquipment),
                          backgroundColor: 'rgba(255, 165, 0, 0.5)',
                          borderColor: 'rgba(255, 140, 0, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: 'Cancelled',
                          data: updatedData.map(item => item.cancelledEquipment),
                          backgroundColor: 'rgba(128, 128, 128, 0.5)',
                          borderColor: 'rgba(105, 105, 105, 1)',
                          borderWidth: 2,
                      }
                  ]
              }

              const currentMonthMappedData = {
                labels: currentMonthData.map(item => item.month),
                datasets : [
                      {
                          label: 'Total Equipment',
                          data: currentMonthData.map(item => item.allEquipment),
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          borderColor: 'rgba(255, 64, 129, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: 'Idle Items',
                          data: currentMonthData.map(item => item.idleItems),
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                          borderColor: 'rgba(25, 99, 201, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: '# of Times Rented Out',
                          data: currentMonthData.map(item => item.rentedOutItems),
                          backgroundColor: 'rgba(75, 181, 67, 0.5)',
                          borderColor: 'rgba(34, 139, 34, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: '# of Times In Carts',
                          data: currentMonthData.map(item => item.cartTotalItems),
                          backgroundColor: 'rgba(153, 102, 255, 0.2)',
                          borderColor: 'rgba(153, 102, 255, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: '# of Times Maintained Equipment (Repairs, Cleaning, ETC.)',
                          data: currentMonthData.map(item => item.maintainedEquipment),
                          backgroundColor: 'rgba(255, 165, 0, 0.5)',
                          borderColor: 'rgba(255, 140, 0, 1)',
                          borderWidth: 2,
                      },
                      {
                          label: 'Cancelled',
                          data: currentMonthData.map(item => item.cancelledEquipment),
                          backgroundColor: 'rgba(128, 128, 128, 0.5)',
                          borderColor: 'rgba(105, 105, 105, 1)',
                          borderWidth: 2,
                      }
                  ]
              }
    

            // setUpdatedLabels(newLabels)
            // setUpdatedDatasets(newDatasets)
            // console.log('WHERE IS THIS DATA SET:',newDatasets[1].data[0])
            // console.log("this should be the # in carts, will look for 14:", newDatasets[3])
            // console.log("THE SHOW ALL:", showAll)

            if (allVisible){
            setBarChartEquipmentData(newChartData)
            }else{
            setMonthlyData(currentMonthMappedData)
            }
            console.log(monthlyData)

            setUpdateCounter(count => count + 1)
      
          } catch (error) {
              console.error('Error fetching equipment summaries:', error);
          }
      }

    

    // console.log(typeof(newData))
    useEffect(() => {
      if (currentUser?.equipment) {
          const initialProcessedData = countAgreementsByMonth(currentUser?.equipment)
          setBarChartEquipmentData({
              labels: initialProcessedData.map(item => item.month),
              datasets: [
                {
                    label: 'Total Equipment',
                    data: initialProcessedData.map(item => item.allEquipment),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Pink
                    borderColor: 'rgba(255, 64, 129, 1)', // Deeper pink
                    borderWidth: 2, // Border width dataset
                },
                {
                    label: 'Idle Items',
                    data: initialProcessedData.map(item => item.idleItems),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)', // Blue
                    borderColor: 'rgba(25, 99, 201, 1)', // Deeper blue
                    borderWidth: 2,
                },
                {
                  label: '# of Times Rented Out',
                  data: initialProcessedData.map(item => item.rentedOutItems),
                  backgroundColor: 'rgba(75, 181, 67, 0.5)', // Green
                  borderColor: 'rgba(34, 139, 34, 1)', // Deeper green
                  borderWidth: 2,
                },
                {
                  label: '# of Times In Carts',
                  data: initialProcessedData.map(item => item.cartTotalItems),
                  backgroundColor: 'rgba(153, 102, 255, 0.2)', // Purple
                  borderColor: 'rgba(153, 102, 255, 1)', // Deeper Purple
                  borderWidth: 2,
                },
                {
                  label: '# of Times Maintained Equipment (Repairs, Cleaning, ETC.)',
                  data: initialProcessedData.map(item => item.maintainedEquipment),
                  backgroundColor: 'rgba(255, 165, 0, 0.5)', // Orange
                  borderColor: 'rgba(255, 140, 0, 1)', // Darker Orange
                  borderWidth: 2,
                },
                {
                  label: 'Cancelled',
                  data: initialProcessedData.map(item => item.cancelledEquipment),
                  backgroundColor: 'rgba(128, 128, 128, 0.5)', // Gray
                  borderColor: 'rgba(105, 105, 105, 1)', // Darker Gray
                  borderWidth: 2,
                },
               
            ],
          })
      }
      // setInititalDataLoaded(true)
      setShowAll(true)
      
  }, [currentUser])

  console.log("THE CHART DATA:", monthlyData)
  
    return(
        
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <div className="flex justify-center space-x-4 mb-4">
      <button 
        className='mb-4 text-lg font-semibold bg-orange-500 text-white py-2 px-6 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1'
        onClick={() => updateChartData(false)}
      >
        Refresh Data
      </button>

      <button 
        className='mb-4 text-lg font-semibold bg-orange-500 text-white py-2 px-6 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1'
        onClick={() => updateChartData(true)}
      >
        Show All Data
      </button>
      </div>

      <div className="w-full h-full">
      {showAll ? (
          <Bar data={barChartEquipmentData} options={barChartOptions} />
        ) : (
          <Bar data={monthlyData} options={barChartOptions} />
        )}
    </div>

    </div>
        
    )
}

export default BarChart

        // console.log("THE CURRENT DATE:", equipment.equipment_state_summary.date)

        // const month = getMonthName(equipment.equipment_state_summary.date)

        // // console.log('THE CURRENT MONTH',month)

        // if (!acc[month]) {
        //   acc[month] = {
        //     totalQuantity: 0,
        //     totalIdle: 0,
        //     totalReserved: 0,
        //     totalCancelled: 0,
        //     totalMaintenanceQuantity: 0,
        //     totalRentedOut: 0,
        //     totalInCart: 0,
        //     // totalMonthlyEquipment: 0,
        // }}

        // acc[month].totalQuantity = (acc[month].totalQuantity || 0) + equipment.equipment_state_summary.totalQuantity

        // acc[month].totalIdle = (acc[month].totalIdle || 0) + equipment.equipment_state_summary.total_quantity - equipment.equipment_state_summary.total_available

        // acc[month].totalReserved = (acc[month].totalReserved || 0) + equipment.equipment_state_summary.totalReserved

        // acc[month].totalCancelled = (acc[month].totalCancelled || 0) + equipment.equipment_state_summary.totalCancelled

        // acc[month].totalMaintenanceQuantity = (acc[month].totalMaintenanceQuantity || 0) + equipment.equipment_state_summary.totalMaintenanceQuantity

        // acc[month].totalRentedOut = (acc[month].totalRentedOut || 0) + equipment.equipment_state_summary.totalRentedOut

        // acc[month].totalInCart = (acc[month].totalInCart || 0) + equipment.equipment_state_summary.total_reserved

        // equipment.state_summary?.forEach(summary => {
        //   console.log("THE SUMMARY:", summary)
            // Send the current month in created_at (the date string or date object really, and have it find the month)
            // console.log("THE FOR EACH HISTORY:", history)
            // history.equipment_state_summary?.forEach(summary => {
            //   console.log("THE FOR EACH summary:", summary)
            //   console.log("THE MONTH", acc[month])
            //     //console.log()
            //   acc[month].totalQuantity = (acc[month].totalQuantity || 0) + summary.totalQuantity
            //   acc[month].totalIdle = (acc[month].totalIdle || 0) + summary.total_idle
            // //   acc[month].totalReserved = (acc[month].totalReserved || 0) + summary.totalReserved
            //   acc[month].totalCancelled = (acc[month].totalCancelled || 0) + summary.totalCancelled
            //   acc[month].totalMaintenanceQuantity = (acc[month].totalMaintenanceQuantity || 0) + summary.totalMaintenanceQuantity
            //   acc[month].totalRentedOut = (acc[month].totalRentedOut || 0) + summary.totalRentedOut
            //   acc[month].totalInCart = (acc[month].totalInCart || 0) + summary.total_reserved
            // })
          // })

        // if (!acc[month]) {
        //     acc[month] = {
        //         totalRentedOut: 0,
        //         totalInCart: 0,
        //         totalMonthlyEquipment: 0
        //     }
        // }

        // If agreement status is completed, it assumes an owner has succesfully rented out the equipment.
        // if (agreement?.agreement_status === 'completed') {
        //     acc[month].totalRentedOut += 1
        //     // console.log("HOW MANY ARE BEING RENTED OUT:", acc[month].totalRentedOut)
        // }

        
        // Check if cart_item exists and is an object, then add its quantity 
        // I was having so many issues with not being able to find the quantity, but doing typeof seems to have fixed it.
        // if (agreement?.cart_item && typeof agreement.cart_item === 'object') {
        //     acc[month].totalInCart += agreement.cart_item.quantity
        //     // console.log("ITEM:", agreement.cart_item)
        //     // console.log("ITEM agreement.cart_item.quantity:", agreement.cart_item.quantity)
        // }

        // console.log("THE AGREEMENT CART ITEM:", agreement?.cart_item)
        // console.log('TESTING TO SEE HOW MANY ITEMS:', acc[month])
        // console.log("THE TOTAL RENTED OUT PER MONTH:",acc[month].totalRentedOut)
        // console.log("THE TOTAL IN CART  PER MONTH:", acc[month].totalInCart += agreement.cart_item.quantity)
        // if (Array.isArray(agreement.cart_item.equipment)) {
        //     // console.log("THE EQUIPMENT QUANTITIES: ", agreement.cart_item.equipment.quantity)
        //     // console.log("MONTHLY TOTAL EQUIPMENT: ", agreement.cart_item.equipment.quantity)
        //     acc[month].totalMonthlyEquipment +=  agreement.cart_item.equipment.quantity   
        // }

        // Update monthly count
        // return acc



//---------------------------------ATTEMPT 2 ------------------------------

        // function updateChartData() {
     
        //   const updateYear = new Date().getFullYear()
        //   const updateMonth = new Date().getMonth() + 1
    
        //   console.log("YEAR:", updateYear)
        //   console.log("MONTH:", updateMonth)
      
        //   fetch(`/summarize/${updateMonth}/${updateYear}`)
        //       .then(response => response.json())
        //       .then(data => {
        //         console.log("UPDATED DATA:", data)
        //         // Transform the object into an array
        //         const newDataArray = Object.keys(data).map(key => {
        //           return {
        //               equipmentId: key,
        //               ...data[key]
        //           }
        //         })
    
        //         console.log('THE NEW DATA ARRAY',newDataArray)
        //         console.log("THE EXISTING DATA ARRAY:", existingData)
        //         const mergedData = [...existingData, ...newDataArray]
        //         console.log("THE MERGED DATA:", mergedData)
        //         const updatedData = countAgreementsByMonth(mergedData)
        //         // console.log("THE UPDATED DATA", updatedData)
        //         const newChartData = {
        //           labels: updatedData.map(item => item.month),
        //           datasets: [
        //               {
        //                   label: 'Total Equipment',
        //                   data: updatedData.map(item => item.allEquipment),
        //                   backgroundColor: 'rgba(255, 99, 132, 0.2)', // Pink
        //                   borderColor: 'rgba(255, 64, 129, 1)', // Deeper pink
        //                   borderWidth: 2, // Border width dataset
        //               },
        //               {
        //                   label: 'Idle Items',
        //                   data: updatedData.map(item => item.idleItems),
        //                   backgroundColor: 'rgba(53, 162, 235, 0.5)', // Blue
        //                   borderColor: 'rgba(25, 99, 201, 1)', // Deeper blue
        //                   borderWidth: 2,
        //               },
        //               {
        //                 label: '# of Times Rented Out',
        //                 data: updatedData.map(item => item.rentedOutItems),
        //                 backgroundColor: 'rgba(75, 181, 67, 0.5)', // Green
        //                 borderColor: 'rgba(34, 139, 34, 1)', // Deeper green
        //                 borderWidth: 2,
        //               },
        //               {
        //                 label: '# of Times In Carts',
        //                 data: updatedData.map(item => item.cartTotalItems),
        //                 backgroundColor: 'rgba(153, 102, 255, 0.2)', // Purple
        //                 borderColor: 'rgba(153, 102, 255, 1)', // Deeper Purple
        //                 borderWidth: 2,
        //               },
        //               {
        //                 label: '# of Times Maintained Equipment (Repairs, Cleaning, ETC.)',
        //                 data: updatedData.map(item => item.maintainedEquipment),
        //                 backgroundColor: 'rgba(255, 165, 0, 0.5)', // Orange
        //                 borderColor: 'rgba(255, 140, 0, 1)', // Darker Orange
        //                 borderWidth: 2,
        //               },
        //               {
        //                 label: 'Cancelled',
        //                 data: updatedData.map(item => item.cancelledEquipment),
        //                 backgroundColor: 'rgba(128, 128, 128, 0.5)', // Gray
        //                 borderColor: 'rgba(105, 105, 105, 1)', // Darker Gray
        //                 borderWidth: 2,
        //               },
        
        //           ],
        //         }
        //         // setMonthlyData(newChartData) // Update the chart data
        //         // setUpdateCounter(count => count + 1) // Increment the counter to force re-render
    
        //         // setShouldRedraw(true)
    
        //         // // // Increment the update counter to force re-render
        //         // // setUpdateCounter(count => count + 1)
    
        //         // // // Reset redraw flag after a short delay
        //         // setTimeout(() => setShouldRedraw(false), 500)
        //         // if (chartRef.current) {
        //         //   chartRef.current.data = monthlyData
        //         //   chartRef.current.update()
        //         // }
    
        //       //   if (chartRef.current) {
        //       //     chartRef.current.chartInstance.update();
        //       // }
    
        //       setTimeout(() => {
        //         if (chartRef.current) {
        //             chartRef.current.chartInstance.update()
        //         }
        //     }, 0)
    
        //       })
        //       .catch(error => {
        //           console.error('Error fetching equipment summaries:', error)
        //       })
        // }


//---------------------------------ATTEMPT 3 ------------------------------

      //   async function updateChartData() {
      //     const updateYear = new Date().getFullYear();
      //     const updateMonth = new Date().getMonth() + 1;
      
      //     try {
      //         const response = await fetch(`/summarize/${updateMonth}/${updateYear}`);
      //         const newDataObject = await response.json();
      //         console.log("Received data:", newDataObject);
      
      //         // Transform the object into an array
      //         const newDataArray = Object.entries(newDataObject).map(([key, value]) => ({
      //             ...value,
      //             month: key // Assuming the key represents the month
      //         }));
      
      //         console.log("Transformed array:", newDataArray);
      
      //         // Merge with existing data
      //         const mergedData = [...existingData, ...newDataArray];
      
      //         // Process merged data
      //         const updatedData = countAgreementsByMonth(mergedData);
      
      //         console.log("Updated array:", updatedData)
      
      //         // Clear existing data in chart
      //         clearChartData(chartRef.current);
      
      //         // Add new data to the chart
      //         updatedData.forEach(dataItem => {
      //           console.log(dataItem)
      //             const label = dataItem.month; // Modify as needed based on your data structure
      //             const newDataPoints = [
      //                 dataItem.total_quantity,        // Total Quantity
      //                 dataItem.total_available,       // Total Available
      //                 dataItem.total_rented_out,      // Total Rented Out
      //                 dataItem.total_reserved,        // Total Reserved
      //                 dataItem.total_maintenance,     // Total Maintenance
      //                 dataItem.total_cancelled        // Total Cancelled
      //             ];
      
      //             addData(chartRef.current, label, newDataPoints);
      //         });
      //         setUpdateCounter(prevCounter => prevCounter + 1)
      
      //     } catch (error) {
      //         console.error('Error fetching equipment summaries:', error);
      //     }
      // }

      //---------------------------------ATTEMPT 4 ------------------------------
      
      // function clearChartData(chart) {
      //   chart.data.labels = [];
      //   chart.data.datasets.forEach((dataset) => {
      //       dataset.data = [];
      //   });
      //   chart.update();
      // }
      
      // function addData(chart, label, newDataPoints) {
      //   chart.data.labels.push(label);
      //   chart.data.datasets.forEach((dataset, index) => {
      //       dataset.data.push(newDataPoints[index] || 0);
      //   });
      //   chart.update();
      // }

    //   async function updateChartData() {
    //     const updateYear = new Date().getFullYear();
    //     const updateMonth = new Date().getMonth() + 1;
    
    //     console.log("YEAR:", updateYear);
    //     console.log("MONTH:", updateMonth);
    
    //     try {
    //         const response = await fetch(`/summarize/${updateMonth}/${updateYear}`);
    //         const data = await response.json();
    //         console.log("UPDATED DATA:", data);
    
    //         // Transform the object into an array
    //         const newDataArray = Object.keys(data).map(key => ({
    //             equipmentId: key,
    //             ...data[key]
    //         }));
    
    //         console.log('THE NEW DATA ARRAY', newDataArray);
    //         console.log("THE EXISTING DATA ARRAY:", existingData);
    
    //         const mergedData = [...existingData, ...newDataArray];
    //         console.log("THE MERGED DATA:", mergedData);
    
    //         const updatedData = countAgreementsByMonth(mergedData);
    //         const newChartData = {
    //             labels: updatedData.map(item => item.month),
    //             datasets: [
    //                 {
    //                     label: 'Total Equipment',
    //                     data: updatedData.map(item => item.allEquipment),
    //                     backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //                     borderColor: 'rgba(255, 64, 129, 1)',
    //                     borderWidth: 2,
    //                 },
    //                 {
    //                     label: 'Idle Items',
    //                     data: updatedData.map(item => item.idleItems),
    //                     backgroundColor: 'rgba(53, 162, 235, 0.5)',
    //                     borderColor: 'rgba(25, 99, 201, 1)',
    //                     borderWidth: 2,
    //                 },
    //                 {
    //                     label: '# of Times Rented Out',
    //                     data: updatedData.map(item => item.rentedOutItems),
    //                     backgroundColor: 'rgba(75, 181, 67, 0.5)',
    //                     borderColor: 'rgba(34, 139, 34, 1)',
    //                     borderWidth: 2,
    //                 },
    //                 {
    //                     label: '# of Times In Carts',
    //                     data: updatedData.map(item => item.cartTotalItems),
    //                     backgroundColor: 'rgba(153, 102, 255, 0.2)',
    //                     borderColor: 'rgba(153, 102, 255, 1)',
    //                     borderWidth: 2,
    //                 },
    //                 {
    //                     label: '# of Times Maintained Equipment (Repairs, Cleaning, ETC.)',
    //                     data: updatedData.map(item => item.maintainedEquipment),
    //                     backgroundColor: 'rgba(255, 165, 0, 0.5)',
    //                     borderColor: 'rgba(255, 140, 0, 1)',
    //                     borderWidth: 2,
    //                 },
    //                 {
    //                     label: 'Cancelled',
    //                     data: updatedData.map(item => item.cancelledEquipment),
    //                     backgroundColor: 'rgba(128, 128, 128, 0.5)',
    //                     borderColor: 'rgba(105, 105, 105, 1)',
    //                     borderWidth: 2,
    //                 }
    //             ],
    //         };
    
    //         // Update chart data state
    //         setMonthlyData(newChartData);
    //         setUpdateCounter(count => count + 1)
    
    //         setTimeout(() => {
    //             if (chartRef.current) {
    //                 chartRef.current.update();
    //             }
    //         }, 0);
    
    //     } catch (error) {
    //         console.error('Error fetching equipment summaries:', error);
    //     }
    // }

      //---------------------------------ATTEMPT 5 ------------------------------

    // Count agreements per month
    // https://www.w3schools.com/jsref/jsref_reduce.asp
    // https://www.youtube.com/watch?v=XKD0aIA3-yM&list=PLo63gcFIe8o0nnhu0F-PpsTc8nkhNe9yu
    // const countAgreementsByMonth = (data = []) => {
    //     const monthCounts = data.reduce((acc, equipment) => {
    //       console.log("THE DATA COMING IN:", data)
    //       console.log("THE EQUIPMENT ITEM :", equipment)
        
    //     // console.log("the EQUIPMENT in the reducer:", equipment)
    //     // console.log("the EQUIPMENT STATE SUMMARY:", data)
    //     //Send the current month in created_at (the date string or date object really, and have it find the month)
    //     // const month = getMonthName(equipment?.created_at)
    //     // console.log("AGREEMENT CREATED AT:", agreement?.created_at)

    //     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

    //     const processedIds = new Set()
    //     let calculateForEach 
    //     if (equipment.equipment_state_summary && Array.isArray(equipment.equipment_state_summary)){
    //       calculateForEach = equipment.equipment_state_summary
    //     } else if (equipment.equipment_history_id) {
          
    //     }

    //     {
    //       equipment.equipment_state_summary.forEach(summary => {

    //         // console.log(summary)

    //         const month = getMonthName(summary.date)
    //         const uniqueId = `${summary.equipment_history_id}-${summary.date}`
    //         // Skip if this state summary has already been processed
    //         if (processedIds.has(uniqueId)) {
    //           return
    //         }
    //         processedIds.add(uniqueId)
    //         // console.log("the EQUIPMENT STATE DATE:", summary.date)
    //         // console.log("LETS SEE IF WE GET THE MONTHS:", month)

    //         if (!acc[month]) {
    //           acc[month] = {
    //             totalQuantity: 0,
    //             totalIdle: 0,
    //             totalReserved: 0,
    //             totalCancelled: 0,
    //             totalMaintenanceQuantity: 0,
    //             totalRentedOut: 0,
    //             totalInCart: 0,
    //             // totalMonthlyEquipment: 0,
    //         }}
    //         acc[month].totalQuantity = (acc[month].totalQuantity || 0) + summary.total_quantity

    //         // console.log("THE MONTH:", acc[month])
    //         // console.log("THE TOTAL QUANTITY COUNT:", acc[month])

    //         acc[month].totalIdle = (acc[month].totalIdle || 0) +  summary.total_available

    //         // acc[month].totalReserved = (acc[month].totalReserved || 0) + summary.total_reserved

    //         acc[month].totalCancelled = (acc[month].totalCancelled || 0) + summary.total_cancelled

    //         acc[month].totalMaintenanceQuantity = (acc[month].totalMaintenanceQuantity || 0) + summary.total_maintenance_quantity

    //         acc[month].totalRentedOut = (acc[month].totalRentedOut || 0) + summary.total_rented_out

    //         acc[month].totalInCart = (acc[month].totalInCart || 0) + summary.total_reserved

    //         // console.log(`Month: ${month}, Equipment ID: ${summary.equipment_id}, Equipment History ID: ${summary.equipment_history_id}, Idle Equipment: ${acc[month].totalIdle}, Total Equipment: ${acc[month].totalQuantity}, Total In Cart: ${acc[month].totalInCart}`)

    //         console.log("Processing equipment state summary:", summary)
    //         console.log("Month:", month, "UniqueId:", uniqueId)
    //         console.log("Accumulator before processing:", acc)

    //       })
    //     }
    //     return acc
    //     }, {})
    //     // Calculate monthly idle equipment and map results
    //     // console.log("Month Counts:", monthCounts)
    //     return Object.keys(monthCounts).map(month => {
    //     const monthData = monthCounts[month]
    //     // const totalIdle = monthData.totalMonthlyEquipment - monthData.totalRentedOut - monthData.totalInCart

    //     // const totalIdle = (totalEquipment - monthData.totalRentedOut) - monthData.totalInCart

    //     // console.log("TOTAL EQUIPMENT:",totalEquipment)
    //     // console.log("Total Equipment:", totalEquipment)
    //     // console.log("Total QUANTITY for " + month + ":", monthData.totalQuantity)
    //     // console.log("Total IDLE for " + month + ":", monthData.totalIdle)
    //     // console.log("Total RENTED Out for " + month + ":", monthData.totalRentedOut)
    //     // console.log("Total IN CART for " + month + ":", monthData.totalInCart)
        
    //     return {
    //         month,
    //         allEquipment: monthData.totalQuantity,
    //         idleItems: monthData.totalIdle > 0 ? monthData.totalIdle : 0,
    //         cartTotalItems: monthData.totalInCart,
    //         reservedEquipment: monthData.totalReserved,
    //         cancelledEquipment: monthData.totalCancelled,
    //         maintainedEquipment: monthData.totalMaintenanceQuantity,
    //         rentedOutItems: monthData.totalRentedOut,
             
    //     }
    //     })
    // }

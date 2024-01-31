import React, { useState, useEffect, useRef, useContext} from "react";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {toast} from 'react-toastify'
import { Bar } from 'react-chartjs-2';
import { useEquipmentData } from "./BarChartDataContext";
import ApiUrlContext from "../Api";
import LoadingPage from "../ExtraPageComponents/LoadingPage";

// useRef
function BarChart({currentUser, setDashLoad}){

    // const [existingData, setExistingData] = useState(currentUser?.equipment); // initialData is existing data
    const [existingData, setExistingData] = useState(null)
    // const [updateCounter, setUpdateCounter] = useState(0)
    const [showAll, setShowAll] = useState(false)
    const apiUrl = useContext(ApiUrlContext)

    // console.log("THE API URL:", apiUrl)

    // I needed to make a context to hold some data so it would persist
    const { barChartEquipmentData, setBarChartEquipmentData } = useEquipmentData()

    useEffect(() => {
      if (currentUser?.equipment) {
        setExistingData(currentUser.equipment)
      }
    }, [currentUser])

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
    // Options that are set to the Chart.js Bar, options prop, 
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

    // Call the function wth data and totalEquipment count

    function countAgreementsByMonth(data = []) {
      const latestSummaries = {} // Map to store the latest summary for each equipment
      const monthCounts = {}
    
      // Determine the latest summary for each equipment ID, the data that's coming in for the joint (all months overview, is currentUser.equipment, which has a .equipment_state_summary) and my fetched update, which has no item.equipment_state_summary
      data.forEach(item => {
        let summaries = item.equipment_state_summary || [item]
        summaries.forEach(summary => {
          const equipmentId = summary.equipment_id
          const historyId = summary.equipment_history_id
          if (!latestSummaries[equipmentId] || latestSummaries[equipmentId].equipment_history_id < historyId) {
            latestSummaries[equipmentId] = summary
          }
        });
      });
    
      // Process each latest summary
      Object.values(latestSummaries).forEach(summary => {
        processSummary(monthCounts, summary)
      })
      
      // Map the accumulated data to the desired format
      return Object.keys(monthCounts).map(month => {
          const monthData = monthCounts[month];
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

        const month = getMonthName(summary.date || summary.month)

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

      // Update month data with the latest summary
      // Accumulate data
      acc[month].totalQuantity = (acc[month].totalQuantity || 0) + summary.total_quantity


      acc[month].totalIdle = (acc[month].totalIdle || 0) +  summary.total_available

      // acc[month].totalReserved = (acc[month].totalReserved || 0) + summary.total_reserved

      acc[month].totalCancelled = (acc[month].totalCancelled || 0) + summary.total_cancelled

      acc[month].totalMaintenanceQuantity = (acc[month].totalMaintenanceQuantity || 0) + summary.total_maintenance_quantity

      acc[month].totalRentedOut = (acc[month].totalRentedOut || 0) + summary.total_rented_out

      acc[month].totalInCart = (acc[month].totalInCart || 0) + summary.total_reserved
      

      return acc
    }



    // const uniqueSummaries = new Set()

      async function updateChartData( allVisible = false ) {

        // console.log("THIS IS THE VISIBLE:", allVisible)
        setShowAll(allVisible)
        // console.log("THIS IS THE SHOW ALL:", showAll)

        // if (allVisible && updateCounter > 0) {
        //   // Data has already been fetched and is up-to-date
        //   return
        // }

          const updateYear = new Date().getFullYear()
          const updateMonth = new Date().getMonth() + 1
      
          try {
              const response = await fetch(`${apiUrl}summarize/${updateMonth}/${updateYear}/${currentUser.id}`)
              const newDataObject = await response.json()

              // console.log("Received data:", newDataObject)
      
              // Transform the object into an array
              const newDataArray = Object.entries(newDataObject).map(([key, value]) => ({
                  ...value,
                  month: key // Assuming the key represents the month
              }))
      


              if (allVisible) {
                // updateAllDataWithMonthlyChanges()
                setBarChartEquipmentData([]) // Resetting to an empty array
              }

              // console.log("THE EXISTING ARRAY:", existingData)

              // console.log("THE NEW DATA ARRAY:", newDataArray)

              const mergedData = [...existingData, ...newDataArray]

              // const mergedData = initialDataLoaded ? [...existingData, ...newDataArray] : newDataArray
              // console.log("Merged Array:", mergedData)


              // updatedData = countAgreementsByMonth(mergedData !== null ? mergedData : monthlyData)

              const updatedData = countAgreementsByMonth(mergedData)

              // console.log("NEW DATA ARRAY:", newDataArray)

              const currentMonthData = countAgreementsByMonth(newDataArray)
              // console.log("currentMonthData Array:", currentMonthData)

              // console.log("Updated array:", updatedData)
      
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

              // console.log("NEW CHART DATA FOR ALL THE CHARTS array:", newChartData)

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
            // setUpdateCounter(count => count + 1)
            
            }else{
            setMonthlyData(currentMonthMappedData)
            
            }
            // console.log(monthlyData)

            
      
          } catch (error) {
              console.error('Error fetching equipment summaries:', error);
          }
      }

      // console.log("THE BAR CHART EQUIPMENTDATA",barChartEquipmentData)
      // console.log("THE MONTHLY DATA:", monthlyData)


    // console.log(typeof(newData))
    // console.log("CURRENT USER:", currentUser?.equipment)
    useEffect(() => {
      if (currentUser?.equipment && Array.isArray(currentUser?.equipment)) {
          const initialProcessedData = countAgreementsByMonth(currentUser?.equipment)
          console.log("THE INTIIAL PROCESSED DATA:", initialProcessedData)
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
      // setDashLoad(false)
      
  }, [currentUser])

  // console.log("THE BAR CHART EQUIPMENT DATA:", barChartEquipmentData)

  if (!existingData) {
    return <LoadingPage loadDetails={"Loading equipment data..."}/>
  }


  // console.log("THE CHART DATA:", monthlyData)
  
    return (
      // conditional here is the first thing written, so instead of jsx we just use the variable and a ternary to determine if the equipment length is === 0 
      currentUser.equipment.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center text-gray-800">
          <p className="text-lg font-medium">No listed equipment quite yet, we'll populate this chart for you after you've listed one to track all the essentials!</p>
        </div>
      ) : 
      (
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

        {/* <div className="w-full h-full">
        {showAll ? (
            barChartEquipmentData && barChartEquipmentData.labels.length > 0 ? (
                <Bar data={barChartEquipmentData} options={barChartOptions} />
            ) : (
                <LoadingPage loadDetails={"Loading your chart"}/>
            )
        ) : (
            monthlyData && monthlyData.labels.length > 0 ? (
                <Bar data={monthlyData} options={barChartOptions} />
            ) : (
                <LoadingPage loadDetails={"Loading your chart"}/>
            )
        )}
        </div> */}

      <div className="w-full h-full">
          {(barChartEquipmentData && barChartEquipmentData.labels.length > 0) || (monthlyData && monthlyData.labels.length > 0) ? (
              <Bar data={showAll ? barChartEquipmentData : monthlyData} options={barChartOptions} />
          ) : (
              // Display this message when there is no chart data
              <div className="flex items-center justify-center h-full text-center text-gray-800">
                  <p className="text-lg font-medium">No listed equipment quite yet, we'll populate this chart for you after you've listed one to track all the essentials!</p>
              </div>
          )}
      </div>

        </div>
  ))
}

export default BarChart


              // console.log("Transformed array:", newDataArray)
             
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

              // let testData;
              // if (allVisible && updateCounter < 1) {
              //     // Update or add new data points in existing data
              //     testData = barChartEquipmentData.datasets.map(dataset => {
              //         const updatedDatasetData = dataset.data.slice(); // Clone the data array

              //         newDataArray.forEach(newData => {
              //             const monthIndex = barChartEquipmentData.labels.indexOf(newData.month);
              //             if (monthIndex !== -1) {
              //                 // Month exists, update data
              //                 updatedDatasetData[monthIndex] = newData[dataset.label.toLowerCase().replace(/ /g, "_")];
              //             } else {
              //                 // Month doesn't exist, add new month and data
              //                 barChartEquipmentData.labels.push(newData.month);
              //                 updatedDatasetData.push(newData[dataset.label.toLowerCase().replace(/ /g, "_")]);
              //             }
              //         });

              //         return { ...dataset, data: updatedDatasetData };
              //     });

              //     // Update state
              //     setBarChartEquipmentData({ ...barChartEquipmentData, datasets: testData });
              // } else {

              // }
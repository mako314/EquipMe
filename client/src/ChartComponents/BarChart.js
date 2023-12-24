import React from "react";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

function BarChart({currentUser}){
    console.log("CURRENT USER TO LOOK FOR EQUIPMENT STATE SUMMARIES FOR:", currentUser)
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
        console.log("THE DATE STRING:", dateString)
        const date = new Date(dateString)
        const userTimezoneOffset = date.getTimezoneOffset() * 60000
        const correctedDate = new Date(date.getTime() + userTimezoneOffset)
        console.log("THE CORRECTED DATE:", correctedDate)
        const month = correctedDate.getMonth()
        console.log("THE MONTH:", month)
        // Month gets a number, 0-11, from there I reference the month name array and get the name
        return monthNames[month]
      }

    // Count agreements per month
    // https://www.w3schools.com/jsref/jsref_reduce.asp
    // https://www.youtube.com/watch?v=XKD0aIA3-yM&list=PLo63gcFIe8o0nnhu0F-PpsTc8nkhNe9yu
    const countAgreementsByMonth = (data = []) => {
        const monthCounts = data.reduce((acc, equipment) => {
        // console.log("the EQUIPMENT in the reducer:", equipment)
        // console.log("the EQUIPMENT STATE SUMMARY:", data)
        //Send the current month in created_at (the date string or date object really, and have it find the month)
        // const month = getMonthName(equipment?.created_at)
        // console.log("AGREEMENT CREATED AT:", agreement?.created_at)

        if (equipment.equipment_state_summary && Array.isArray(equipment.equipment_state_summary)) {
          equipment.equipment_state_summary.forEach(summary => {

            const month = getMonthName(summary.date)

            // console.log("the EQUIPMENT STATE DATE:", summary.date)
            // console.log("LETS SEE IF WE GET THE MONTHS:", month)

            if (!acc[month]) {
              acc[month] = {
                totalQuantity: 0,
                totalIdle: 0,
                totalReserved: 0,
                totalCancelled: 0,
                totalMaintenanceQuantity: 0,
                totalRentedOut: 0,
                totalInCart: 0,
                // totalMonthlyEquipment: 0,
            }}
            acc[month].totalQuantity = (acc[month].totalQuantity || 0) + summary.total_quantity

            // console.log("THE MONTH:", acc[month])
            // console.log("THE TOTAL QUANTITY COUNT:", acc[month])

            acc[month].totalIdle = (acc[month].totalIdle || 0) +  summary.total_available

            acc[month].totalReserved = (acc[month].totalReserved || 0) + summary.total_reserved

            acc[month].totalCancelled = (acc[month].totalCancelled || 0) + summary.total_cancelled

            acc[month].totalMaintenanceQuantity = (acc[month].totalMaintenanceQuantity || 0) + summary.total_maintenance_quantity

            acc[month].totalRentedOut = (acc[month].totalRentedOut || 0) + summary.total_rented_out

            acc[month].totalInCart = (acc[month].totalInCart || 0) + summary.total_reserved

          })
        }
        return acc
        }, {})
        // Calculate monthly idle equipment and map results
        // console.log("Month Counts:", monthCounts)
        return Object.keys(monthCounts).map(month => {
        const monthData = monthCounts[month]
        // const totalIdle = monthData.totalMonthlyEquipment - monthData.totalRentedOut - monthData.totalInCart

        // const totalIdle = (totalEquipment - monthData.totalRentedOut) - monthData.totalInCart

        // console.log("TOTAL EQUIPMENT:",totalEquipment)
        // console.log("Total Equipment:", totalEquipment)
        // console.log("Total QUANTITY for " + month + ":", monthData.totalQuantity)
        // console.log("Total IDLE for " + month + ":", monthData.totalIdle)
        // console.log("Total RENTED Out for " + month + ":", monthData.totalRentedOut)
        // console.log("Total IN CART for " + month + ":", monthData.totalInCart)
        
        return {
            month,
            allEquipment: monthData.totalQuantity,
            idleItems: monthData.totalIdle > 0 ? monthData.totalIdle : 0,
            cartTotalItems: monthData.totalInCart,
            reservedEquipment: monthData.totalReserved,
            cancelledEquipment: monthData.totalCancelled,
            maintainedEquipment: monthData.totalMaintenanceQuantity,
            rentedOutItems: monthData.totalRentedOut,
             
        }
        })
    }

    // totalEquipment -= totalRentedOut
    // totalIdle = totalEquipment -= totalInCart

    // Call the function with data and totalEquipment count
    const equipmentTotalData = currentUser?.equipment // I HAD AN ARRAY OF AN ARRAY AAAH
    // console.log("equipmentTotalData DATA:", equipmentTotalData)
    let barChartdata = {
      labels: [],
      datasets: []
    }

    if (equipmentTotalData) {
        const monthlyData = countAgreementsByMonth(equipmentTotalData)
        if (monthlyData && monthlyData.length > 0) {
        barChartdata = {
          labels: monthlyData.map(item => item.month),
          datasets: [
              {
                  label: 'Total Equipment',
                  data: monthlyData.map(item => item.allEquipment),
                  backgroundColor: 'rgba(255, 99, 132, 0.2)', // Pink
                  borderColor: 'rgba(255, 64, 129, 1)', // Deeper pink
                  borderWidth: 2, // Border width dataset
              },
              {
                  label: 'Idle Items',
                  data: monthlyData.map(item => item.idleItems),
                  backgroundColor: 'rgba(53, 162, 235, 0.5)', // Blue
                  borderColor: 'rgba(25, 99, 201, 1)', // Deeper blue
                  borderWidth: 2,
              },
              {
                label: '# of Times Rented Out',
                data: monthlyData.map(item => item.rentedOutItems),
                backgroundColor: 'rgba(75, 181, 67, 0.5)', // Green
                borderColor: 'rgba(34, 139, 34, 1)', // Deeper green
                borderWidth: 2,
              },
              {
                label: '# of Times In Carts',
                data: monthlyData.map(item => item.cartTotalItems),
                backgroundColor: 'rgba(153, 102, 255, 0.2)', // Purple
                borderColor: 'rgba(153, 102, 255, 1)', // Deeper Purple
                borderWidth: 2,
              },
              {
                label: '# of Times Maintained Equipment (Repairs, Cleaning, ETC.)',
                data: monthlyData.map(item => item.maintainedEquipment),
                backgroundColor: 'rgba(255, 165, 0, 0.5)', // Orange
                borderColor: 'rgba(255, 140, 0, 1)', // Darker Orange
                borderWidth: 2,
              },
              {
                label: 'Cancelled',
                data: monthlyData.map(item => item.cancelledEquipment),
                backgroundColor: 'rgba(128, 128, 128, 0.5)', // Gray
                borderColor: 'rgba(105, 105, 105, 1)', // Darker Gray
                borderWidth: 2,
              },
             
          ],
    }}
    } else {
        console.log('Agreements data is undefined')
    }

    return(
        <>
        <Bar options={barChartOptions} 
        data={barChartdata} />
        </>
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
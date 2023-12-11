import React from "react";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

function BarChart({currentUser}){
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

    if (Array.isArray(currentUser?.equipment)) {
        currentUser.equipment.forEach(equip => {
            console.log("each equipment:",equip )
            totalEquipment += equip.quantity
        })
    }

    console.log("TOTAL EQUIPMENT:", totalEquipment)

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
        const date = new Date(dateString)
        const month = date.getMonth()
        // console.log("THE MONTH:", month)
        // Month gets a number, 0-11, from there I reference the month name array and get the name
        return monthNames[month]
      }

    // Count agreements per month
    // https://www.w3schools.com/jsref/jsref_reduce.asp
    // https://www.youtube.com/watch?v=XKD0aIA3-yM&list=PLo63gcFIe8o0nnhu0F-PpsTc8nkhNe9yu
    const countAgreementsByMonth = (data = [], totalEquipment) => {
        const monthCounts = data.reduce((acc, agreement) => {
        // console.log("the agreement in the reducer:", agreement)
        //Send the current month in created_at (the date string or date object really, and have it find the month)
        const month = getMonthName(agreement?.created_at)
        // console.log("AGREEMENT CREATED AT:", agreement?.created_at)

        if (!acc[month]) {
            acc[month] = {
                totalRentedOut: 0,
                totalInCart: 0
            }
        }

        // If agreement status is completed, it assumes an owner has succesfully rented out the equipment.
        if (agreement?.agreement_status === 'completed') {
            acc[month].totalRentedOut += 1
            // console.log("HOW MANY ARE BEING RENTED OUT:", acc[month].totalRentedOut)
        }

        
        // Check if cart_item exists and is an object, then add its quantity 
        // I was having so many issues with not being able to find the quantity, but doing typeof seems to have fixed it.
        if (agreement?.cart_item && typeof agreement.cart_item === 'object') {
            acc[month].totalInCart += agreement.cart_item.quantity
            // console.log("ITEM:", agreement.cart_item)
            // console.log("ITEM agreement.cart_item.quantity:", agreement.cart_item.quantity)
        }

        // console.log("THE AGREEMENT CART ITEM:", agreement?.cart_item)
        // console.log('TESTING TO SEE HOW MANY ITEMS:', acc[month])
        // console.log("THE TOTAL RENTED OUT PER MONTH:",acc[month].totalRentedOut)
        // console.log("THE TOTAL IN CART  PER MONTH:", acc[month].totalInCart += agreement.cart_item.quantity)


        // Update monthly count
        return acc

        }, {})
        // Calculate monthly idle equipment and map results
        return Object.keys(monthCounts).map(month => {
        const monthData = monthCounts[month]
        const totalIdle = totalEquipment - monthData.totalRentedOut - monthData.totalInCart

        // console.log("TOTAL EQUIPMENT:",totalEquipment)
        // console.log("Total Equipment:", totalEquipment)
        // console.log("Total Rented Out for " + month + ":", monthData.totalRentedOut)
        // console.log("Total In Cart for " + month + ":", monthData.totalInCart)
        
        return {
            month, 
            rentals: monthData.rentals,
            cartTotalItems: monthData.totalInCart, 
            rentedOutItems: monthData.totalRentedOut,
            idleItems: totalIdle
        }
        })
    }

    // totalEquipment -= totalRentedOut
    // totalIdle = totalEquipment -= totalInCart

    // Call the function with data and totalEquipment count
    const agreementsData = currentUser?.agreements // I HAD AN ARRAY OF AN ARRAY AAAH
    // console.log("AGREEMENTS DATA:", agreementsData)
    let barChartLabels
    let barChartEquipmentRentedOut
    let barChartEquipmentIdle
    let barChartCartTotalItems

    // console.log(barChartEquipmentRentedOut)
    // console.log(barChartEquipmentIdle)
    // console.log(barChartCartTotalItems)



    if (agreementsData) {
        const monthlyData = countAgreementsByMonth(agreementsData, totalEquipment)

        // console.log(monthlyData)
        
        barChartLabels = monthlyData.map(item => item.month)
        barChartEquipmentRentedOut = monthlyData.map(item => item.rentedOutItems)
        barChartCartTotalItems = monthlyData.map(item => item.cartTotalItems)
        barChartEquipmentIdle = monthlyData.map(item => item.idleItems)
      } else {
        console.log('Agreements data is undefined')
      }

    // console.log("TOTAL RENTED OUT:",totalRentedOut)
    // console.log("CURRENT USER AGREEMENTS:", currentUser.agreements)
    // const barChartRentalData = countAgreementsByMonth(currentUser?.agreements)
    // const barChartLabels = barChartRentalData.map(item => item.month)
    // const barChartEquipmentRentedOut = barChartRentalData.map(item => item.rentals)
    // const barChartEquipmentIdle = barChartRentalData.map(item => item.allIdle)

    // console.log(barChartEquipmentIdle)

    const barChartdata = {
        labels: barChartLabels,
        datasets: [
        {
            label: 'Idle Equipment',
            data: barChartEquipmentIdle,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgba(25, 99, 201, 1)', // Deeper blue
            borderWidth: 2, // Border width for this dataset
        },
        {
            label: 'Equipment In User Carts',
            data: barChartCartTotalItems,
            backgroundColor: 'rgba(75, 181, 67, 0.5)',
            borderColor: 'rgba(34, 139, 34, 1)', // Border color for this dataset
            borderWidth: 2, // Border width for this dataset
        },
        {
            label: 'Equipment Rented Out',
            data: barChartEquipmentRentedOut,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)', // Border color for this dataset
            borderWidth: 2, // Border width for this dataset
        },
        ]
    }

    console.log("TRYING TO HAVE THIS BE THE MAX:", totalEquipment + 10)

    return(
        <>
        <Bar options={barChartOptions} 
        data={barChartdata} />
        </>
    )
}

export default BarChart
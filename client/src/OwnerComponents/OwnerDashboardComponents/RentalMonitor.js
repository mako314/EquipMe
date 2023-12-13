import React from "react";

function RentalMonitor({currentUser}){

    const agreementsData = currentUser?.agreements 

    console.log("Testing AgreementsData to see if req data in there:", agreementsData)
    
    let totalRevenue = 0

    // // console.log("TOTAL EQUIPMENT:", totalEquipment)
    // I wont lie use Reducer is pretty amazing

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
    const countAgreementsByMonth = (data = [], totalRevenue) => {
        const monthCounts = data.reduce((acc, agreement) => {
        // console.log("the agreement in the reducer:", agreement)
        //Send the current month in created_at (the date string or date object really, and have it find the month)
        const month = getMonthName(agreement?.created_at)
        // console.log("AGREEMENT CREATED AT:", agreement?.created_at)

        if (!acc[month]) {
            acc[month] = {
                totalMoneyIn: 0
            }
        }

        // If agreement status is completed, it assumes an owner has succesfully rented out the equipment.
        if (agreement?.agreement_status === 'completed') {
            // console.log((agreement.cart_item.price_cents_at_addition) / 100 )
            acc[month].totalMoneyIn += (agreement.cart_item.price_cents_at_addition) / 100
            // totalRevenue += (agreement.cart_item.price_cents_at_addition) / 100
            console.log(acc[month].totalMoneyIn)
            // console.log("HOW MANY ARE BEING RENTED OUT:", acc[month].totalRentedOut)
        }

        // Update monthly count
        return acc

        }, {})
        // Calculate monthly idle equipment and map results
        return Object.keys(monthCounts).map(month => {
        const monthData = monthCounts[month]
        
        return {
            month, 
            rentals: monthData.rentals,
            totalRevenuePerMonth: monthData.totalMoneyIn
        }
        })
    }

    let monthlyRevenue
    // let barChartEquipmentIdle

    // if (agreementsData) {
    //     const monthlyData = countAgreementsByMonth(agreementsData, totalRevenue)

    //     // console.log(monthlyData)

    //     monthlyRevenue = monthlyData.map(item => item.totalRevenuePerMonth)
        
    //     // barChartLabels = monthlyData.map(item => item.month)
    //     // barChartEquipmentRentedOut = monthlyData.map(item => item.rentedOutItems)
    //     // barChartCartTotalItems = monthlyData.map(item => item.cartTotalItems)
    //     // barChartEquipmentIdle = monthlyData.map(item => item.idleItems)
    //   } else {
    //     console.log('Agreements data is undefined')
    //   }
    let monthlyRevenueData
      if (agreementsData) {
        monthlyRevenueData = countAgreementsByMonth(agreementsData)
        // Calculate the total revenue by summing up the totalMoneyIn for each month.
        totalRevenue = monthlyRevenueData.reduce((sum, { totalRevenuePerMonth }) => sum + totalRevenuePerMonth, 0)
      } else {
        console.log('Agreements data is undefined')
      }
      
      return (
        <>
        {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed 
        
        TODAY I LEARNED! I CAN MAKE MY NUMBERS PRETTY AGAIN
        */}
          {monthlyRevenueData.map(({ month, totalRevenuePerMonth }) => (
            <div key={month}>
              {month}: ${totalRevenuePerMonth.toFixed(2)}
            </div>
          ))}
          <div>TOTAL REVENUE: ${totalRevenue.toFixed(2)}</div>
        </>
      );
    }

export default RentalMonitor
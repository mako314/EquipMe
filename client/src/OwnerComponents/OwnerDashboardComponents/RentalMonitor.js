import React, {useState, useMemo} from "react";

function RentalMonitor({currentUser}){
    
    const agreementsData = currentUser?.agreements 

    // console.log("Testing AgreementsData to see if req data in there:", agreementsData)
    // console.log("THE CURRENT USER, LOOKING FOR AGREEMENTS", currentUser.cart)
    
    let totalRevenue = 0

    const handleMonthSelection = (event) => {
      // console.log('Selected value:', event.target.value)
      setMonthSelection(event.target.value)
  }
  
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

    let todaysDate = new Date()
    
    const [monthSelection, setMonthSelection] = useState(getMonthName(todaysDate))

    // console.log("THIS SHOULD READ DECEMBER:", monthSelection)

    // Count agreements per month
    // https://www.w3schools.com/jsref/jsref_reduce.asp
    // https://www.youtube.com/watch?v=XKD0aIA3-yM&list=PLo63gcFIe8o0nnhu0F-PpsTc8nkhNe9yu
    const countAgreementsByMonth = (data = []) => {
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
            // console.log(acc[month].totalMoneyIn)
            // console.log("HOW MANY ARE BEING RENTED OUT:", acc[month].totalRentedOut)
        }

        // Update monthly count
        return acc

        }, {})
        // Calculate monthly idle equipment and map results
        return Object.keys(monthCounts)?.map(month => {
        const monthData = monthCounts[month]
        
        return {
            month, 
            rentals: monthData.rentals,
            totalRevenuePerMonth: monthData.totalMoneyIn
        }
        })
    }

    //my calculations aren't too expensive though. 
    let monthlyRevenueData
      if (agreementsData) {
        monthlyRevenueData = countAgreementsByMonth(agreementsData)
        // Calculate the total revenue by summing up the totalMoneyIn for each month.
        totalRevenue = monthlyRevenueData.reduce((sum, { totalRevenuePerMonth }) => sum + totalRevenuePerMonth, 0)
      } else {
        console.log('Agreements data is undefined')
      }
    // https://react.dev/reference/react/useMemo

    // const monthlyRevenueData = useMemo(() => {
    //   if (agreementsData) {
    //     return countAgreementsByMonth(agreementsData);
    //   }
    //   return [];
    // }, [agreementsData])

    // const totalRevenue = useMemo(() => {
    //   return monthlyRevenueData.reduce((sum, { totalRevenuePerMonth }) => sum + totalRevenuePerMonth, 0)
    // }, [monthlyRevenueData])
      
      return (
        <>
          <select 
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={monthSelection}
          onChange={handleMonthSelection}
        >
          <option value="" disabled>--Please choose an option--</option>
          <option name="January" value="January" id="January"> January </option>
          <option name="February" value="February" id="February"> February </option>
          <option name="March" value="March" id="March"> March </option>
          <option name="April" value="April" id="April"> April </option>
          <option name="May" value="May" id="May"> May </option>
          <option name="June" value="June" id="June"> June</option>
          <option name="July" value="July" id="July"> July </option>
          <option name="August" value="August" id="August"> August </option>
          <option name="September" value="September" id="September"> September </option>
          <option name="October" value="October" id="October"> October </option>
          <option name="November" value="November" id="November"> November </option>
          <option name="December" value="December" id="December"> December </option>
        </select>
        {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed 
        
        TODAY I LEARNED! I CAN MAKE MY NUMBERS PRETTY AGAIN
        */}
        
        <div className="bg-white rounded shadow p-6 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Total Rentals</h2>
            <div className="mt-2">
              {monthlyRevenueData?.map(({ month, totalRevenuePerMonth }) => (
                monthSelection === month && (
                  <div key={month} className="flex justify-between items-center">
                    <span className="text-lg text-gray-500">{month}</span>
                    <span className="text-lg font-semibold text-green-600">${totalRevenuePerMonth.toFixed(2)}</span>
                  </div>
                )
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-500">Year to Date</span>
                <span className="text-lg font-semibold text-green-600">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
        </div>
        </>
      );
    }

export default RentalMonitor
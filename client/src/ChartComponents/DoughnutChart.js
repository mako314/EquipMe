import React from "react";
// import { UserSessionContext } from "../UserComponents/SessionContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut} from 'react-chartjs-2';

function DoughnutChart({currentUser, role}) {

    //----------------------------------------------- DOUGHNUT CHART CODE -------------------------

    // FOR USERS I CAN PROBABLY JUST TRACK THE AGREEMENTS FOR THEM, 
    // THEN MAYBE 
    let totalEquipment = 0
    let itemsInUserCart = 0
    let totalFavorites = 0
    let totalFeaturedEquipment = 0

    let totalPendingAgreements = 0
    const rentalAgreementStatuses = ['in-progress', 'user-accepted', 'owner-accepted'] // <--- CAN USE THIS FOR USERS ALSO

    let totalCompletedAgreements = 0

    //Handles finding ALL equipment an owner has. Found in Equipment > Quantity property
    // ALL EQUIPMENT TAKES INTO ACCOUNT JUST THE EQUIPMENT IN INVENTORY, 
    if (Array.isArray(currentUser?.equipment)) {
        currentUser.equipment.forEach(equip => {
            // console.log("each equipment:",equip )
            totalEquipment += equip.status[0]?.total_quantity
            itemsInUserCart += equip.status[0]?.reserved_quantity
        })
    }
    // console.log(totalEquipment)

    //Handles finding ALL equipment in user carts, found in Cart > Quantity
    // if (Array.isArray(currentUser?.equipment)) {
    //     currentUser.equipment.forEach(equip => {
    //         if (Array.isArray(equip.cart_item)){
    //             equip.cart_item.forEach(cartItem => {
    //                 if(cartItem){
    //                 itemsInUserCart += cartItem.quantity}
    //             })
    //         }
    //     })
    // }

    //Handles finding ALL FAVORITED equipment, found in Equipment > Favorite
    if (Array.isArray(currentUser?.equipment)) {
        currentUser.equipment.forEach(equip => {
            if (Array.isArray(equip.user_favorite)){
                equip.user_favorite.forEach(favorite => {
                    if(favorite){
                    totalFavorites += 1}
                })
            }
        })
    }

    // Handles finding all FEATURED equipment, found in Equipment > Featured Equipment
    if (Array.isArray(currentUser?.equipment)) {
        currentUser.equipment.forEach(equip => {
            if (Array.isArray(equip.featured_equipment)){
                equip.featured_equipment.forEach(featuredEquipment => {
                    if(featuredEquipment){
                    totalFeaturedEquipment += 1}
                })
            }
        })
    }

    // Handles finding all PENDING agreements, found in Agreements and their statuses ['in-progress', 'user-accepted', 'owner-accepted']
    if (Array.isArray(currentUser?.agreements)) {
        currentUser.agreements.forEach(agreement => {
            if (rentalAgreementStatuses.includes(agreement.agreement_status)){
                totalPendingAgreements +=1
            }
        })
    }

    // Handles finding all FINISHED agreements, meaning this equipment is rented out. Found in Agreements and their statuses
    if (Array.isArray(currentUser?.agreements)) {
        currentUser.agreements.forEach(agreement => {
            if (agreement.agreement_status === 'completed'){
                totalCompletedAgreements +=1
            }
        })
    }

    // console.log("The length of all Equipments:", totalEquipment)
    // console.log("The length of all items in a user cart:", itemsInUserCart)
    // console.log("Total Favorites:", totalFavorites)
    // console.log("Total Featured Equipment:", totalFeaturedEquipment)
    // console.log("Total PENDING Agreements Equipment:", totalPendingAgreements)
    // console.log("Total COMPLETED Agreements Equipment:", totalCompletedAgreements)

    ChartJS.register(ArcElement, Tooltip, Legend)

    // https://codesandbox.io/p/devbox/reactchartjs-react-chartjs-2-default-t64th?file=%2FApp.tsx%3A29%2C22
    // https://stackoverflow.com/questions/59325426/how-to-resize-chart-js-element-in-react-js
    // https://stackoverflow.com/questions/53872165/cant-resize-react-chartjs-2-doughnut-chart
    let doughnutData = {
        labels: ['All Equipment','Favorited By Renters', 'Featured Equipment', 'Equipment Pending Agreement', 'In Renter Carts', 'Equipment Rented Out'],
        datasets: [
          {
            label: '# of Equipment',
            //Data is just x data for what I'd like, total equipment all, itemsInUserCart etc all captured with ifs above.
            data: [totalEquipment,  totalFavorites, totalFeaturedEquipment, totalPendingAgreements, itemsInUserCart, totalCompletedAgreements],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(102, 204, 255, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(75, 181, 67, 0.5)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(0, 123, 255, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(34, 139, 34, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }


    return(
        <>
        {currentUser?.equipment.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center text-gray-800">
            <p className="text-lg font-medium">No listed equipment quite yet, we'll have a real time updates in this doughnut chart!</p>
        </div>
        ) : (
        role === 'owner' && 
        <Doughnut
        options={{
        responsive: true,
        maintainAspectRatio: false,
        }}
        data={doughnutData}
        /> 
        )}

        </>
    )
}

export default DoughnutChart;
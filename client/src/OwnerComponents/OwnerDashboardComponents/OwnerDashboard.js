import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

//Imports//
import OwnerContext from '../OwnerContext';
import ProductCollection from '../../EquipmentComponents/ProductCollection'
import OwnerEditForm from '../OwnerEditForm';
import UserCollection from '../../UserComponents/UserCollection';

import { ReactComponent as EquipMeLogo } from '../../Content/EquipMeLogo.svg'


function OwnerDashboard({ownerToEdit, updateOwner, setFromOwnerDash, users, searchTerm}) {

    const [owner, setOwner] = useContext(OwnerContext)
    const [toggleHomeDash, setToggleHomeDash] = useState(null)
    const [potentialRentalUsers, setPotentialRentalUsers] = useState([])

    useEffect(() => {
        fetch("/owner/check_session").then((response) => {
            if (response.ok) {
                response.json().then((owner) => setOwner(owner));
            }
        });
    }, []);

    console.log(owner)
    console.log(users)
    let firstName
    let equipment
    let lastName
    if (owner){
         firstName  = owner.firstName
         lastName = owner.lastName
         equipment = owner.equipment
    }

    const navigate = useNavigate()

    const handleCsvClick = (e) => {
        navigate('/temp/bulk_equipment_upload')
    }

    //----- Variables in the order they appear -----
    let dashHome
    // let loggedInDisplay
    let activeListings
    let accountSettings
    let plannedDeals
    let potentialRenters

//----------------------------------------activeListings------------------------------

function ActiveListings(){
    if (!owner) return null

    return(
    <div>
        <ProductCollection equipmentArray={owner.equipment}/>
    </div>
    )
}

//---------------------------------------accountSettings------------------------------------

function AccountSettings() {
    if (!owner) return null

    return (
        <>
            <OwnerEditForm ownerToEdit={ownerToEdit || owner} updateOwner={updateOwner} />
        </>
    )
}

console.log("ACCOUNT SETTINGS:", accountSettings)
//------------------------------------------------------------------------------------

    plannedDeals =
        <div> Planned Deals </div>
//------------------------------------------------------------------------------------
    useEffect(() => {
        fetch(`/users/${owner?.profession}`)
        .then((resp) => resp.json())
        .then((data) => {
            setPotentialRentalUsers(data)
        })
    }, [owner])

    const handlePotentialRenter = () => {
        potentialRenters =
        <>
            <UserCollection searchTerm={searchTerm} users={potentialRentalUsers}/>
        </>
    }

    function DashHome(){

        return(
            <div>
                {/* CENTER OF PAGE , BLOCKS AND SUCH  */}
                <div className="flex-grow p-6 overflow-auto bg-gray-200">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="h-24 col-span-3 bg-white border border-gray-300 text-center"> Welcome {firstName} </div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300">

                            

                        </div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
                        <div className="h-96 col-span-2 bg-white border border-gray-300"></div>
                        <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
                        <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
                        <div className="h-24 col-span-2 bg-white border border-gray-300"></div>

                    </div>
                </div>
            </div>
        )
    }
        // dashHome =
        //     <div>
        //         {/* CENTER OF PAGE , BLOCKS AND SUCH  */}
        //         <div className="flex-grow p-6 overflow-auto bg-gray-200">
        //             <div className="grid grid-cols-3 gap-6">
        //                 <div className="h-24 col-span-3 bg-white border border-gray-300 text-center"> Welcome {firstName} </div>
        //                 <div className="h-96 col-span-1 bg-white border border-gray-300">

                            

        //                 </div>
        //                 <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
        //                 <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
        //                 <div className="h-96 col-span-2 bg-white border border-gray-300"></div>
        //                 <div className="h-96 col-span-1 bg-white border border-gray-300"></div>
        //                 <div className="h-24 col-span-1 bg-white border border-gray-300"></div>
        //                 <div className="h-24 col-span-2 bg-white border border-gray-300"></div>

        //             </div>
        //         </div>
        //     </div>

// ----------- Display, in the process of inputting variables into it--------------
    



    function LoggedInDisplay(){
        
        return(
            <>
                <div className="flex w-screen h-screen text-gray-700">

                    {/* <!-- Component Start --> */}
                    
                    <div className="flex flex-col w-56 border-r border-gray-300">
                        <button className="relative text-sm focus:outline-none group">
                            <div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300 hover:bg-gray-300">
                                <span className="font-medium">
                                    Dropdown
                                </span>
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div className="absolute z-10 flex-col items-start hidden w-full pb-1 bg-white shadow-lg group-focus:flex">
                                <span className="w-full px-4 py-2 text-left hover:bg-gray-300" onClick={() => setToggleHomeDash(<AccountSettings/>)}> Account Settings </span>
                                <span className="w-full px-4 py-2 text-left hover:bg-gray-300" > Possible Conversions </span>
                                <span className="w-full px-4 py-2 text-left hover:bg-gray-300" > Graphs </span>
                            </div>
                        </button>
                        <div className="flex flex-col flex-grow p-4 overflow-auto">

                            <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(<DashHome/>)}> Home </span>

                            <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(activeListings)}> Active listings </span>

                            <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(plannedDeals)}> Planned Deals </span>

                            <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => {
                                handlePotentialRenter()
                                setToggleHomeDash(potentialRenters)
                            }}>Potential Renters</span>

                            <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none"> What do I need here </span>

                            <Link to='/messaging'>
                            <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none"> Inbox </span>
                            </Link>

                            <span className="flex items-center flex-shrink-0 h-10 px-3 mt-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
                                href="#">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="ml-2 leading-none">New Item</span>
                            </span>
                        </div>

                    </div>
                    <div className="flex flex-col overflow-auto flex-grow">
                        <div className="flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300">

                            <h1 className="text-lg font-medium">Page Title</h1>
                            <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium rounded hover:bg-gray-300" onClick={handleCsvClick}>
                                Upload Equipment File

                            </button>
                            {/* <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300">
                                Action 2
                            </button> */}

                            <Link to='/list_equipment'>

                                <button type="submit" className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" onClick={setFromOwnerDash(true)}> List an Item</button>

                            </Link>

                            <button className="relative ml-2 text-sm focus:outline-none group">
                                <div className="flex items-center justify-between w-10 h-10 rounded hover:bg-gray-300">
                                    <svg className="w-5 h-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </div>
                                <div className="absolute right-0 flex-col items-start hidden w-40 pb-1 bg-white border border-gray-300 shadow-lg group-focus:flex">
                                    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
                                    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
                                    <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
                                </div>
                            </button>
                        </div>
                        {toggleHomeDash}
                    </div>
                    
                    {/* <!-- Component End  --> */}

                </div>
            </>
        )
    }

    function LoggedOutDisplay(){

        return (
            <div> you must be logged in to view this page </div>
        )
    }

    // let loggedOutDisplay =
    //     <div> you must be logged in to view this page </div>

    // loggedInDisplay =
    //         <>
    //             <div className="flex w-screen h-screen text-gray-700">

    //                 {/* <!-- Component Start --> */}
                    
    //                 <div className="flex flex-col w-56 border-r border-gray-300">
    //                     <button className="relative text-sm focus:outline-none group">
    //                         <div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300 hover:bg-gray-300">
    //                             <span className="font-medium">
    //                                 Dropdown
    //                             </span>
    //                             <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    //                                 <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
    //                             </svg>
    //                         </div>
    //                         <div className="absolute z-10 flex-col items-start hidden w-full pb-1 bg-white shadow-lg group-focus:flex">
    //                             <span className="w-full px-4 py-2 text-left hover:bg-gray-300" onClick={() => setToggleHomeDash(<AccountSettings/>)}> Account Settings </span>
    //                             <span className="w-full px-4 py-2 text-left hover:bg-gray-300" > Possible Conversions </span>
    //                             <span className="w-full px-4 py-2 text-left hover:bg-gray-300" > Graphs </span>
    //                         </div>
    //                     </button>
    //                     <div className="flex flex-col flex-grow p-4 overflow-auto">

    //                         <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(dashHome)}> Home </span>

    //                         <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(activeListings)}> Active listings </span>

    //                         <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => setToggleHomeDash(plannedDeals)}> Planned Deals </span>

    //                         <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none" onClick={() => {
    //                             handlePotentialRenter()
    //                             setToggleHomeDash(potentialRenters)
    //                         }}>Potential Renters</span>

    //                         <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none"> What do I need here </span>

    //                         <Link to='/messaging'>
    //                         <span className="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300 leading-none"> Inbox </span>
    //                         </Link>

    //                         <span className="flex items-center flex-shrink-0 h-10 px-3 mt-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
    //                             href="#">
    //                             <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    //                             </svg>
    //                             <span className="ml-2 leading-none">New Item</span>
    //                         </span>
    //                     </div>

    //                 </div>
    //                 <div className="flex flex-col overflow-auto flex-grow">
    //                     <div className="flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300">

    //                         <h1 className="text-lg font-medium">Page Title</h1>
    //                         <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium rounded hover:bg-gray-300" onClick={handleCsvClick}>
    //                             Upload Equipment File

    //                         </button>
    //                         {/* <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300">
    //                             Action 2
    //                         </button> */}

    //                         <Link to='/list_equipment'>

    //                             <button type="submit" className="flex items-center justify-center h-10 px-4 ml-auto mr-2 rounded-lg bg-orange-500 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700" onClick={setFromOwnerDash(true)}> List an Item</button>

    //                         </Link>

    //                         <button className="relative ml-2 text-sm focus:outline-none group">
    //                             <div className="flex items-center justify-between w-10 h-10 rounded hover:bg-gray-300">
    //                                 <svg className="w-5 h-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    //                                 </svg>
    //                             </div>
    //                             <div className="absolute right-0 flex-col items-start hidden w-40 pb-1 bg-white border border-gray-300 shadow-lg group-focus:flex">
    //                                 <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
    //                                 <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
    //                                 <span className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">Menu Item 1</span>
    //                             </div>
    //                         </button>
    //                     </div>
    //                     {toggleHomeDash}
    //                 </div>
                    
    //                 {/* <!-- Component End  --> */}

    //             </div>
    //         </>
    // }


    return (
        <>
            {owner ? <LoggedInDisplay/> : <LoggedOutDisplay/>}
        </>
    )
}

export default OwnerDashboard
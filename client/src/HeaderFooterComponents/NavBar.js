import React from "react";
import { NavLink } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Header from "./Header";


function NavBar({ setSearchTerm }) {

    // const navArray = consoleArray.map((cons) => {
    //     return (
    //         <NavLink
    //             key={cons.id}
    //             name={cons.name}
    //             to={cons.name.replace(/\s/g, '')}
    //         >
    //             {cons.name}
    //         </NavLink>
    //     )
    // })

    const toggleDropContent = () => {
        const dropDownContent = document.querySelector('.dropdown-content');
        dropDownContent.classList.toggle('show');
    };

    return (
        <>
            <header class="text-gray-600 body-font">
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span class="ml-3 text-xl">Tailblocks</span>
                </a>
                <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                <a class="mr-5 hover:text-gray-900">First Link</a>
                <a class="mr-5 hover:text-gray-900">Second Link</a>
                <a class="mr-5 hover:text-gray-900">Third Link</a>
                <a class="mr-5 hover:text-gray-900">Fourth Link</a>
                </nav>
                <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
                </button>
            </div>
            </header>
        </>
    )
}

export default NavBar;





{/* <nav>
            <Header />
            <div className="buttons">
                <div className="homediv">
                    <NavLink className={"homebutton"} key={"Home"} name={"Home"} to={"/"}>
                        <button className="homebutton">Home
                        </button>
                    </NavLink>
                </div>

                <div className="dropdown">
                    <button className="dropbtn" onClick={toggleDropContent}> Menu
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <NavLink
                            key={"Equipment"}
                            name={"Equipment"}
                            to={"/equipment"}>
                            Equipment
                        </NavLink>

                        <NavLink
                            key={"Equipment Owners"}
                            name={"Equipment Owners"}
                            to={"/equipment_owners"}>
                            Equipment Owners
                        </NavLink>

                        <NavLink
                            key={"Rental Agreements"}
                            name={"Rental Agreements"}
                            to={"/rental_agreements"}>
                            Rental Agreements
                        </NavLink>

                        {/* {navArray} */}
            //         </div>
            //     </div>
            //     <div className="listButtonDiv">
            //         <button className="listButton">
            //             <NavLink
            //                 key={"List Item"}
            //                 name={"List Item"}
            //                 to={"/owner_signup"}>
            //                 Become an Owner
            //             </NavLink>
            //         </button>
            //     </div>

            //     <div className="loginButtonDiv">
            //         <button className="loginButton">
            //             <NavLink
            //                 key={"Login"}
            //                 name={"Login"}
            //                 to={"/login"}>
            //                 Login
            //             </NavLink>
            //         </button>
            //     </div>

            // </div>
        //     <SearchBar setSearchTerm={setSearchTerm} />
        // </nav> */}
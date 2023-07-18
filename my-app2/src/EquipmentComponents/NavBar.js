import React from "react";
import { NavLink } from 'react-router-dom';
import Header from './Header';
import SearchBar from "./SearchBar";


function NavBar({ }) {

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

    return (
        <nav>
            <Header />
            <SearchBar />
            <div className="dropdown">
                <button className="dropbtn">Menu
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <NavLink
                        key={"Home"}
                        name={"Home"}
                        to={"/"}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        key={"Equipment"}
                        name={"Equipment"}
                        to={"/equipment"}
                    >
                        Equipment
                    </NavLink>
                    <NavLink
                        key={"Equipment Owners"}
                        name={"Equipment Owners"}
                        to={"/equipment_owners"}
                    >
                        Equipment Owners
                    </NavLink>
                    <NavLink
                        key={"Rental Agreements"}
                        name={"Rental Agreements"}
                        to={"/rental_agreements"}
                    >
                        Rental Agreements
                    </NavLink>

                    {/* {navArray} */}
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
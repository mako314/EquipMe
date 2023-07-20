import React from "react";
import { NavLink } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Header from "./Header";


function NavBar({ setSearchTerm }) {


    const toggleDropContent = () => {
        const dropDownContent = document.querySelector('.dropdown-content');
        dropDownContent.classList.toggle('show');
    };

    return (
        <nav>
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
                    </div>
                </div>
                <div className="listButtonDiv">
                    <button className="listButton">
                        List Item
                    </button>
                </div>
            </div>
            <SearchBar setSearchTerm={setSearchTerm} />

        </nav>
    )
}

export default NavBar;
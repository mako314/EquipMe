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
                        <NavLink
                            key={"List Item"}
                            name={"List Item"}
                            to={"/owner_signup"}>
                            Become an Owner
                        </NavLink>
                    </button>
                </div>

                <div className="loginButtonDiv">
                    <button className="loginButton">
                        <NavLink
                            key={"Login"}
                            name={"Login"}
                            to={"/login"}>
                            Login
                        </NavLink>
                    </button>
                </div>

            </div>
            <SearchBar setSearchTerm={setSearchTerm} />
        </nav>
    )
}

export default NavBar;
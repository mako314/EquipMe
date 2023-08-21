import React, { useState } from "react"
import { Link, useNavigate} from 'react-router-dom';
import {ReactComponent as EquipMeLogo } from '../Content/EquipMeLogo.svg'
// import SearchBar from "./SearchBar";
// import Header from "./Header";


function NavBar({ setSearchTerm }) {
    const [isToggleOpen, setIsToggleOpen] = useState(false)
    
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

    const navigate = useNavigate();

    

    return (
        <>
      {/*<!-- Component: Basic Navbar --> */}
      <header className="border-b-1 relative z-20 w-full border-b border-slate-200 bg-white/90 shadow-lg shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden">
        <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
          <nav
            aria-label="main navigation"
            className="flex h-[5.5rem] items-stretch justify-between font-medium text-slate-700"
            role="navigation"
          >
            {/*      <!-- Brand logo --> */}

            <a
            id="WindUI"
            aria-label="WindUI logo"
            aria-current="page"
            className="flex items-center gap-2 whitespace-nowrap py-3 text-lg focus:outline-none lg:flex-1"
            href="javascript:void(0)"
            >
            <EquipMeLogo className="h-12 w-12" />
            <span className="ml-3 text-xl"> Equip Me</span>
            </a>
            
            {/*      <!-- Mobile trigger --> */}

            <button
              className={`relative order-10 block h-10 w-10 self-center lg:hidden
                ${
                  isToggleOpen
                    ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
                    : ""
                }
              `}
              onClick={() => setIsToggleOpen(!isToggleOpen)}
              aria-expanded={isToggleOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                ></span>
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
                ></span>
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                ></span>
              </div>
            </button>
            {/*      <!-- Navigation links --> */}
            <ul
              role="menubar"
              aria-label="Select page"
              className={`absolute top-0 left-0 z-[-1] h-[28.5rem] w-full justify-center overflow-hidden  overflow-y-auto overscroll-contain bg-white/90 px-8 pb-12 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0  lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0  lg:pt-0 lg:opacity-100 ${
                isToggleOpen
                  ? "visible opacity-100 backdrop-blur-sm"
                  : "invisible opacity-0"
              }`}
            >
              <li role="none" className="flex items-stretch">
                <a
                  role="menuitem"
                  aria-haspopup="false"
                  tabIndex="0"
                  className="flex items-center gap-2 py-4 transition-colors duration-300 hover:text-emerald-500 focus:bg-emerald-50 focus:outline-none focus-visible:outline-none lg:px-8"
                  href="javascript:void(0)"
                >
                  <span>Home</span>
                </a>
              </li>
              <li role="none" className="flex items-stretch">
                <a
                  role="menuitem"
                  aria-current="page"
                  aria-haspopup="false"
                  tabIndex="0"
                  className="flex items-center gap-2 py-4 text-emerald-500 transition-colors duration-300 hover:text-emerald-600 focus:bg-emerald-50 focus:outline-none focus-visible:outline-none lg:px-8"
                  href="javascript:void(0)"
                >
                  <span>Features</span>
                </a>
              </li>
              <li role="none" className="flex items-stretch">
                <a
                  role="menuitem"
                  aria-haspopup="false"
                  tabIndex="0"
                  className="flex items-center gap-2 py-4 transition-colors duration-300 hover:text-emerald-500 focus:bg-emerald-50 focus:outline-none focus-visible:outline-none lg:px-8"
                  href="javascript:void(0)"
                >
                  <span>Pricing</span>
                </a>
              </li>
              <li role="none" className="flex items-stretch">
                <a
                  role="menuitem"
                  aria-haspopup="false"
                  tabIndex="0"
                  className="flex items-center gap-2 py-4 transition-colors duration-300 hover:text-emerald-500 focus:bg-emerald-50 focus:outline-none focus-visible:outline-none lg:px-8"
                  href="javascript:void(0)"
                >
                  <span>About</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/*<!-- End Basic Navbar--> */}
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
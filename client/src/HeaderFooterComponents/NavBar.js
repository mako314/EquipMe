import React, { useContext, useState } from "react"
import { Link, useNavigate} from 'react-router-dom';
import {ReactComponent as EquipMeLogo } from '../Content/EquipMeLogo.svg'
import SearchBar from "./SearchBar";
// import Header from "./Header";

//Context imports
import { UserSessionContext } from "../UserComponents/SessionContext";
import { CartAvailProviderContext } from "../CheckoutComponents/AvailToCheckoutContext";
import ApiUrlContext from "../Api";

function NavBar({ setSearchTerm}) {
  const apiUrl = useContext(ApiUrlContext)
  const [isToggleOpen, setIsToggleOpen] = useState(false)
  const { currentUser, role, setCurrentUser, setRole } = UserSessionContext()
  const { availableToCheckoutNumb } = CartAvailProviderContext()

  // console.log("CHECKING THIS NUMBER:", availableToCheckoutNumb)

  const navigate = useNavigate()

  const closeMobileView = () => {
    setIsToggleOpen(false)
  }

  function userHandleLogout() {
    fetch(`${apiUrl}logout`, {
        method: "DELETE",
        credentials: 'include'
    }).then( () => {
      // setUser(null)
      setCurrentUser(null); // Clearing the current user in session context
      setRole(''); //  Clear the role
      closeMobileView()
      navigate(`/`)
    })
  }

  function UserProfileClick() {
    navigate(`/user/profile/${currentUser.id}`)
}

  //Need to incorporate the links here in the footer



    let userLoggedInDisplay = (
      <>
      {/*<!-- Component: Navbar with CTA --> */}
      <header className="border-b-1 relative z-20 w-full bg-gray-900 dark:bg-gray-900 shadow-lg shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden">
        <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
          <nav
            aria-label="main navigation"
            className="flex h-[5.5rem] items-stretch justify-between font-medium text-slate-700"
            role="navigation"
          >
            {/*      <!-- Brand logo --> */}
            <Link to="/"
            id="EquipMe"
            aria-label="EquipMe logo"
            aria-current="page"
            className="flex items-center gap-2 whitespace-nowrap py-3 text-lg focus:outline-none lg:flex-1"
            href="javascript:void(0)"
            >
            <EquipMeLogo className="h-12 w-12" />
            <span className={`ml-3 text-xl ${isToggleOpen ? 'text-black' : 'text-white'}`}>EquipMe</span>
            </Link>
            {/*      <!-- Mobile trigger --> */}
            <button
                className={`relative order-10 block h-10 w-10 self-center lg:hidden ${
                    isToggleOpen ? "visible opacity-100" : ""
                }`}
                onClick={() => setIsToggleOpen(!isToggleOpen)}
                aria-expanded={isToggleOpen ? "true" : "false"}
                aria-label="Toggle navigation"
                >
                <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                    <span
                    aria-hidden="true"
                    className={`absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-white transition-all duration-300`}
                    ></span>
                    <span
                    aria-hidden="true"
                    className={`absolute block h-0.5 w-6 transform rounded-full bg-white transition duration-300`}
                    ></span>
                    <span
                    aria-hidden="true"
                    className={`absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-white transition-all duration-300`}
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
                    <span
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    <SearchBar setSearchTerm={setSearchTerm} isToggleOpen={isToggleOpen}/>
                    </span>
            </li>
            <li role="none" className="flex items-stretch">
                    <Link
                    to="/equipment" 
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    onClick={closeMobileView} // Close the mobile view when link is clicked
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    Equipment
                    </Link>
            </li>
            <li role="none" className="flex items-stretch">
                    <Link
                    to={role === 'user' ? "/equipment_owners" : "/users"} 
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    onClick={closeMobileView} // Close the mobile view when link is clicked
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    {role === 'user' ? "Rent from our Partners" : "Users"}
                    </Link>
            </li>
            </ul>
            <div className="flex items-center px-6 lg:ml-0 lg:pl-3">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none" onClick={userHandleLogout}>
              Logout
              </button>
            </div>
            <div className="flex items-center px-6 lg:ml-0 lg:pl-3">

              <Link to='/dashboard'
                onClick={closeMobileView} // Close the mobile view when link is clicked
                >
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">

                Dashboard
                
              </button>
              </Link>

            </div>

            {role === 'user' && (
              <div className="flex items-center px-6 lg:ml-0 lg:pl-3">
                <Link to="/cart" onClick={closeMobileView} className="text-white hover:text-amber-500 relative">
                  {/* SVG Cart Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                      <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
                  </svg>
                  {/* Item count */}
                  {availableToCheckoutNumb > 0 &&
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 w-5 h-5 text-white text-xs flex items-center justify-center">
                      {availableToCheckoutNumb}
                    </span>
                  }

                </Link>
              </div>
            )}

          </nav>
        </div>
      </header>
      {/*<!-- End Navbar with CTA --> */}
    </>
    )

    let loggedOutDisplay = (
      <>
      {/*<!-- Component: Navbar with CTA --> */}
      <header className="border-b-1 relative z-20 w-full bg-gray-900 dark:bg-gray-900 shadow-lg shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden">
        <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
          <nav
            aria-label="main navigation"
            className="flex h-[5.5rem] items-stretch justify-between font-medium text-slate-700"
            role="navigation"
          >
            {/*      <!-- Brand logo --> */}

            {/* <Link to='/'> */}
            <Link to="/"
            id="WindUI"
            aria-label="WindUI logo"
            aria-current="page"
            className="flex items-center gap-2 whitespace-nowrap py-3 text-lg focus:outline-none lg:flex-1"
            href="javascript:void(0)"
            >
            <EquipMeLogo className="h-12 w-12" />
            <span className={`ml-3 text-xl ${isToggleOpen ? 'text-black' : 'text-white'}`}>EquipMe</span>
            </Link>
            {/* </Link> */}
            {/*      <!-- Mobile trigger --> */}
            <button
                className={`relative order-10 block h-10 w-10 self-center lg:hidden ${
                    isToggleOpen ? "visible opacity-100" : ""
                }`}
                onClick={() => setIsToggleOpen(!isToggleOpen)}
                aria-expanded={isToggleOpen ? "true" : "false"}
                aria-label="Toggle navigation"
                >
                <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                    <span
                    aria-hidden="true"
                    className={`absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-white transition-all duration-300`}
                    ></span>
                    <span
                    aria-hidden="true"
                    className={`absolute block h-0.5 w-6 transform rounded-full bg-white transition duration-300`}
                    ></span>
                    <span
                    aria-hidden="true"
                    className={`absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-white transition-all duration-300`}
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
                    <span
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    <SearchBar setSearchTerm={setSearchTerm} isToggleOpen={isToggleOpen}/>
                    </span>
            </li>
            <li role="none" className="flex items-stretch">
                    <Link
                    to="/equipment" 
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    onClick={closeMobileView} // Close the mobile view when link is clicked
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    Equipment
                    </Link>
            </li>
            <li role="none" className="flex items-stretch">
                    <Link
                    to="/equipment_owners"
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    onClick={closeMobileView} // Close the mobile view when link is clicked
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    Our Partners
                    </Link>
            </li>
            <li role="none" className="flex items-stretch">
                    <Link
                    to="/owner_signup" 
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    onClick={closeMobileView} // Close the mobile view when link is clicked
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    Become a Partner
                    </Link>
            </li>
            <li role="none" className="flex items-stretch">
                    <Link
                    to="/renter_signup" 
                    role="menuitem"
                    aria-haspopup="false"
                    tabIndex="0"
                    onClick={closeMobileView} // Close the mobile view when link is clicked
                    className={`flex items-center gap-2 py-4 text-${
                        isToggleOpen ? "black" : "white"
                    } transition-colors duration-300 hover:text-amber-500 lg:px-8`}
                    >
                    Renter Signup
                    </Link>
            </li>
            </ul>
            <div className="flex items-center px-6 lg:ml-0 lg:p-0">
              <Link to='/login'
                onClick={closeMobileView} // Close the mobile view when link is clicked
                >
              <span className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none mr-2">
                 Login 
              </span>
              </Link>
            </div>
            {/* <div className="flex items-center px-6 lg:ml-0 lg:p-0">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                <Link to='/owner/login'
                onClick={closeMobileView} // Close the mobile view when link is clicked
                >
                <span> Partner Login</span>
                </Link>
              </button>
            </div> */}
          </nav>
        </div>
      </header>
      {/*<!-- End Navbar with CTA --> */}
    </>
    )
    

    
    // border-b border-slate-200 -< this separates the header from the other portion of the website, testing wtihout it.
    //border-b-1 relative z-20 w-full border-b border-slate-200 bg-gray-900 dark:bg-gray-900 shadow-lg shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden
    
    return (
        <>
        {
        role === 'user' || role ==='owner' ? 
        userLoggedInDisplay : loggedOutDisplay
        }

        
        </>
    )
}

export default NavBar;
import React, { useContext, useState } from "react"
import { Link, useNavigate} from 'react-router-dom';
import {ReactComponent as EquipMeLogo } from '../Content/EquipMeLogo.svg'
import SearchBar from "./SearchBar";
// import Header from "./Header";

//Context imports
import  UserContext  from '../UserComponents/UserContext';
import OwnerContext from "../OwnerComponents/OwnerContext";
import ApiUrlContext from "../Api";

function NavBar({ setSearchTerm }) {

  const [isToggleOpen, setIsToggleOpen] = useState(false)

  const navigate = useNavigate();
  
  //state for user
  const [user, setUser] = useContext(UserContext)

  //state for owners
  const [owner, setOwner] = useContext(OwnerContext)

  const apiUrl = useContext(ApiUrlContext)


  const closeMobileView = () => {
    setIsToggleOpen(false);
  }

  function userHandleLogout() {
    fetch(`${apiUrl}logout`, {
        method: "DELETE",
        credentials: 'include'
    }).then( () => {
      setUser(null)
      closeMobileView()
    })
  }

  function ownerHandleLogout() {
    fetch(`${apiUrl}owner/logout`, {
        method: "DELETE",
        credentials: 'include'
    }).then( () => {
      setOwner(null)
      closeMobileView()
    })
  }

  // onClick = {handleLogout}

  function UserProfileClick() {
    navigate(`/user/profile/${user.id}`)
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
                    Rent from our Partners
                    </Link>
            </li>
              


            </ul>
            
            <div className="flex items-center px-6 lg:ml-0 lg:pl-3">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none" onClick={userHandleLogout}>
              Logout
              </button>
            </div>

            <div className="flex items-center px-6 lg:ml-0 lg:p-0">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={UserProfileClick}>
               Profile
              </button>
            </div>


          </nav>
        </div>
      </header>
      {/*<!-- End Navbar with CTA --> */}
    </>
    )

    let ownerLoggedInDisplay = (
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
                    Rent from our Partners
                    </Link>
            </li>
              


            </ul>
            
            <div className="flex items-center px-6 lg:ml-0 lg:pl-3">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none" onClick={ownerHandleLogout}>
              Logout
              </button>
            </div>

            <div className="flex items-center px-6 lg:ml-0 lg:pl-3">
            <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                <Link to='/owner/dashboard'
                onClick={closeMobileView} // Close the mobile view when link is clicked
                >
                <span> Dashboard </span>
                </Link>
              </button>
            </div>

            


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
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none mr-2">
                <Link to='/login'
                onClick={closeMobileView} // Close the mobile view when link is clicked
                >
                <span> User Login</span>
                </Link>
              </button>
            
            </div>

            <div className="flex items-center px-6 lg:ml-0 lg:p-0">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                <Link to='/owner/login'
                onClick={closeMobileView} // Close the mobile view when link is clicked
                >
                <span> Partner Login</span>
                </Link>
              </button>
            
            </div>

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
        user ? 
        (userLoggedInDisplay) : 
        owner ? 
        (ownerLoggedInDisplay) : 
        
        (loggedOutDisplay)
        }

        
        </>
    )
}

export default NavBar;
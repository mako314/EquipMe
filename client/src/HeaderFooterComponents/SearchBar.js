import React from "react";
import "../App.css"

function SearchBar({ setSearchTerm, isToggleOpen}) {

    function handleChange(e) {
        setSearchTerm(e.target.value)
    }


    // {`${isToggleOpen ? 'desktopSearch' : 'mobileSearch'}`}

    return (
        // <div className="search">
        //     <input type="text" placeholder="Looking for something?" className="searchTerm" onChange={handleChange} />
        //     <button className="searchButton">
        //         <i className="fa fa-search"></i>
        //     </button>
        // </div>
        // <div className={`search ${isToggleOpen ? "text-black" : "text-white"} transition-colors duration-300 hover:text-amber-500 lg:px-8`}>
        // <input
        //     type="text"
        //     placeholder="Looking for something?"
        //     className={`searchTerm bg-transparent border-b focus:outline-none ${
        //     isToggleOpen ? "border-black" : "border-white"
        //     }`}
        //     onChange={handleChange}
        // />
        // <button className="searchButton">
        //     <i className="fa fa-search"></i>
        // </button>
        // </div>
        <div className={` ${isToggleOpen ? "text-black" : "text-black"} transition-colors duration-300 hover:text-amber-500 lg:px-8`}>

        {/* Updated styles for the search input */}
        <div className={` ${isToggleOpen ? 'bg-amber-500' : 'bg-white bg-opacity-30'} rounded-full flex items-center px-4 py-2 focus-within:ring ${isToggleOpen ? 'ring-black' : 'ring-amber-500'}`}>
            <input
            id = 'searchBar'
            type="text"
            placeholder= "   Looking for something?"
            placeholdercolor={isToggleOpen ? 'black' : 'white'}
            className={`searchTerm bg-transparent border-none focus:outline-none ${
                isToggleOpen ? "text-black" : "text-white"
              } flex-1`}
            onChange={handleChange}
            />
            <button className="">
            <i className=""></i>
            </button>
        </div>
        </div>

    )
}

export default SearchBar;
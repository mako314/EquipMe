import React from "react";

function SearchBar({ }) {

    function handleChange(e) {
        console.log(e.target.value)
    }
    return (
        <div className="search">
            <input type="text" placeholder="Looking for something?" className="searchTerm" onChange={handleChange} />
            <button className="searchButton">
                <i className="fa fa-search"></i>
            </button>
        </div>

    )
}

export default SearchBar;
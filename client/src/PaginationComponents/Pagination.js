import React from "react";
import ReactPaginate from "react-paginate";

function Pagination({ paginate, array, cardsPerPage, pageCount }) {

    // Likely do not need className here
    
    return (
        <ReactPaginate
            onPageChange={paginate}
            pageCount={pageCount}
            previousLabel={"≪  previous"}
            nextLabel={"next ≫"}
            breakLabel="..."
            containerClassName={"flex list-none items-center justify-center divide-x divide-slate-200 overflow-hidden rounded border border-slate-200 text-sm text-slate-700 mt-10"} 
            pageClassName={"hidden md:inline-flex h-10 items-center justify-center stroke-slate-700 px-4 text-sm font-medium text-slate-700 transition duration-300 hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 focus:text-emerald-600 focus-visible:outline-none"}
            previousClassName={"page-number px-2"}
            nextClassName={"page-number px-2"}
            activeLinkClassName={"bg-emerald-500 text-white px-3"}
        />
    );
}

export default Pagination;
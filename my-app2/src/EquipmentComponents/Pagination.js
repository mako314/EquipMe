import React from "react";
import ReactPaginate from "react-paginate";

function Pagination({ paginate, array, cardsPerPage, pageCount }) {
    return (
        <ReactPaginate
            className="pagination"
            onPageChange={paginate}
            pageCount={pageCount}
            previousLabel={"≪ previous"}
            pageRangeDisplayed={1}
            nextLabel={"next ≫"}
            breakLabel="..."
            containerClassName={"pagination"}
            pageLinkClassName={"page-number"}
            previousLinkClassName={"page-number"}
            nextLinkClassName={"page-number"}
            activeLinkClassName={"active"}
        />
    );
}

export default Pagination;
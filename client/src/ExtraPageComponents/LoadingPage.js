import React from 'react';

const LoadingPage = ({loadDetails}) => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                <h2 className="text-xl font-semibold text-gray-700 mt-4">Loading {loadDetails}...</h2>
            </div>
        </div>
    );
};

export default LoadingPage;
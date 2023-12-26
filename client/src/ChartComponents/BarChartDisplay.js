import React from "react";
import { Bar } from 'react-chartjs-2';

function BarChartDisplay({
    chartRef,
    chartData,
    barChartOptions,
    updateCounter}){

    return(
        <div className="w-full h-full"> {/* Adjust height as needed */}
        <Bar
        key={updateCounter}
        data={chartData} 
        ref={chartRef} 
        options={barChartOptions}  />
        {/*   ref={chartRef} key={updateCounter} */}
      </div>
    )
}

export default BarChartDisplay;
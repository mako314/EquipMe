import React, { createContext, useState, useContext } from 'react';

const BarChartEquipmentData = createContext()

export const useEquipmentData = () => useContext(BarChartEquipmentData)

export const EquipmentDataProvider = ({ children }) => {
  const [barChartEquipmentData, setBarChartEquipmentData] = useState([])
  

  return (
    <BarChartEquipmentData.Provider value={{ barChartEquipmentData, setBarChartEquipmentData }}>
      {children}
    </BarChartEquipmentData.Provider>
  )
}

export default EquipmentDataProvider
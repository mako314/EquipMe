import {createContext} from "react";

const ApiUrlContext = createContext(null)

export const ApiProvider = ({ children }) =>{
    const apiUrl = process.env.REACT_APP_API_URL
    console.log(process.env.REACT_APP_API_URL)
    console.log(process.env)
    return (
        //Establishes the context, allows me to move my user around the entirety of my app now!
        <ApiUrlContext.Provider value={apiUrl}> 
            {children}
        </ApiUrlContext.Provider>
    )
}

export default ApiUrlContext
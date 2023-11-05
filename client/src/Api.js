import {createContext} from "react";

const ApiUrlContext = createContext(null)

export const ApiProvider = ({ children }) =>{
    const apiUrl = process.env.API_URL;
    return (
        //Establishes the context, allows me to move my user around the entirety of my app now!
        <ApiUrlContext.Provider value={apiUrl}> 
            {children}
        </ApiUrlContext.Provider>
    );
}

export default ApiUrlContext
import {createContext, useState} from "react";

const ApiUrlContext = createContext(null)

export const UserProvider = ({ children }) =>{

    return (
        //Establishes the context, allows me to move my user around the entirety of my app now!
        <ApiUrlContext.Provider value={[user, setUser]}> 
            {children}
        </ApiUrlContext.Provider>
    );
}

export default ApiUrlContext
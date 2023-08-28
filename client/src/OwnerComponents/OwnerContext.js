import {createContext, useState} from "react";

const OwnerContext = createContext(null)

export const OwnerProvider = ({ children }) =>{

    //useState to track owner, being passed to where it's needed. I pass setowner also to allow for owner login.
    const [owner, setOwner] = useState(null)

    return (
        //Establishes the context, allows me to move my owner around the entirety of my app now!
        <OwnerContext.Provider value={[user, setUser]}> 
            {children}
        </OwnerContext.Provider>
    );
}

export default OwnerContext
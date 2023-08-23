import {createContext, useState} from "react";

const UserContext = createContext(null)

export const UserProvider = ({ children }) =>{

    //useState to track user, being passed to where it's needed. I pass setUser also to allow for user login.
    const [user, setUser] = useState(null)

    return (
        //Establishes the context, allows me to move my user around the entirety of my app now!
        <UserContext.Provider value={[user, setUser]}> 
            {children}
        </UserContext.Provider>
    );
}

export default UserContext
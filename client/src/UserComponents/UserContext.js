import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    //

    return (
    <UserContext.Provider value={{ user, setUser }}>
    </UserContext.Provider>
    );
}


export default UserProvider;
import React, { createContext, useState, useContext, useEffect } from 'react';

const SessionContext = createContext();

export const UserSessionContext = () => useContext(SessionContext)

export const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [role, setRole] = useState('')
  const apiUrl=process.env.REACT_APP_API_URL
//   console.log(process.env.REACT_APP_API_URL)

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// https://stackoverflow.com/questions/60694924/what-does-resolve-and-reject-actually-do-in-javascript-promise

const checkSession = () => {
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}check_session`, {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        // Handle not authenticated status specifically
        console.log('User is not logged in.');
        // Set state to reflect that no user is logged in
        setCurrentUser(null)
        setRole('')
        // Optionally, return a resolved promise with a specific value
        // return Promise.resolve('Not Authenticated')
      } else {
        // Handle other types of errors
        throw new Error(`Session check failed with status: ${response.status}`);
      }
    })
    .then(data => {
      if (data.role === 'user' || data.role === 'owner') {
        setCurrentUser(data.details)
        setRole(data.role)
        // console.log("You are signed in as a ", data.role)
        resolve(data.details) // Resolve with the updated user details
      } else if (!data){
        // Handle when data is null due to an unsuccessful response
        reject(new Error('No data received'))
      } else {
        reject(new Error('No valid user role found'))
      }
    })
    .catch(error => {
      // console.error('Error during session check:', error)
      // Optionally, reject the promise here if you need to handle this error elsewhere
      // reject(error)
    })
  })
}
  // Run session check on mount
  useEffect(() => {
    checkSession()
  }, [])

  return (
    <SessionContext.Provider value={{ currentUser, role, setCurrentUser, setRole, checkSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionContext;
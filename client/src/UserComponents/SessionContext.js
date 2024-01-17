import React, { createContext, useState, useContext, useEffect } from 'react';

const SessionContext = createContext();

export const UserSessionContext = () => useContext(SessionContext)

export const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [role, setRole] = useState('')
  const apiUrl=process.env.REACT_APP_API_URL
//   console.log(process.env.REACT_APP_API_URL)

// https://stackoverflow.com/questions/60694924/what-does-resolve-and-reject-actually-do-in-javascript-promise
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

const checkSession = () => {
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}check_session`, {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) return response.json()
      throw new Error('Session check failed')
    })
    .then(data => {
      if (data.role === 'user' || data.role === 'owner') {
        setCurrentUser(data.details)
        setRole(data.role)
        console.log("You are signed in as a ", data.role)
        resolve(data.details) // Resolve with the updated user details
      } else {
        reject(new Error('No valid user role found'))
      }
    })
    .catch(error => {
      console.error('Error during session check:', error)
      reject(error) // Reject the promise on error
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
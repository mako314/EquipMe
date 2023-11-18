import React, { createContext, useState, useContext, useEffect } from 'react';

const SessionContext = createContext();

export const UserSessionContext = () => useContext(SessionContext)

export const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState([])
  const [role, setRole] = useState('')
  const apiUrl=process.env.REACT_APP_API_URL
//   console.log(process.env.REACT_APP_API_URL)

  const checkSession = () => {
    fetch(`${apiUrl}/check_session`, {
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) return response.json()
        throw new Error('Session check failed')
      })
      .then(data => {
        // console.log("Check Session Data:", data)
        if (data.role === 'user') {
          setCurrentUser(data.details)
          setRole('user')
          console.log("You are currently signed in as an user")
        } else if (data.role === 'owner') {
          setCurrentUser(data.details)
          setRole('owner')
          console.log("You are currently signed in as an owner")
        }
      })
      .catch(error => console.error('Error during session check:', error))
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
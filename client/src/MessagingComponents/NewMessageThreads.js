import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'
import Inbox from './Inbox'

function NewMessageThreads() {

// ---------------Detect whether or not an OWNER is logged in-------------------

  const [owner, setOwner] = useContext(OwnerContext)

  
  useEffect(() => {
    fetch("/owner/check_session").then((response) => {
        if (response.ok) {
            response.json().then((owner) => setOwner(owner))
        }
    })
  }, [])

  
// --------------------------------------------------------------------

// ---------------Detect whether or not a USER is logged in-------------------

  const [user, setUser] = useContext(UserContext)

  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user))
      }
    })
  }, [])
  
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <Inbox/>
    </div>
  )
}

export default NewMessageThreads
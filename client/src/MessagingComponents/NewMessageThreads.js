import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'
import Inbox from './Inbox'
import ChatArea from './ChatArea'

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

  // Take state from inbox and declare here so it is usable in whole messaging app
  const [inboxes, setInboxes] = useState([])
  const [SelectedThreadID, setSelectedThreadID] = useState(null)
  
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <Inbox 
      setInboxes={setInboxes} 
      inboxes={inboxes} 
      SelectedThreadID={SelectedThreadID}
      setSelectedThreadID={setSelectedThreadID}
      />

      {/* Message Area */}
      <ChatArea
      inboxes={inboxes} 
      SelectedThreadID={SelectedThreadID}
      />
    </div>
  )
}

export default NewMessageThreads
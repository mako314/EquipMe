import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api'
import Inbox from './Inbox'
import ChatArea from './ChatArea'

function NewMessageThreads({fromOwnerDash}) {

// ---------------Detect whether or not an OWNER is logged in-------------------

  const [owner, setOwner] = useContext(OwnerContext)
  const apiUrl = useContext(ApiUrlContext)

  
  useEffect(() => {
    fetch(`${apiUrl}owner/check_session`).then((response) => {
        if (response.ok) {
            response.json().then((owner) => setOwner(owner))
        }
    })
  }, [])

  
// --------------------------------------------------------------------

// ---------------Detect whether or not a USER is logged in-------------------

  const [user, setUser] = useContext(UserContext)

  useEffect(() => {
    fetch(`${apiUrl}check_session`).then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user))
      }
    })
  }, [])

  // Take state from inbox and declare here so it is usable in whole messaging app
  const [inboxes, setInboxes] = useState([])
  const [SelectedThreadID, setSelectedThreadID] = useState(null)
  const [newMessage, setNewMessage] = useState('') // State for the new message input
  const [recipientInfo, setRecipientInfo] = useState([])

  // console.log("This is your recipient!:",recipientInfo)

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <Inbox 
      setInboxes={setInboxes} 
      inboxes={inboxes} 
      SelectedThreadID={SelectedThreadID}
      setSelectedThreadID={setSelectedThreadID}
      newMessage={newMessage}
      setRecipientInfo={setRecipientInfo}
      recipientInfo={recipientInfo}
      fromOwnerDash={fromOwnerDash}
      />

      {/* Message Area */}
      <ChatArea
      inboxes={inboxes} 
      SelectedThreadID={SelectedThreadID}
      setNewMessage={setNewMessage}
      newMessage={newMessage}
      setInboxes={setInboxes}
      recipientInfo={recipientInfo}
      />

    </div>
  )
}

export default NewMessageThreads
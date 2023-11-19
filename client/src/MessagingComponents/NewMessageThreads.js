import React, { useContext, useEffect, useState} from 'react'
import { UserSessionContext } from '../UserComponents/SessionContext'
import Inbox from './Inbox'
import ChatArea from './ChatArea'

function NewMessageThreads({fromOwnerDash, setFromOwnerDash}) {

// ---------------Detect whether or not an OWNER is logged in-------------------
  // Take state from inbox and declare here so it is usable in whole messaging app
  const [inboxes, setInboxes] = useState([])
  const [SelectedThreadID, setSelectedThreadID] = useState(null)
  const [newMessage, setNewMessage] = useState('') // State for the new message input
  const [recipientInfo, setRecipientInfo] = useState([])
  const { currentUser, role } = UserSessionContext()

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
      setFromOwnerDash={setFromOwnerDash}
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
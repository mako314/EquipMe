import React, { useContext, useEffect, useState} from 'react'
import { UserSessionContext } from '../UserComponents/SessionContext'
import Inbox from './Inbox'
import ChatArea from './ChatArea'
import LoadingPage from '../ExtraPageComponents/LoadingPage';

function NewMessageThreads({fromOwnerDash, setFromOwnerDash}) {

// ---------------Detect whether or not an OWNER is logged in-------------------
  // Take state from inbox and declare here so it is usable in whole messaging app
  const [inboxes, setInboxes] = useState([])
  const [selectedThreadID, setSelectedThreadID] = useState(null)
  const [newMessage, setNewMessage] = useState('') // State for the new message input
  const [recipientInfo, setRecipientInfo] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser, role } = UserSessionContext()

  // console.log("LOADING:", isLoading)

  // if(isLoading){
  //   return <LoadingPage/>
  // }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <Inbox 
      setInboxes={setInboxes} 
      inboxes={inboxes} 
      selectedThreadID={selectedThreadID}
      setSelectedThreadID={setSelectedThreadID}
      newMessage={newMessage}
      setRecipientInfo={setRecipientInfo}
      recipientInfo={recipientInfo}
      fromOwnerDash={fromOwnerDash}
      setFromOwnerDash={setFromOwnerDash}
      setIsLoading={setIsLoading}
      isLoading={isLoading}
      />

      {/* Message Area */}
      <ChatArea
      inboxes={inboxes} 
      selectedThreadID={selectedThreadID}
      setNewMessage={setNewMessage}
      newMessage={newMessage}
      setInboxes={setInboxes}
      recipientInfo={recipientInfo}
      isLoading={isLoading}
      />

    </div>
  )
}

export default NewMessageThreads
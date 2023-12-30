import React, { useContext, useEffect, useState} from 'react'

import ApiUrlContext from '../Api'
import MessageInput from './MessageInput'
import { UserSessionContext } from '../UserComponents/SessionContext'

function ChatArea({inboxes, SelectedThreadID, setNewMessage, newMessage, setInboxes, recipientInfo }){

// ---------------Detect whether or not an OWNER is logged in-------------------
  const { currentUser, role } = UserSessionContext()
  const apiUrl = useContext(ApiUrlContext)

  // useEffect(() => {
  //   fetch(`${apiUrl}owner/check_session`, {
  //     credentials: 'include'
  //   }).then((response) => {
  //       if (response.ok) {
  //           response.json().then((owner) => setOwner(owner))
  //       }
  //   })
  // }, [])

//   console.log(owner)

  
// ----------------------------------------------------------------------
// ---------------Detect whether or not a USER is logged in-------------------

  // useEffect(() => {
  //   fetch(`${apiUrl}check_session`, {
  //     credentials: 'include'
  //   }).then((response) => {
  //     if (response.ok) {
  //       response.json().then((user) => setUser(user))
  //     }
  //   })
  // }, [])

  // useEffect(() => {
  //   fetch(`${apiUrl}check_session`, {
  //     credentials: 'include' // Ensures cookies are sent with the request
  //   })
  //   .then(response => {
  //     if (response.ok) {
  //       return response.json()
  //     } else {
  //       throw new Error('Session check failed')
  //     }
  //   })
  //   .then(data => {
  //     console.log("The Data",data)
  //     if (data.role === 'user') {
  //       setUser(data)
  //     } else if (data.role === 'owner') {
  //       setOwner(data)
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error during session check:', error)
  //   })
  // }, [apiUrl, setOwner, setUser])
  
  // console.log(owner)
  // console.log(user)
  
// --------------------------------------------------------------------

  // Selects the thread to display , I may incorporate a place holder in place of it being empty at the mounting of the application
  const selectedThread = inboxes?.find(inbox => inbox.id === SelectedThreadID);

    return (
        <div className="flex-grow p-4">
          <div className="bg-white rounded-lg shadow-md p-4 relative">
            <ul>
              {/* If selectedThread is available, map over its messages */}
              {selectedThread?.thread.messages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex items-center"> 
                    <img
                      src={
                        message.sender_id === currentUser?.id && message.user_type === role ? 
                        currentUser?.profileImage : message.sender_id === currentUser?.id && message.user_type === role ? 
                        currentUser?.profileImage : recipientInfo?.profileImage
                      }
                      alt="Avatar"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <p className="text-gray-600">{message.content}</p>
                    <div className="text-blue-500 text-xs ml-auto mt-6">
                      {message.message_status}
                      <p>
                        {message.created_on}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          </div>
          <MessageInput
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

export default ChatArea
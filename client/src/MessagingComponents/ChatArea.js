import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api'
import MessageInput from './MessageInput'

function ChatArea({inboxes, SelectedThreadID, setNewMessage, newMessage, setInboxes, recipientInfo }){

// ---------------Detect whether or not an OWNER is logged in-------------------

  const [owner, setOwner] = useContext(OwnerContext)
  const [user, setUser] = useContext(UserContext)
  const apiUrl = useContext(ApiUrlContext)
  
  useEffect(() => {
    fetch(`${apiUrl}owner/check_session`).then((response) => {
        if (response.ok) {
            response.json().then((owner) => setOwner(owner))
        }
    })
  }, [])

//   console.log(owner)

  
// ----------------------------------------------------------------------
// ---------------Detect whether or not a USER is logged in-------------------

  useEffect(() => {
    fetch(`${apiUrl}check_session`).then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user))
      }
    })
  }, [])
  
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
                        message.sender_id === user?.id && message.user_type === "user" ? 
                        user?.profileImage : message.sender_id === owner?.id && message.user_type === "owner" ? 
                        owner?.profileImage : recipientInfo?.profileImage
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
import React, { useContext, useEffect, useState} from 'react'
import MessageInput from './MessageInput'
import { UserSessionContext } from '../UserComponents/SessionContext'
import LoadingPage from '../ExtraPageComponents/LoadingPage'

function ChatArea({inboxes, selectedThreadID, setNewMessage, newMessage, setInboxes, recipientInfo, isLoading }){

// ---------------Detect whether or not an OWNER is logged in-------------------
  const { currentUser, role } = UserSessionContext()

  // Selects the thread to display , I may incorporate a place holder in place of it being empty at the mounting of the application
  const selectedThread = inboxes?.find(inbox => inbox.id === selectedThreadID);
  // selectedThread?.thread?.messages?.map((message) => (console.log("the message details:",message)))
    return (
        <div className="flex-grow p-4">
          {isLoading && <LoadingPage loadDetails={"Your Chat"}/>}
          {inboxes.length === 0 && (
            <div className="text-center p-10 mt-5 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800">Your Inbox is Empty</h2>
              <p className="text-gray-600 mt-2">Looks like you don't have any messages yet.</p>
              <p className="text-gray-600">Feel free to explore and connect with others!</p>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md p-4 relative">
            <ul>
              {/* If selectedThread is available, map over its messages */}
              {selectedThread?.thread?.messages?.map((message) => (      
              <div key={message.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center mr-4">
                  <img
                    src={
                      message.sender_id === currentUser?.id && message.user_type === role ?
                      currentUser?.profileImage : recipientInfo?.profileImage
                    }
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-gray-600 text-sm truncate text-center mt-2">
                    {message.sender_id === currentUser?.id && message.user_type === role ?
                      `${currentUser?.firstName} ${currentUser?.lastName}` : `${recipientInfo.firstName} ${recipientInfo.lastName}`}
                  </p>
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-gray-600 break-words">{message.content}</p>
                  <div className="text-blue-500 text-xs mt-2 self-end">
                    <p>{message.message_status}</p>
                    <p>{message.created_at}</p>
                  </div>
                </div>
              </div>
            </div>

              ))}
            </ul>
          </div>
          <MessageInput
          inboxes={inboxes} 
          selectedThreadID={selectedThreadID}
          setNewMessage={setNewMessage}
          newMessage={newMessage}
          setInboxes={setInboxes}
          recipientInfo={recipientInfo}
          />
        </div>
      )
}

export default ChatArea
import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api'
import MessageThreads from './MessageThreads'

function MessageInput({SelectedThreadID, setNewMessage, newMessage, setInboxes, inboxes, recipientInfo}){

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

//   console.log(owner)

  
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
// --------------------------------------------------------------------

const handleSendMessage = () => {

    let message
    
    // This portion below tests whether or not a user or an owner is logged in, and declares them the sender. From there, the recipient info is pulled from inbox.js and prop drilled into here and placed into the appropriate spot.

    if (owner && owner.id){
      message = {
        "recipient_id": recipientInfo.id,
        "sender_id": owner.id,
        "context_id": 2,
        "user_type": "owner",
        "content": newMessage,
        "message_status": "Delivered",
        "created_at": new Date().toISOString(),
        "thread_id": SelectedThreadID
      }
    } else if (user && user.id)
    {
      message = {
        "recipient_id": recipientInfo.id,
        "sender_id": user.id,
        "context_id": 2,
        "user_type" : "user",
        "content": newMessage,
        "message_status": "Delivered",
        "created_at": new Date().toISOString(),
        "thread_id": SelectedThreadID
      }
    } else {
      message = {
        "recipient_id": 2,
        "sender_id": 1,
        "context_id": 2,
        "content": newMessage,
        "message_status": "Delivered",
        "created_at": new Date().toISOString(),
        "thread_id": SelectedThreadID
      }
  }

    console.log('Sending message:', message)
    fetch(`${apiUrl}messages`, {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((message) => { if (message && message.id){
        console.log("Adding message:", message.content, "To a thread with an ID of:", message.thread_id)
        //This monster down here is what does all the magic. Cannot believe I hadn't considered just using the spread operator for real time updates... ah!!
        const updatedInboxes = inboxes?.map(inbox => {
            if (inbox.id === SelectedThreadID) {
                console.log("Inbox ID:",inbox.id)
                console.log("Thread ID:",SelectedThreadID)
                return {
                    ...inbox,
                    thread: {
                        ...inbox.thread,
                        messages: [...inbox.thread.messages, message]
                    }
                }
            }
            return inbox
        })

        setInboxes(updatedInboxes)
    }})

    setNewMessage('')
  }

    return (
        <div className="mt-4 flex items-end">
        {/* NEEDS TO GO INSIDE OF MESSAGE CONTENT, NOT NEW MESSAGE THREADS */}
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow border rounded py-2 px-3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white rounded px-6 py-2 ml-2"
          >
            Send
          </button>
        </div>
      )
}

export default MessageInput
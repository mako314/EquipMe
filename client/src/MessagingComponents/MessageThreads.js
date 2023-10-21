import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'

function MessageThreads() {

// ---------------Detect whether or not an OWNER is logged in-------------------

  const [owner, setOwner] = useContext(OwnerContext)

  
  useEffect(() => {
    fetch("/owner/check_session").then((response) => {
        if (response.ok) {
            response.json().then((owner) => setOwner(owner))
        }
    })
  }, [])

  console.log(owner)
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
// --------------------------------------------------------------------


  //State to manage detection of threads, selecting a thread by context id, and sending a new message.
  const [threads, setThreads] = useState([])
  const [selectedContextId, setSelectedContextId] = useState(null)
  const [newMessage, setNewMessage] = useState('') // State for the new message input
  const [newMessageSent, setNewMessageSent] = useState(true)
  const [recipientFromThreadID, setRecipientFromThreadID] = useState(null)
  const [senderFromThreadID, setSenderFromThreadID] = useState(null)


  useEffect(() => {
    // Ensure both owner and user data are available before proceeding
    if (owner && owner.id) {
      fetchOwnerMessages(owner.id)
    } else if (user && user.id) {
      fetchUserMessages(user.id)
    } else {
      // Handle the case where neither owner nor user data is available
      setThreads([])
      setSelectedContextId(null)
    }
  }, [owner, user, newMessageSent])

  const fetchOwnerMessages = async (ownerId) => {
    try {
      const ownerResponse = await fetch(`/owner/messages/${ownerId}`)
      if (ownerResponse.ok) {
        const data = await ownerResponse.json()
        setThreads(data)
        // Automatically select the context ID of the first thread when threads are loaded
        if (data.length > 0) {
          setSelectedContextId(data[0].context_id)
        }
      }
    } catch (error) {
      console.error('Error fetching owner message threads:', error)
    }
  }

  const fetchUserMessages = async (userId) => {
    try {
      const userResponse = await fetch(`/user/messages/${userId}`)
      if (userResponse.ok) {
        const data = await userResponse.json()
        setThreads(data)
        // Automatically select the context ID of the first thread when threads are loaded
        if (data.length > 0) {
          setSelectedContextId(data[0].context_id)
        }
      }
    } catch (error) {
      console.error('Error fetching user message threads:', error)
    }
  }

  //When one clicks the mapped threads (by context ID) in the return, this selects the context ID and displays those messages
  const handleContextSelect = (contextId) => {
    setSelectedContextId(contextId)
    console.log("Selected context ID:", contextId)
  }
  
  //This essentially goes into the threads, and accumulates / tests for every context ID that way they're all unique as they should be
  const filteredThreads = threads.length > 0
  ? threads.reduce((acc, thread) => {
      if (!acc[thread.context_id]) {
        acc[thread.context_id] = []
      }
      acc[thread.context_id].push(thread)
      return acc
    }, {})
  : {}

  
  const addMessageToInbox = (messageId, ownerId, userId) => {
    // const randomMessageId = Math.floor(Math.random() * 1000000)
    let inboxData

    if (owner && owner.id){
      inboxData = {
        "user_id": userId,
        "owner_id": owner.id,
        "message_id": messageId,
      }
    } else {
     inboxData = {
      "user_id": userId,
      "owner_id": ownerId,
      "message_id": messageId,
    }
  }
  
    fetch("/message/to/inbox", {
      method: "POST",
      body: JSON.stringify(inboxData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((inbox) => console.log("Added to inbox:", inbox))
      .catch((error) => {
        console.error("Error adding to inbox:", error)
      })
  }
  
  // Handles actually sending the message with the text area, using formik seemed to complicated in this sense, so I will have to see what I can do about 
  const handleSendMessage = () => {

    let message

    if (owner && owner.id){
      message = {
        "recipient_id": 2,
        "sender_id": 1,
        "context_id": selectedContextId,
        "subject": null,
        "content": newMessage,
        "message_status": "sent",
        "created_on": new Date().toISOString(),
      }
    } else {
      message = {
        "recipient_id": 2,
        "sender_id": 1,
        "context_id": selectedContextId,
        "subject": null,
        "content": newMessage,
        "message_status": "sent",
        "created_on": new Date().toISOString(),
      }
  }

    console.log('Sending message:', message)
    fetch("/messages", {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((message) => { if (message && message.id){
      addMessageToInbox(message.id, message.recipient_id, message.sender_id)
      }})
    
   
    // Clear the input field after sending the message
    setNewMessageSent(!newMessageSent)
    setNewMessage('')

  }
  
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Message Threads</h2>
        <ul>
          {filteredThreads && Object.entries(filteredThreads).map(([contextId]) => (
            <li
              key={contextId}
              className={`cursor-pointer ${
                selectedContextId === contextId ? 'font-semibold' : ''
              }`}
              onClick={() => {
                handleContextSelect(contextId)
                setRecipientFromThreadID(filteredThreads[contextId][0].recipient_id)
                setSenderFromThreadID(filteredThreads[contextId][0].sender_id)
              }
              }
            >
              {/* Display the subject of the first thread in the context */
              filteredThreads[contextId][0].subject}
              {console.log(filteredThreads)}
              {/* {console.log("recipient id from thread", recipientFromThreadID)}
              {console.log("sender id from thread", senderFromThreadID)} */}
            </li>
          ))}
        </ul>
      </div>

      {/* Message Content */}
      <div className="flex-grow p-4">
        {selectedContextId !== null && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul>
              {filteredThreads[selectedContextId]?.map((message) => (
                <div
                  key={message.id}
                  className="bg-white rounded-lg shadow-md p-4 mb-4"
                >
                  
                  <p className="text-lg font-semibold mb-2">{message.subject}</p>
                  <div className="flex items-center"> 
                  <img
                    src={message.sender_id === user.id && message.user_type === "user" ? user.profileImage : "error"} // Use the path to your avatar image
                    alt="Avatar"
                    className="w-8 h-8 rounded-full mr-2" // Adjust the size and style
                  />
                  <p className="text-gray-600">{message.content}</p>
                  {/* {console.log("MESSAGE SENDER ID:" ,message.sender_id)}
                  {console.log("USER TYPE:", message.user_type)} */}
                  </div>
                </div>
              ))}
            </ul>
            {/*   */}
          </div>
        )}
          <div className="mt-4 flex items-end">
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
      </div>
    </div>
  )
}

export default MessageThreads

import React, { useEffect, useState } from 'react'

function MessageThreads() {
  const [threads, setThreads] = useState([])
  const [selectedContextId, setSelectedContextId] = useState(null)
  const [newMessage, setNewMessage] = useState('') // State for the new message input
  const [newMessageSent, setNewMessageSent] = useState(true);

  useEffect(() => {
    // Fetch message threads from API
    fetch('/messages/2')
      .then((response) => response.json())
      .then((data) => {
        setThreads(data)
        console.log(data)

        // Automatically select the context ID of the first thread when threads are loaded
        if (data.length > 0) {
          setSelectedContextId(data[0].context_id)
        }
      })
      .catch((error) => {
        console.error('Error fetching message threads:', error)
      })
  }, [newMessageSent])

  const handleContextSelect = (contextId) => {
    setSelectedContextId(contextId)
    console.log("Selected context ID:", contextId)
  }
  
  const filteredThreads = threads.length > 0
  ? threads.reduce((acc, thread) => {
      if (!acc[thread.context_id]) {
        acc[thread.context_id] = []
      }
      acc[thread.context_id].push(thread)
      return acc
    }, {})
  : {}

  
  const addMessageToInbox = (ownerId, userId) => {
    const randomMessageId = Math.floor(Math.random() * 1000000)

    const inboxData = {
      "user_id": userId,
      "owner_id": ownerId,
      "message_id": randomMessageId,
    };
  
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
        console.error("Error adding to inbox:", error);
      });
  };
  

  const handleSendMessage = () => {
    let message = {
      "recipient_id": 1,
      "sender_id": 2,
      "context_id": selectedContextId,
      "subject": null,
      "content": newMessage,
      "message_status": "sent",
      "created_on": new Date().toISOString(),
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
    .then((message) => console.log(message))
    
    if (message){
    addMessageToInbox(message.recipient_id, message.sender_id)
    }
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
              onClick={() => handleContextSelect(contextId)}
            >
              {/* Display the subject of the first thread in the context */
              filteredThreads[contextId][0].subject}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        {selectedContextId !== null && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul>
              {filteredThreads[selectedContextId]?.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-white rounded-lg shadow-md p-4 mb-4"
                >
                  <p className="text-lg font-semibold mb-2">{thread.subject}</p>
                  <p className="text-gray-600">{thread.content}</p>
                </div>
              ))}
            </ul>
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

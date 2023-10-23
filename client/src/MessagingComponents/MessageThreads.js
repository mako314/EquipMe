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
  // const [newMessageSent, setNewMessageSent] = useState(false)
  const [newMessagesCount, setNewMessagesCount] = useState(0) // Track new messages

  //State to hold info of recipient, 
  const [recipientInfo, setRecipientInfo] = useState(null)
  const [recipientFromThreadID, setRecipientFromThreadID] = useState(null)
  const [senderFromThreadID, setSenderFromThreadID] = useState(null)

  // State variable to store the selected thread ID
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  // This initializes the fetching of the messages, once it checks whether an owner or a user are logged in, it then fetches their messages.
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
  }, [owner, user, newMessagesCount])
  // 

  // const fetchMessages = () => {
  //   if (owner && owner.id) {
  //     fetchOwnerMessages(owner.id)
  //   } else if (user && user.id) {
  //     fetchUserMessages(user.id)
  //   } else {
  //     setThreads([])
  //     setSelectedContextId(null)
  //   }
  // }

  // useEffect(() => {
  //   // Ensure both owner and user data are available before proceeding
  //   fetchMessages()
  //   console.log("I'VE RAN")
  // }, [owner, user, newMessagesCount])

  console.log("NEW MESSAGE COUNT:", newMessagesCount)


  //-------------------------------------------------------------------------------------------------------------------------------
  // Needed to use async and such due to the aynschrous nature of react
  const fetchOwnerMessages = async (ownerId) => {
    try {
      const ownerResponse = await fetch(`/owner/messages/${ownerId}`)
      if (ownerResponse.ok) {
        const data = await ownerResponse.json()
        setThreads(data)
        // Automatically select the context ID of the first thread when threads are loaded
        if (data.length > 0 && selectedContextId === null) {
          setSelectedContextId(data[0].context_id)
          setRecipientFromThreadID(data[0].recipient_id)
          //likely need to edit the setSelectedContext here also
        } else if (selectedContextId){
          setSelectedContextId(data[selectedContextId].context_id)
        }
      }
    } catch (error) {
      console.error('Error fetching owner message threads:', error)
    }
  }

  // Needed to use async and such due to the aynschrous nature of react
  const fetchUserMessages = async (userId) => {
    try {
      const userResponse = await fetch(`/user/messages/${userId}`)
      if (userResponse.ok) {
        const data = await userResponse.json()
        setThreads(data)
        // Automatically select the context ID of the first thread when threads are loaded
        if (data.length > 0 && selectedContextId === null) {
          setSelectedContextId(data[0].context_id)
          setRecipientFromThreadID(data[0].recipient_id)
          //likely need to edit the setSelectedContext here also
        } else if (selectedContextId){
          setSelectedContextId(data[selectedContextId].context_id)
        }
      }
    } catch (error) {
      console.error('Error fetching user message threads:', error)
    }
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

  //When one clicks the mapped threads (by context ID) in the return, this selects the context ID and displays those messages
  const handleContextSelect = (contextId) => {
    setSelectedContextId(contextId)
    console.log("Selected context ID:", contextId)
  }

  const addMessageToInbox = (messageId, ownerId, userId) => {
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

  //------------------------Above this, is handling all the populating of messages, -----------------------------------
  
  // Handles actually sending the message with the text area, using formik seemed to complicated in this sense, so I will have to see what I can do about 
  const handleSendMessage = () => {

    let message
    // let currentSelectedContextId = selectedContextId

    if (owner && owner.id){
      message = {
        "recipient_id": 2,
        "sender_id": owner.id,
        "context_id": selectedContextId,
        "user_type": "owner",
        "subject": null,
        "content": newMessage,
        "message_status": "Delivered",
        "created_on": new Date().toISOString(),
      }
    } else if (user && user.id)
    {
      message = {
        "recipient_id": 2,
        "sender_id": user.id,
        "context_id": selectedContextId,
        "user_type" : "user",
        "subject": null,
        "content": newMessage,
        "message_status": "Delivered",
        "created_on": new Date().toISOString(),
      }
    } else {
      message = {
        "recipient_id": 2,
        "sender_id": 1,
        "context_id": selectedContextId,
        "subject": null,
        "content": newMessage,
        "message_status": "Delivered",
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
      handleContextSelect(selectedContextId)
    }})
    
   
    

    // setNewMessagesCount(prevCount => prevCount + 1)
    // Clear the input field after sending the message
    setNewMessage('')

    // fetchMessages()
  }

  useEffect(() => {
    if (user && selectedContextId) {
      fetchUserRecipient(recipientFromThreadID)
    } else if (owner && selectedContextId) {
      fetchOwnerRecipient(recipientFromThreadID)
    }
  }, [selectedContextId, user, recipientFromThreadID, owner])

    const fetchUserRecipient = async (recipientFromThreadID) => {
      try {
        const userRecipientResponse = await fetch(`/equipment_owner/${recipientFromThreadID}`)
        if (userRecipientResponse.ok) {
          const data = await userRecipientResponse.json()
          setRecipientInfo(data)
          // Automatically select the context ID of the first thread when threads are loaded
        }
      } catch (error) {
        console.error('Error fetching user message threads:', error)
      }
    }

    const fetchOwnerRecipient = async (recipientFromThreadID) => {
      try {
        const ownerRecipientResponse = await fetch(`/user/${recipientFromThreadID}`)
        if (ownerRecipientResponse.ok) {
          const data = await ownerRecipientResponse.json()
          setRecipientInfo(data)
          // Automatically select the context ID of the first thread when threads are loaded
        }
      } catch (error) {
        console.error('Error fetching user message threads:', error)
      }
    }

    // console.log(recipientInfo)
    // console.log(owner)
    // console.log(user)
  
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
                setRecipientFromThreadID(filteredThreads[contextId][selectedContextId].recipient_id)
                // console.log("Here's the recipient id info:", filteredThreads[contextId][selectedContextId].recipient_id)
                setSenderFromThreadID(filteredThreads[contextId][0].sender_id)
                if (user){
                  fetchUserRecipient(recipientFromThreadID)
                } else if(owner){
                  fetchOwnerRecipient(recipientFromThreadID)
                }
              }
              }
            >
              {/* Display the subject of the first thread in the context */
              filteredThreads[contextId][0].subject}
               {/* {console.log(filteredThreads)} */}
              {/* {console.log("Here's the recipient id info:", filteredThreads.recipient_id)}
              {console.log("recipient id from thread", recipientFromThreadID)}
              {console.log("sender id from thread", senderFromThreadID)}  */}
            </li>
          ))}
        </ul>
      </div>

      {/* Message Content */}
      <div className="flex-grow p-4">
        {selectedContextId !== null && (
          <div className="bg-white rounded-lg shadow-md p-4 relative">
            <ul>
              {filteredThreads[selectedContextId]?.map((message) => (
                <div
                  key={message.id}
                  className="bg-white rounded-lg shadow-md p-4 mb-4"
                >
                  
                  <p className="text-lg font-semibold mb-2">{message.subject}</p>
                  <div className="flex items-center"> 
                  <img
                     src={
                      message.sender_id === user?.id && message.user_type === "user" ? 
                      user?.profileImage : message.sender_id === owner?.id && message.user_type === "owner" ? 
                      owner?.profileImage : recipientInfo?.profileImage
                    }
                    alt="Avatar"
                    className="w-8 h-8 rounded-full mr-2" // Adjust the size and style
                  />
                  <p className="text-gray-600">{message.content}</p>
                  {/* {console.log("MESSAGE SENDER ID:" ,message.sender_id)}
                  {console.log("USER TYPE:", message.user_type)}*/}
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

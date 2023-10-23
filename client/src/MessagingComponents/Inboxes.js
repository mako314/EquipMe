import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'

function Inboxes({}) {

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

    const [threads, setThreads] = useState([])
    const [selectedContextId, setSelectedContextId] = useState(null)


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
      }, [owner, user])
    
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
            } else if (selectedContextId){
              console.log("INSIDE OF FETCH Owner MESSAGES", selectedContextId)
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
            } else if (selectedContextId){
              console.log("INSIDE OF FETCH USER MESSAGES", selectedContextId)
              setSelectedContextId(data[selectedContextId].context_id)
            }
          }
        } catch (error) {
          console.error('Error fetching user message threads:', error)
        }
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

    return(
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
    )
}

export default Inboxes
import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'

function ChatArea({inboxes, SelectedThreadID}){

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



//const [inboxes, setInboxes] = useState([])
//const [SelectedThreadID, setSelectedThreadID] = useState(null)
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
                      src="" // This will be set later on
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
        </div>
      )
}

export default ChatArea
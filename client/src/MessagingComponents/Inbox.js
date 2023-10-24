import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'

function Inbox({inboxes, setInboxes,SelectedThreadID, setSelectedThreadID, recipientInfo, setRecipientInfo }){

// ---------------Detect whether or not an OWNER is logged in-------------------

  const [owner, setOwner] = useContext(OwnerContext)
  const [user, setUser] = useContext(UserContext)
  
  useEffect(() => {
    fetch("/owner/check_session").then((response) => {
        if (response.ok) {
            response.json().then((owner) => setOwner(owner))
        }
    })
  }, [])

  // console.log(owner)
// ---------------Detect whether or not a USER is logged in-------------------

  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user))
      }
    })
  }, [])
// --------------------------------------------------------------------

    let owner_inboxes;
    if (owner && owner.owner_inboxes) {
        owner_inboxes = owner.owner_inboxes
        // console.log("Owner Inboxes:", owner_inboxes)
    }

    // useEffect(() => {
    //     if (user){
    //     setInboxes(user)
    //     } else if (owner){
    //     setInboxes(owner_inboxes)
    //     } else{
    //     setInboxes(null)
    //     }
    //   }, [user, owner, owner_inboxes])


    useEffect(() => {
      if (user && Array.isArray(user)) {
          setInboxes(user);
      } else if (owner && Array.isArray(owner_inboxes)) {
          setInboxes(owner_inboxes);
      } else {
          setInboxes([]);
      }
      }, [user, owner, owner_inboxes]);
      console.log("Inboxes in State:", inboxes)

    const handleThreadSelect = (threadID) => {
    setSelectedThreadID(threadID)
    console.log("Selected thread ID:", threadID)
    }

    const fetchRecipientData = async (recipientID, userType) => {
      let endpoint = userType === "user" ? `/user/${recipientID}` : `/equipment_owner/${recipientID}`;
      
      console.log("Recipient ID:", recipientID)
      console.log("Type of user:", userType)

      try {
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          setRecipientInfo(data)
        }
      } catch (error) {
        console.error('Error fetching recipient data:', error)
      }
    }
    

    return(
      <div className="w-1/4 bg-gray-200 p-4">
        {/* Left Sidebar */}
        <h2 className="text-2xl font-bold mb-4">Message Inboxes</h2>
        <ul>
          {inboxes?.map((inbox) => (
            <li
              key={inbox.id}
              className={`cursor-pointer ${
                SelectedThreadID === inbox.id ? 'font-semibold' : ''
              }`}
              onClick={() => {
                handleThreadSelect(inbox.id)
                const firstMessage = inbox.thread.messages[0]
                const recipientType = firstMessage.user_type === "user" ? "owner" : "user"
                const recipientID = firstMessage.user_type === "user" ? firstMessage.recipient_id : firstMessage.sender_id
                fetchRecipientData(recipientID, recipientType)
              }}
            >
                {inbox.thread.subject}
            </li>
          ))}
        </ul>
      </div>
    )
}

export default Inbox
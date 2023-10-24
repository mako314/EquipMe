import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'

function Inbox({inboxes, setInboxes,SelectedThreadID, setSelectedThreadID, setRecipientInfo }){

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

  console.log(user)
// --------------------------------------------------------------------

    let user_inboxes
    if (user && user.user_inboxes) {
        user_inboxes = user.user_inboxes
        // console.log("User Inboxes:", user_inboxes)
    }

    let owner_inboxes
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
      if (user_inboxes && Array.isArray(user_inboxes)) {
          setInboxes(user_inboxes)
      } else if (owner_inboxes && Array.isArray(owner_inboxes)) {
          setInboxes(owner_inboxes)
      } else {
          setInboxes([])
      }
  }, [user_inboxes, owner_inboxes])

    console.log("Inboxes in State:", inboxes)

    const handleThreadSelect = (threadID) => {
    setSelectedThreadID(threadID)
    console.log("Selected thread ID:", threadID)
    }

    const fetchRecipientData = async (recipientID, userType) => {
      let endpoint = userType === "user" ? `/user/${recipientID}` : `/equipment_owner/${recipientID}`;
      
      // console.log("Recipient ID:", recipientID)
      

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
                handleThreadSelect(inbox.id);
                const firstMessage = inbox.thread.messages[0];
                
                let recipientType;
                let recipientID;

                if (user) {
                    // If a user is logged in
                    if (firstMessage.user_type === "user") {
                        // If the first message was sent by a user
                        recipientType = "owner"
                        recipientID = firstMessage.recipient_id
                    } else {
                        // If the first message was sent by an owner
                        recipientType = "owner"
                        recipientID = firstMessage.sender_id
                    }
                } else if (owner) {
                    // If an owner is logged in
                    if (firstMessage.user_type === "owner") {
                        // If the first message was sent by an owner
                        recipientType = "user"
                        recipientID = firstMessage.recipient_id
                    } else {
                        // If the first message was sent by a user
                        recipientType = "user"
                        recipientID = firstMessage.sender_id
                    }
                }
                
                console.log("Recipient Type:", recipientType);
                console.log("Recipient ID:", recipientID);
                fetchRecipientData(recipientID, recipientType);
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
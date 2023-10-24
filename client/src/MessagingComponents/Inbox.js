import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'

function Inbox(){

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

  const [inboxes, setInboxes] = useState([])
  const [SelectedThreadID, setSelectedThreadID] = useState(null)

    let owner_inboxes;
    if (owner && owner.owner_inboxes) {
        owner_inboxes = owner.owner_inboxes
        console.log("Owner Inboxes:", owner_inboxes)
    }

    useEffect(() => {
        if (user){
        setInboxes(user)
        } else if (owner){
        setInboxes(owner_inboxes)
        } else{
        setInboxes(null)
        }
      }, [user, owner, owner_inboxes])

      console.log("Inboxes in State:", inboxes)

    const handleThreadSelect = (threadID) => {
    setSelectedThreadID(threadID)
    console.log("Selected thread ID:", threadID)
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
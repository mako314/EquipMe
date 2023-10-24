import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'

function MessageTest(){

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

    return(
        <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Message Inboxes</h2>
        <ul>
          {inboxes?.map((inbox) => (
            <li
              key={inbox.id}
            >
                {inbox.thread.subject}
            </li>
          ))}
        </ul>
      </div>
    </div>
    )
}

export default MessageTest
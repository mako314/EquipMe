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

  const [threads, setThreads] = useState([])

    let owner_inboxes;
    if (owner && owner.owner_inboxes) {
        owner_inboxes = owner.owner_inboxes
        console.log("Owner Inboxes:", owner_inboxes)
    }

    useEffect(() => {
        if (user){
        setThreads(user)
        } else if (owner){
        setThreads(owner_inboxes)
        } else{
        setThreads(null)
        }
      }, [])

      console.log("Threads in State:", threads)

    return(
        <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Message Threads</h2>
        <ul>
          {/* {threads.map((thread) => (
            <li
              key={thread.id}
            >
            </li>
          ))} */}
        </ul>
      </div>
    </div>
    )
}

export default MessageTest
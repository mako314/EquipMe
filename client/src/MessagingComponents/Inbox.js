import React, { useContext, useEffect, useState} from 'react'
import OwnerContext from '../OwnerComponents/OwnerContext'
import UserContext from '../UserComponents/UserContext'
import ApiUrlContext from '../Api';
import {useNavigate} from 'react-router-dom';

function Inbox({inboxes, setInboxes,SelectedThreadID, setSelectedThreadID, setRecipientInfo, fromOwnerDash }){

// ---------------Detect whether or not an OWNER is logged in-------------------
 

  const [owner, setOwner] = useContext(OwnerContext)
  const [user, setUser] = useContext(UserContext)
  const apiUrl = useContext(ApiUrlContext)

  // const [ownerInboxes, setOwnerInboxes] = useState([])
  // const [userInboxes, setUserInboxes] = useState([])

  const navigate = useNavigate()
  
  // useEffect(() => {
  //   fetch(`${apiUrl}owner/check_session`, {
  //     credentials: 'include'
  //   }).then((response) => {
  //       if (response.ok) {
  //           response.json().then((owner) => setOwner(owner))
  //       }
  //   })
  // }, [])

  
// ---------------Detect whether or not a USER is logged in-------------------

  // useEffect(() => {
  //   fetch(`${apiUrl}check_session`, {
  //     credentials: 'include'
  //   }).then((response) => {
  //     if (response.ok) {
  //       response.json().then((user) => setUser(user))
  //     }
  //   })
  // }, [])

  useEffect(() => {
    fetch(`${apiUrl}check_session`, {
      credentials: 'include' // Ensures cookies are sent with the request
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Session check failed')
      }
    })
    .then(data => {
      const role = data.role
      const userDetails = data.details

      console.log("The Data:",data)
      // console.log("The Role:",data.role )
      if (role === 'user') {
        console.log("The Role:", role )
        setUser(userDetails)
      } else if (role === 'owner') {
        console.log("The Role:", role )
        setOwner(userDetails)
      }
    })
    .catch(error => {
      console.error('Error during session check:', error)
    })
  }, [apiUrl, setOwner, setUser])
  console.log("You an owner?",owner)
  console.log(user)
// --------------------------------------------------------------------

    // let user_inboxes
    // if (user && user.user_inboxes) {
    //     setInboxes(user.user_inboxes)
    //     // console.log("User Inboxes:", user_inboxes)
    // }

    // let owner_inboxes
    // if (owner && owner.owner_inboxes) {
    //    setInboxes(owner.owner_inboxes)
    //     // console.log("Owner Inboxes:", owner_inboxes)
    // }

    useEffect(() => {
      if (user && user.user_inboxes) {
        setInboxes(user.user_inboxes)
        // console.log("User Inboxes:", user_inboxes)
    }

      if (owner && owner.owner_inboxes) {
       setInboxes(owner.owner_inboxes)
        // console.log("Owner Inboxes:", owner_inboxes)
    }
  }, [owner, user])


    // I had a normal use Effect earlier, but I was getting issues, so I incorporated Array.isArray to test for whether or not it's an array before setting state
  //   useEffect(() => {
  //     if (user_inboxes && Array.isArray(user_inboxes)) {
  //         setInboxes(user_inboxes)
  //     } else if (owner_inboxes && Array.isArray(owner_inboxes)) {
  //         setInboxes(owner_inboxes)
  //     } else {
  //         setInboxes([])
  //     }
  // }, [user_inboxes, owner_inboxes])

    // console.log("Inboxes in State:", inboxes)

    //This handles simple thread selection, basically taking the threads we have mapped out on the left sidebar and taking the ID to select the thread.
    const handleThreadSelect = (threadID) => {
    setSelectedThreadID(threadID)
    // console.log("Selected thread ID:", threadID)
    }

    //Goes inside the onclick with the conditionals (ifs and else ifs) to determine who the recipient is. Tests for whether or not an individual signed in is the recipient or the sender, takes that ID and user type to connect to backend.
    const fetchRecipientData = async (recipientID, userType) => {
      let endpoint = userType === "user" ? `${apiUrl}user/${recipientID}` : `${apiUrl}equipment_owner/${recipientID}`;
      
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

    //This returns one to the owner dashboard if they came from there
    const navigateBackToOwnerDash = () => {
      navigate(`/owner/dashboard`)
  }

  const inboxSource = user || owner
    

    return(
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col justify-between">
        {/* Left Sidebar */}
        <div> 
        <h2 className="text-2xl font-bold mb-4"> Welcome {owner ? owner?.firstName : user?.firstName} </h2>
        <h3 className="text-l font-bold mb-4"> View your Inbox Below</h3>
        {/* ^^^ is just a place holder,  */}
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

        {fromOwnerDash === true ? <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={navigateBackToOwnerDash}>
               Return to Dashboard
              </button>
        </div> : ""}
        
      </div>
    )
}

export default Inbox
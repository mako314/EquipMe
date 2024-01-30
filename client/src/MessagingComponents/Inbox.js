import React, { useContext, useEffect, useState} from 'react'
import ApiUrlContext from '../Api';
import {useNavigate} from 'react-router-dom';
import { UserSessionContext } from '../UserComponents/SessionContext';
import {toast} from 'react-toastify'
import LoadingPage from '../ExtraPageComponents/LoadingPage';


function Inbox({inboxes, setInboxes, selectedThreadID, setSelectedThreadID, setRecipientInfo, fromOwnerDash, setFromOwnerDash, setIsLoading , isLoading}){

// ---------------Detect whether or not an OWNER is logged in-------------------
  const { currentUser, role, setCurrentUser } = UserSessionContext()


  const apiUrl = useContext(ApiUrlContext)
  const [toggleDelete, setToggleDelete] = useState(false)
  const [deletingThreadId, setDeletingThreadId] = useState(null)

  // console.log("THE INBOXES:", inboxes)
  // const [ownerInboxes, setOwnerInboxes] = useState([])
  // const [userInboxes, setUserInboxes] = useState([])

  const navigate = useNavigate()
  // console.log("You an owner?",owner)
  // console.log(user)

  // console.log("CURRENT USER:", currentUser)

  // console.log(currentUser?.user_inboxes)
  // console.log(currentUser?.owner_inboxes)
  // console.log(fromOwnerDash)



// --------------------------------------------------------------------
    
    useEffect(() => {
      if (role === 'user' && currentUser?.user_inboxes) {
        setInboxes(currentUser?.user_inboxes)
        // console.log("CHECKING THREAD IDS:", currentUser?.user_inboxes)
        // setSelectedThreadID(1)
        // console.log("User Inboxes:", user_inboxes)
    }

      if (role === 'owner' && currentUser?.owner_inboxes) {
       setInboxes(currentUser?.owner_inboxes)
      //  console.log("CHECKING THREAD IDS:", currentUser?.owner_inboxes)
      //  setSelectedThreadID(1)
        // console.log("Owner Inboxes:", owner_inboxes)
    }
  }, [currentUser, fromOwnerDash])

//   useEffect(() => {
//     if (currentUser && user.user_inboxes) {
//       setInboxes(user.user_inboxes)
//       // console.log("User Inboxes:", user_inboxes)
//   }

//     if (owner && owner.owner_inboxes) {
//      setInboxes(owner.owner_inboxes)
//       // console.log("Owner Inboxes:", owner_inboxes)
//   }
// }, [owner, user])


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
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.error('Error fetching recipient data:', error)
        
      }
    }

    //This returns one to the owner dashboard if they came from there
    const navigateBackToOwnerDash = () => {
      setFromOwnerDash(!fromOwnerDash)
      navigate(`/dashboard`)
  }

  // const inboxSource = user || owner

  // Go through inboxes, set selected thread ID to the first one. Afterwards, find the first message in that thread. Compare the message.user_type to user and owner depending on the role that is currently signed in.
  // If it's a role of user signed in, test and see if it's a user. if It's a user_type of user, that means the first message
  useEffect(() => {
    if (inboxes && inboxes.length > 0) {
        const firstInbox = inboxes[0]
        setSelectedThreadID(firstInbox.id)

        const firstMessage = firstInbox?.thread?.messages[0]
        let recipientType
        let recipientID

        if (role === 'user') {
          // If a user is logged in
          if (firstMessage?.user_type === "user") {
              // If the first message was sent by a user
              recipientType = "owner"
              recipientID = firstMessage?.recipient_id
          } else {
              // If the first message was sent by an owner
              recipientType = "owner"
              recipientID = firstMessage?.sender_id
          }
          // else if (owner)
      } else if (role === 'owner') {
          // If an owner is logged in
          if (firstMessage?.user_type === "owner") {
              // If the first message was sent by an owner
              recipientType = "user"
              recipientID = firstMessage?.recipient_id
          } else {
              // If the first message was sent by a user
              recipientType = "user"
              recipientID = firstMessage?.sender_id
          }
      }

        fetchRecipientData(recipientID, recipientType)
    }
    setIsLoading(false)

}, [inboxes, role])


    // Delete a thread 
    const handleThreadDelete = async () => {
      console.log("INCOMING THREAD ID:", deletingThreadId)
      try {
        const response = await fetch(`${apiUrl}thread/${deletingThreadId}/${role}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Filter out the deleted item
          const updatedInboxes = inboxes.filter(item => item.id !== deletingThreadId)
          setInboxes(updatedInboxes)
          fetchAndUpdateInboxes()
          if(updatedInboxes.length > 0){
          const firstInbox = updatedInboxes[0]
          setSelectedThreadID(firstInbox.id)
          }
          // setInboxes

        } else {
          console.log("Error in deleting the thread")
          toast.error(`Error in deleting the thread`,
          {
            "autoClose" : 2000
          })
        }
      } catch (error) {
        console.error('Fetch Error:', error)
        toast.error(`Error in deleting the thread: ${error}`,
          {
            "autoClose" : 2000
          })
        // Handle fetch errors
      }
    }


    // Just a toggle for the delete
    const handleToggleDelete = (threadId) => {
      setToggleDelete(!toggleDelete)
      setDeletingThreadId(threadId)
    }

    // Update the inboxes with a server call, simiar to what I did with the cart items, I just update the inboxes to be the updated ones.
    const fetchAndUpdateInboxes = async () => {
      let fetchUrl = role === 'owner' ? `thread/owner/` : `thread/user/`
      const url = `${apiUrl}${fetchUrl}${currentUser.id}`
      console.log("Constructed URL for fetch:", url)
      // console.log("I RAN")
      try {
        const response = await fetch(url)
        if (response.ok) {
          const updatedInboxes = await response.json()
          console.log("THE UPDATED INBOXES:", updatedInboxes)
          if (role === 'owner'){
          setCurrentUser(prevUser => ({
            ...prevUser,
            owner_inboxes: updatedInboxes
          }))
          setInboxes(updatedInboxes)
        } else {
          setCurrentUser(prevUser => ({
            ...prevUser,
            user_inboxes: updatedInboxes
          }))
          setInboxes(updatedInboxes)
        }
        } else {
          const errorData = await response.json();
          console.error("An error occurred:", errorData.message)
        }
      } catch (error) {
        // Handle network/JS errors
        console.error("A network or JavaScript error occurred:", error.message);
        // Optionally, display a notification to the user
        toast.error(`Network/JavaScript Error: ${error.message}`,
        {
          "autoClose" : 2000
        })
      }
    }

    // console.log("THE THREAD ID TO DELETE:", deletingThreadId)


  // const handleThreadDeleteId = (threadId) => {
  //     setDeletingThreadId(threadId)
  // }

  const handleCancelDelete = () => {
    setDeletingThreadId(null)
    setToggleDelete(!toggleDelete)
  }

    

    return(
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col justify-between">
        {/* Left Sidebar */}
        {isLoading && <LoadingPage loadDetails={"Your Inbox"}/>}
        <div>
        <h2 className="text-2xl font-bold mb-4"> Welcome {currentUser?.firstName} </h2>
        <h3 className="text-l font-bold mb-4"> View your Inbox Below</h3>
        {/* ^^^ is just a place holder,  */}
        {inboxes.length === 0 && !isLoading && (
            <div className="text-center p-10 mt-5 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800">Your Inbox is Empty</h2>
              <p className="text-gray-600 mt-2">Looks like you don't have any threads yet.</p>
              <p className="text-gray-600">Feel free to explore and connect with others!</p>
            </div>
          )}
        
        <ul>
          {inboxes?.map((inbox) => (
            <div key={inbox.id} className="flex items-center border-b-2 border-black justify-between mb-2">
            <li
              className={`cursor-pointer ${
                selectedThreadID === inbox.id ? 'font-semibold' : ''
              }`}
              onClick={() => {
                // If anything breaks, I used to have this as just inbox.id, but the threads are separate from inboxes.
                handleThreadSelect(inbox.id)
                const firstMessage = inbox.thread.messages[0]
                
                let recipientType
                let recipientID
                // if (user)
                if (role === 'user') {
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
                    // else if (owner)
                } else if (role === 'owner') {
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
                
                // console.log("Recipient Type:", recipientType)
                // console.log("Recipient ID:", recipientID)
                fetchRecipientData(recipientID, recipientType)
                console.log("THE DARN INBOX THREAD ID:", inbox.thread_id)
                
            }}
            >
                {inbox?.thread?.subject}
            </li>
            <button
                    onClick={() => {
                      // console.log("THE THREAD ID:", inbox.thread_id)
                      handleToggleDelete(inbox.thread_id)}}
                    className="ml-4" // Add your styling here
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

            </button>

                {toggleDelete && inbox.thread_id && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-25 z-40 overflow-y-auto h-full w-full" onClick={() => setToggleDelete(false)}>
                  <div className="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Are you sure you want to delete this item?</h3>
                    <div className="mt-2 flex justify-center">
                      <button
                        onClick={() => {
                          // console.log("WHAT IS THIS THREAD ID:", inbox?.thread_id)
                          handleThreadDelete(inbox?.thread_id)}}
                        className="mr-2 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
                      >
                        Yes, Delete This Thread.
                      </button>
                      <button
                        onClick={() => {
                          // console.log("WHAT IS THIS THREAD ID WHEN CANCELLING:", inbox?.thread_id)
                          handleCancelDelete()}}
                        className="rounded bg-gray-500 py-2 px-4 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}


            </div>
          ))}
        </ul>
        </div>

        {fromOwnerDash === true && <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"  onClick={navigateBackToOwnerDash}>
               Return to Dashboard
              </button>
        </div>}
        
      </div>
    )
}

export default Inbox
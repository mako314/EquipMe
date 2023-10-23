import React from "react";

function Inboxes({}) {



    return(
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
      </div>
    )
}

export default Inboxes
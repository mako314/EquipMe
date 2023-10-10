import React, { useEffect, useState } from 'react';

function MessageThreads() {
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    // Fetch message threads from your API endpoint
    fetch('/messages/2')
      .then((response) => response.json())
      .then((data) => {
        setThreads(data);
        console.log(data);
        
        // Automatically select the first thread when threads are loaded
        if (data.length > 0) {
          setSelectedThreadId(data[0].id);
        }
      })
      .catch((error) => {
        console.error('Error fetching message threads:', error);
      });
  }, []);

  const handleThreadSelect = (threadId) => {
    setSelectedThreadId(threadId);
    console.log("clicked")
    console.log(threadId)
  };
  
  let test2 = 2

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Message Threads</h2>
        <ul>
          {threads.map((thread) => (
            <li
              key={thread.id}
              className={`cursor-pointer ${
                selectedThreadId === thread.id ? 'font-semibold' : ''
              }`}
              onClick={() => handleThreadSelect(thread.id)}
            >
              {thread.subject}
              {test2}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        {selectedThreadId !== null && (
          <div className="bg-white rounded-lg shadow-md p-4">
           <ul>
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <p className="text-lg font-semibold mb-2">{thread.subject}</p>
              <p className="text-gray-600">{thread.content}</p>
            </div>
          ))}
        </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageThreads;



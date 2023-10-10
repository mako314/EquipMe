import React, { useEffect, useState } from 'react';

function MessageThreads() {
  const [threads, setThreads] = useState([]);
  const [selectedContextId, setSelectedContextId] = useState(null);

  useEffect(() => {
    // Fetch message threads from API
    fetch('/messages/2')
      .then((response) => response.json())
      .then((data) => {
        setThreads(data);
        console.log(data);

        // Automatically select the context ID of the first thread when threads are loaded
        if (data.length > 0) {
          setSelectedContextId(data[0].context_id);
        }
      })
      .catch((error) => {
        console.error('Error fetching message threads:', error);
      });
  }, []);

  const handleContextSelect = (contextId) => {
    setSelectedContextId(contextId);
    console.log("Selected context ID:", contextId);
  };
  
  const filteredThreads = threads.length > 0
  ? threads.reduce((acc, thread) => {
      if (!acc[thread.context_id]) {
        acc[thread.context_id] = [];
      }
      acc[thread.context_id].push(thread);
      return acc;
    }, {})
  : {};

  
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Message Threads</h2>
        <ul>
          {filteredThreads && Object.entries(filteredThreads).map(([contextId, contextThreads]) => (
            <li
              key={contextId}
              className={`cursor-pointer ${
                selectedContextId === contextId ? 'font-semibold' : ''
              }`}
              onClick={() => handleContextSelect(contextId)}
            >
              {/* Display the subject of the first thread in the context */
              filteredThreads[contextId][0].subject}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        {selectedContextId !== null && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul>
              {filteredThreads[selectedContextId]?.map((thread) => (
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

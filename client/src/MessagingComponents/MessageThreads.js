import React, { useEffect, useState } from 'react';

function MessageThreads() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    // Fetch message threads from your API endpoint
    fetch('/messages/2')
      .then((response) => response.json())
      .then((data) => {
        setThreads(data)
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching message threads:', error)
      })
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <ul>
          {threads.map((thread) => (
            <> 
            <h2 className="text-2xl font-bold mb-4">{thread.subject}</h2>
            <div
              key={thread.id}
              className="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <p className="text-lg font-semibold mb-2"></p>
              <p className="text-gray-600">{thread.content}</p>
            </div>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MessageThreads;


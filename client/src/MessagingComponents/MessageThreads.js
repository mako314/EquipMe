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
    <div>
      <h2>Message Threads</h2>
      <ul>
        {threads.map((thread) => (
        <div> 
          <li key={thread.id}><strong>{thread.subject}</strong></li>
          <br></br>
          <li> {thread.content} </li>
        </div>
        ))}
      </ul>
    </div>
  )
}

export default MessageThreads;


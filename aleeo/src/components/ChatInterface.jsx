import React from 'react'

function ChatInterface(props) {
    const { userData } = props;
    
  return (
    <div>
        <h2>Chat Interface</h2>
    {console.log("User Data in Chat Interface: ", JSON.stringify(userData, 1, 1))}
    </div>
    
  )
}

export default ChatInterface
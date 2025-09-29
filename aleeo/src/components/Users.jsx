import React from 'react'

function users(props) {
  return <div>
    <h1>Users from the API</h1>
    {props.users.map((user) => {
      return (
        <div key={user.id}>
          <h2>{user.username}</h2>
          <p>{user.first_name} {user.last_name}</p>

        </div>

      )


    })}
  </div>
  
}

export default users
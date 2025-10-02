import { Button, Field, Input, Stack } from '@chakra-ui/react';
import React, { useState } from 'react'

function UserLogin(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // placeholder to handle sign in
  const handleSignin = (error) => {
    error.preventDefault();
    console.log("Sign-in username: ", username);
    console.log("Sign-in password: ", password);
  };

  // form for signing in
  const signinForm = () => 
      <Stack gap="8" maxW="sm" css={{ "--field-label-width": "96px" }}>
        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Username
            <Field.RequiredIndicator />
          </Field.Label>
          <Input 
            value={username}
            placeholder='Username' 
            flex="1"
            onChange={(e) => setUsername(e.target.value)}  
            />
        </Field.Root>

        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Password
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={password}
            placeholder='Password' 
            flex="1"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field.Root>

        <Button colorPalette={"blue"} variant="surface" onClick={handleSignin}>
          Sign in
        </Button>
      </Stack>

  return (
    <div>
        <h1>Marshall Flinkman</h1>
        {signinForm()}
    </div>
  )
  
}

export default UserLogin;
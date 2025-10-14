import { Button, Center, Field, Input, Link, Stack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { userLogin } from '../utility/apiUtils';
import ChatInterface from './ChatInterface';
import logo  from '../assets/aleeo_logo.png';

function UserLogin(props) {

  const [newUser, setNewUser] = useState(false);
  const [userSignIn, setUserSignIn] = useState({
    username: '',
    password: '',
    remember_me: false
  })
  const [newUserInfo, setNewUserInfo] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: ''
  });

  const [userData, setUserData] = useState(null);


  const handleSignin = async (error) => {
    error.preventDefault();
    const data = await userLogin(userSignIn);
    setUserData(data);
  };

  const handleCreateUser = (error) => {
    error.preventDefault();
  };

  const loginOptions = () => {
    return newUser ? newUserForm() : signinForm();
  }

  // form for signing in
  const signinForm = () => 
  <>
    <Center css={{"padding-top" : "2rem" }}>
      <Stack gap="8" maxW="sm" justifyContent={'center'} css={{ "--field-label-width": "96px" }}>
        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Username
            <Field.RequiredIndicator />
          </Field.Label>
          <Input 
            value={userSignIn?.username}
            placeholder='Username' 
            flex="1"
            onChange={(e) => setUserSignIn({...userSignIn, username: e.target.value})} 
            />
        </Field.Root>

        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Password
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={userSignIn?.password}
            placeholder='Password' 
            flex="1"
            onChange={(e) => setUserSignIn({...userSignIn, password: e.target.value})} 
          />
        </Field.Root>

        <Button colorPalette={"blue"} variant="surface" onClick={handleSignin}>
          Sign in
        </Button>
        <Link
          variant="underline" onClick={(e) => setNewUser(!e.target.value)}
        >
          Create Account
        </Link>
      </Stack>
    </Center>
  </>

  // form for new users
  const newUserForm = () => 
  <>
    <Center css={{"padding-top" : "2rem" }}>
      <Stack gap="8" maxW="sm" css={{ "--field-label-width": "96px" }}>
        <h1>Create Account</h1>
        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            First Name
            <Field.RequiredIndicator />
          </Field.Label>
          <Input 
            value={newUserInfo?.first_name}
            placeholder='First name' 
            flex="1"
            onChange={(e) => setNewUserInfo({...newUserInfo, first_name: e.target.value})}  
            />
        </Field.Root>

        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Last Name
            <Field.RequiredIndicator />
          </Field.Label>
          <Input 
            value={newUserInfo?.last_name}
            placeholder='Last Name' 
            flex="1"
            onChange={(e) => setNewUserInfo({...newUserInfo, last_name: e.target.value})}   
            />
        </Field.Root>

        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Email
            <Field.RequiredIndicator />
          </Field.Label>
          <Input 
            value={newUserInfo?.username}
            placeholder='Email' 
            flex="1"
            onChange={(e) => setNewUserInfo({...newUserInfo, username: e.target.value})}   
            />
        </Field.Root>

        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Password
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={newUserInfo?.password}
            placeholder='Password' 
            flex="1"
            onChange={(e) => setNewUserInfo({...newUserInfo, password: e.target.value})}  
          />
        </Field.Root>

        <Field.Root orientation={"horizontal"} required>
          <Field.Label>
            Confirm Password
            <Field.RequiredIndicator />
          </Field.Label>
          <Input 
            value={newUserInfo?.confirm_password}
            placeholder='Password' 
            flex="1"
            onChange={(e) => setNewUserInfo({...newUserInfo, confirm_password: e.target.value})}  
            />
        </Field.Root>
          <Button colorPalette={"blue"} variant="surface" onClick={handleCreateUser}>
            Create Account
          </Button>
      </Stack>
    </Center>
  </>

  return (
    <div>
    <Center>
      <img src={logo} alt="Aleeo Logo" width="100" height="100"/>
    </Center>
        
        {/* placeholder for user sign-in. Routing handled after POC finished */}
        {userData ? <ChatInterface userData={userData} /> : loginOptions()}
        
    </div>
  )
  
}

export default UserLogin;
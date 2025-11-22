import { Button, Center, Field, Input, Link, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAuth } from '../store/hooks';
import { loginUser } from '../store/thunks/authThunks';
import { clearError } from '../store/slices/authSlice';
import ChatInterface from './ChatInterface';
import logo  from '../assets/aleeo_logo.png';

function UserLogin(props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, error } = useAuth();

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

  // Clear any errors when component unmounts or user switches forms
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleSignin = async (event) => {
    event.preventDefault();
    dispatch(loginUser(userSignIn));
  };

  const handleCreateUser = (event) => {
    event.preventDefault();
    // TODO: Implement user registration
    console.log('User registration not implemented yet');
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

        <Button colorPalette={"blue"} variant="surface" onClick={handleSignin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        {error && (
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
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
    <div style={{ width: '100vw', height: '100vh', overflow: isAuthenticated ? 'hidden' : 'auto' }}>
      {!isAuthenticated && (
        <Center>
          <img src={logo} alt="Aleeo Logo" width="100" height="100"/>
        </Center>
      )}
        
        {/* placeholder for user sign-in. Routing handled after POC finished */}
        {isAuthenticated ? <ChatInterface userData={user} /> : loginOptions()}
        
    </div>
  )
  
}

export default UserLogin;
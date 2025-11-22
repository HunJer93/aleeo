import { Button, Center, Field, Input, Link, Stack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { createNewUser, userLogin } from '../utility/apiUtils';
import { useAuth } from '../contexts/AuthContext';
import ChatInterface from './ChatInterface';
import logo  from '../assets/aleeo_logo.png';

function UserLogin(props) {

  const { userData, login, logout, loading, isAuthenticated } = useAuth();
  
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
  const [errors, setErrors] = useState({});


  const handleSignin = async (error) => {
    error.preventDefault();
    const data = await userLogin(userSignIn);
    if (data) {
      login(data); // Use the auth context login function
    }
  };

  const handleCreateUser = async (error) => {
    error.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return; // Stop execution if validation fails
    }
    
    try {
      const data = await createNewUser(newUserInfo);
      if (data) {
        login(data);
        setNewUser(false);
        // Clear form and errors on success
        setNewUserInfo({
          first_name: '',
          last_name: '',
          username: '',
          password: '',
          confirm_password: ''
        });
        setErrors({});
      }
    } catch (error) {
      alert("User creation failed!");
      console.error('User creation failed:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newUserInfo.first_name.trim()) newErrors.first_name = "First name is required";
    if (!newUserInfo.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!newUserInfo.username.trim()) newErrors.username = "Email is required";
    if (!newUserInfo.password) newErrors.password = "Password is required";
    if (newUserInfo.password.length < 8) newErrors.password = "Password must be at least 8 characters long";
    if (newUserInfo.password !== newUserInfo.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            type="password"  // Add this for password security
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
          variant="underline" onClick={() => setNewUser(true)}
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
        <Field.Root orientation={"horizontal"} required invalid={!!errors.first_name}>
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
          {errors.first_name && <Field.ErrorText>{errors.first_name}</Field.ErrorText>}
        </Field.Root>

        <Field.Root orientation={"horizontal"} required invalid={!!errors.last_name}>
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
          {errors.last_name && <Field.ErrorText>{errors.last_name}</Field.ErrorText>}
        </Field.Root>

        <Field.Root orientation={"horizontal"} required invalid={!!errors.username}>
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
          {errors.username && <Field.ErrorText>{errors.username}</Field.ErrorText>}
        </Field.Root>

        <Field.Root orientation={"horizontal"} required invalid={!!errors.password}>
          <Field.Label>
            Password
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            type="password"
            value={newUserInfo?.password}
            placeholder='Password' 
            flex="1"
            onChange={(e) => setNewUserInfo({...newUserInfo, password: e.target.value})}  
          />
          {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
        </Field.Root>

        <Field.Root orientation={"horizontal"} required invalid={!!errors.confirm_password}>
          <Field.Label>
            Confirm Password
            <Field.RequiredIndicator />
          </Field.Label>
          <Input 
            type="password"
            value={newUserInfo?.confirm_password}
            placeholder='Password' 
            flex="1"
            onChange={(e) => setNewUserInfo({...newUserInfo, confirm_password: e.target.value})}  
          />
          {errors.confirm_password && <Field.ErrorText>{errors.confirm_password}</Field.ErrorText>}
        </Field.Root>
          <Button colorPalette={"blue"} variant="surface" onClick={handleCreateUser}>
            Create Account
          </Button>
        <Link
          variant="underline" onClick={() => setNewUser(false)}
        >
          Back to Sign In
        </Link>
      </Stack>
    </Center>
  </>

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: userData ? 'hidden' : 'auto' }}>
      {loading && (
        <Center style={{ height: '100vh' }}>
          <div>Loading...</div>
        </Center>
      )}
      
      {!loading && (
        <>
          {isAuthenticated ? (
            <ChatInterface 
              userData={userData} 
              onLogout={logout}
            />
          ) : (
            loginOptions()
          )}

          {!isAuthenticated && (
            <Center>
              <img src={logo} alt="Aleeo Logo" width="100" height="100"/>
            </Center>
          )}
        </>
      )}
    </div>
  )
  
}

export default UserLogin;
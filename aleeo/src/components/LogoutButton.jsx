import React from 'react';
import { Button } from '@chakra-ui/react';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

function LogoutButton({ children, ...props }) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Button onClick={handleLogout} variant="outline" colorPalette="red" {...props}>
      {children || 'Logout'}
    </Button>
  );
}

export default LogoutButton;
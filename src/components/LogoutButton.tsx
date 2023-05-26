'use client';
import useAuth from '@/hooks/useAuth';
import { Button } from 'flowbite-react';

const LogoutButton = () => {
  const { signOut } = useAuth();
  return <Button onClick={signOut}>Sign Out</Button>;
};

export default LogoutButton;

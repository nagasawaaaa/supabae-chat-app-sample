'use client';
import useAuth from '@/hooks/useAuth';
import { Button } from 'flowbite-react';

const SignInGithub = () => {
  const { signInWithGithub, error } = useAuth();

  return (
    <div>
      <Button onClick={signInWithGithub}>Sign In with Github</Button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignInGithub;

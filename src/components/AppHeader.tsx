'use client';
import useAuth from '@/hooks/useAuth';
import LogoutButton from '@/components/LogoutButton';

const AppHeader = () => {
  const { session: isLogin } = useAuth();
  return (
    <header className="flex border-b mb-5 p-5 justify-between">
      <h1 className="text-3xl font-bold">Chat App Example</h1>
      {isLogin && <LogoutButton />}
    </header>
  );
};

export default AppHeader;

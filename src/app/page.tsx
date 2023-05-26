'use client';
import useAuth from '@/hooks/useAuth';
import SignInGithub from '@/components/SignInGithub';
import ChatApp from '@/components/ChatApp';

export default function Home() {
  const { session: isLogin } = useAuth();
  console.log({ isLogin });
  return (
    <>
      {isLogin ? (
        <div>
          <h2 className="text-2xl mb-3 bold">オープンチャット</h2>
          <ChatApp />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl mb-3 bold">GitHubでサインイン</h2>
          <SignInGithub />
        </div>
      )}
    </>
  );
}

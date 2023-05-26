import supabase from '@/lib/supabase';
import { Session } from '@supabase/gotrue-js';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const { data: authData } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => authData.subscription.unsubscribe();
  }, []);

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
      if (error) {
        setError(error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        console.error('GitHub認証に失敗しました。');
      }
    }
  };

  const profileFromGithub: {
    nickName: string;
    avatarUrl: string;
  } = {
    nickName: session?.user?.user_metadata.user_name || '',
    avatarUrl: session?.user?.user_metadata.avatar_url || '',
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    error,
    signInWithGithub,
    profileFromGithub,
    signOut,
  };
};

export default useAuth;

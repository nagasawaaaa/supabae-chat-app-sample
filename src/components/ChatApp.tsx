import supabase, { Database } from '@/lib/supabase';
import {
  TABLE_NAME,
  addSupabaseData,
  fetchDatabase,
} from '@/lib/supabaseFunctions';
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { Avatar, Button, Label, TextInput } from 'flowbite-react';
import { dateToString } from '@/utils/dateToString';

const ChatApp = () => {
  const [inputText, setInputText] = useState('');
  const [messageText, setMessageText] = useState<Database[]>([]);
  const { session: isLogin, profileFromGithub } = useAuth();

  const fetchRealtimeData = () => {
    try {
      supabase
        .channel('table_postgres_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: TABLE_NAME,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const { createdAt, id, message, avatarUrl, nickName } =
                payload.new;
              setMessageText((messageText) => [
                ...messageText,
                { createdAt, id, message, avatarUrl, nickName },
              ]);
            }
          }
        )
        .subscribe();
      return () => supabase.channel('table_postgres_changes').unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      const allMessage = await fetchDatabase();
      setMessageText(allMessage as Database[]);
    })();
    fetchRealtimeData();
  }, []);

  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputText(event.target.value);

  const onSubmitNewMessage = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (inputText === '') return;
    await addSupabaseData({ message: inputText, ...profileFromGithub });
    setInputText('');
  };

  return (
    <div>
      <div className="flex flex-col items-start items-stretch">
        {messageText.map((item) => (
          <div
            key={item.id}
            data-my-chat={item.nickName === profileFromGithub.nickName}
            className="flex border-t pt-2 mt-2"
          >
            <Avatar
              img={item.avatarUrl}
              rounded={true}
              statusPosition="center-left"
            >
              <div className="space-y-1 font-medium dark:text-white">
                <div>
                  Date:{' '}
                  <time>
                    {dateToString(item.createdAt, 'YYYY/MM/DD HH:mm')}
                  </time>
                </div>
                <div>Name: {item.nickName ? item.nickName : '名無しさん'}</div>
                <div className="text-sm">
                  <small>Message: </small>
                  <br />
                  {item.message}
                </div>
              </div>
            </Avatar>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmitNewMessage} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="message" value="メッセージを入力してください" />
          </div>
          <TextInput
            id="message"
            type="text"
            value={inputText}
            onChange={onChangeInputText}
            placeholder="メッセージを入力してください"
          />
        </div>
        <Button type="submit">送信</Button>
      </form>
    </div>
  );
};

export default ChatApp;

import supabase, { Database } from '@/lib/supabase';

export const TABLE_NAME = 'chat-app-sample';

export const fetchDatabase = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('createdAt');
    return data;
  } catch (error) {
    console.error(error);
  }
};

type InsertProps = Pick<Database, 'message' | 'nickName' | 'avatarUrl'>;

export const addSupabaseData = async ({
  message,
  avatarUrl,
  nickName,
}: InsertProps) => {
  try {
    await supabase.from(TABLE_NAME).insert({ message, avatarUrl, nickName });
  } catch (error) {
    console.error(error);
  }
};

// TODO: updateとdeleteの実装

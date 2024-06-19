import { db } from '@/db/drizzle';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import { Adapter, AdapterUser } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';
import { users } from './db/schema';
import { generateRandomString } from './lib/generate-random-string';

const drizzleAdapterWrapper = (): Adapter => {
  const adapter = DrizzleAdapter(db);
  adapter.createUser = async ({ image, ...rest }): Promise<AdapterUser> => {
    const createdDBUser = await db
      .insert(users)
      .values({
        ...rest,
        image: `https://avatar.vercel.sh/${generateRandomString(6)}`,
        nickname: generateRandomString(12),
        handle: generateRandomString(10),
      })
      .returning()
      .then((res) => res[0]);

    return createdDBUser;
  };

  return {
    ...adapter,
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  adapter: drizzleAdapterWrapper(),
  providers: [Google],
});

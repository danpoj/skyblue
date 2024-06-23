'use server';

import { db } from '@/db/drizzle';
import { and, count, desc, eq } from 'drizzle-orm';
import { posts, followers as followersTable } from '@/db/schema';

export const getProfile = async (nickname: string, sessionId: string) => {
  const user = await db.query.users.findFirst({
    where: (userTable, { eq }) => eq(userTable.nickname, nickname),
    columns: {
      emailVerified: false,
      name: false,
      email: false,
    },
    with: {
      posts: {
        with: {
          images: true,
        },
        orderBy: desc(posts.createdAt),
      },
    },
  });

  const followersPromise = db
    .select({ count: count() })
    .from(followersTable)
    .where(eq(followersTable.toId, user?.id!))
    .then((res) => res[0]);

  const followingsPromise = db
    .select({ count: count() })
    .from(followersTable)
    .where(eq(followersTable.fromId, user?.id!))
    .then((res) => res[0]);

  const isFollowingPromise = db
    .select()
    .from(followersTable)
    .where(
      and(
        eq(followersTable.fromId, sessionId),
        eq(followersTable.toId, user?.id!)
      )
    )
    .then((res) => res[0]);

  const [followers, followings, isFollowingResult] = await Promise.all([
    followersPromise,
    followingsPromise,
    isFollowingPromise,
  ]);

  return {
    user,
    followers,
    followings,
    isFollowingResult,
  };
};

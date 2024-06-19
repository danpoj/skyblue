'use server';

import { auth } from '@/auth';
import { db } from '@/db/drizzle';
import { followers, users } from '@/db/schema';
import { InferSelectModel, and, eq, not } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const getUserMe = async () => {
  const session = await auth();

  if (!session) return { error: 'unauthorized' };

  const dbUser = db.query.users.findFirst({
    where: eq(users.id, session.user?.id!),
  });

  return { user: dbUser };
};

const editUserSchema = createSelectSchema(users, {
  image: z.string().optional(),
}).pick({
  image: true,
  nickname: true,
  description: true,
});

export const editUser = async (
  props: z.infer<typeof editUserSchema>
): Promise<
  | {
      message: 'error';
      error: string;
    }
  | {
      message: 'success';
      data: InferSelectModel<typeof users>;
    }
> => {
  const parsed = editUserSchema.safeParse(props);

  if (!parsed.success) {
    return { message: 'error', error: 'validation error' };
  }

  const { description, nickname, image } = parsed.data;

  const session = await auth();

  if (!session) return { message: 'error', error: 'unauthorized' };

  try {
    const dbUserWithSameNickname = await db.query.users.findFirst({
      where: and(
        not(eq(users.id, session.user?.id!)),
        eq(users.nickname, nickname)
      ),
    });

    if (dbUserWithSameNickname) {
      return { message: 'error', error: 'duplicated nickname' };
    }

    const updatedUser = await db
      .update(users)
      .set({
        description,
        nickname,
        ...(image && { image }),
      })
      .where(eq(users.id, session.user?.id!))
      .returning();

    return { message: 'success', data: updatedUser[0] };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { message: 'error', error: error.message };
    }
    return { message: 'error', error: 'server error' };
  }
};

export const followUser = async (id: string, isFollowing: boolean) => {
  const session = await auth();

  if (!session) return { message: 'error', error: 'unauthorized' };

  if (isFollowing) {
    await db
      .delete(followers)
      .where(
        and(eq(followers.fromId, session.user?.id!), eq(followers.toId, id))
      );
  } else {
    await db.insert(followers).values({
      fromId: session.user?.id!,
      toId: id,
    });
  }
};

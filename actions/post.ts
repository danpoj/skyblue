'use server';

import { auth } from '@/auth';
import { db } from '@/db/drizzle';
import {
  posts as postsTable,
  postImages as postImagesTable,
} from '@/db/schema';
import { z } from 'zod';

const addPostValidator = z.object({
  text: z.string().min(1),
  images: z.string().url().array().optional(),
});

export const addPost = async ({
  text,
  images,
}: {
  text: string;
  images?: string[];
}) => {
  const parsedData = addPostValidator.safeParse({
    text,
    images,
  });

  if (!parsedData.success) {
    return { success: false, message: '404 데이터 형식이 맞지않습니다' };
  }

  const session = await auth();

  if (!session) return { success: false, message: 'unauthorized' };

  try {
    const createdPost = await db
      .insert(postsTable)
      .values({
        authorId: session.user?.id!,
        text: parsedData.data.text,
      })
      .returning({ id: postsTable.id })
      .then((res) => res[0]);

    if (images) {
      await db.insert(postImagesTable).values(
        images.map((image) => ({
          postId: createdPost.id,
          src: image,
        }))
      );
    }

    return { success: true, message: '포스트를 성공적으로 업로드했습니다' };
  } catch (error) {
    return { success: false, message: '서버 에러' };
  }
};

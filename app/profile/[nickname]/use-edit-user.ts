'use client';

import { editUser } from '@/actions/user';
import { generateImageURL } from '@/lib/generate-image-url';
import { generateRandomString } from '@/lib/generate-random-string';
import { getSignedUrlForS3Object } from '@/lib/s3';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Form } from './edit-profile-dialog';
import { useRouter } from 'next/navigation';
import { InferSelectModel } from 'drizzle-orm';
import { users } from '@/db/schema';

export const useEditUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    {
      message: 'success';
      data: InferSelectModel<typeof users>;
    },
    Error,
    Form
  >({
    mutationFn: async (values) => {
      let key: string | undefined;

      if (values.image) {
        key = `${generateRandomString(6)}-${values.image.name}`;

        const uploadURL = await getSignedUrlForS3Object(key, values.image.type);

        toast('업로드 중... 🚧', { description: '잠시만 기다려주세요' });

        await fetch(uploadURL, {
          method: 'PUT',
          body: values.image,
          headers: { 'Content-Type': values.image.type },
        });
      }

      const data = await editUser({
        description: values.description,
        nickname: values.nickname,
        image: values.image ? generateImageURL(key!) : undefined,
      });

      if (data.message === 'error') throw new Error(data.error);

      return data;
    },
    onSuccess: (data) => {
      toast('Success 🎉', { description: '유저 정보가 업데이트 되었습니다' });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push(`/profile/${data.data.nickname}`);
    },
    onError: (error) => {
      toast('Failed 🥹', {
        description: error.message,
      });
    },
  });

  return mutation;
};

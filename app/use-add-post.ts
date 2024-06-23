'use client';

import { addPost } from '@/actions/post';
import { generateImageURL } from '@/lib/generate-image-url';
import { generateRandomString } from '@/lib/generate-random-string';
import { getSignedUrlForS3Object } from '@/lib/s3';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAddPost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    undefined,
    Error,
    {
      images: {
        file: File;
        base64: string;
      }[];
      text: string;
    }
  >({
    mutationFn: async ({ images, text }) => {
      const keys: string[] = [];

      if (images.length > 0) {
        const presignedURLPromises = images.map((image) => {
          const key = `${generateRandomString(6)}-${image.file.name}`;
          keys.push(key);

          return getSignedUrlForS3Object(key, image.file.type);
        });

        toast('presigned URL 생성 중...');

        const presignedURLs = await Promise.all(presignedURLPromises);

        const uploadImagesPromises = presignedURLs.map((url, index) =>
          fetch(url, {
            method: 'PUT',
            body: images[index].file,
            headers: { 'Content-Type': images[index].file.type },
          })
        );

        toast('R2에 이미지 업로드 중...');

        await Promise.all(uploadImagesPromises);
      }

      toast('DB에 포스트 업로드 중...');

      const data = await addPost({
        text: text,
        images:
          keys.length > 0
            ? keys.map((key) => generateImageURL(key))
            : undefined,
      });

      if (!data.success) throw new Error('포스트 업로드에 실패했습니다.');
    },

    onSuccess: () => {
      toast('Success 🎉', {
        description: '포스트를 성공적으로 업로드했습니다.',
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      toast('Failed 🥹', {
        description: error.message,
      });
    },
  });

  return mutation;
};

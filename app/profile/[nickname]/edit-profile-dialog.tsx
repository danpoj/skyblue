'use client';

import { editUser } from '@/actions/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { followers, users } from '@/db/schema';
import { generateImageURL } from '@/lib/generate-image-url';
import { generateRandomString } from '@/lib/generate-random-string';
import { getSignedUrlForS3Object } from '@/lib/s3';
import { zodResolver } from '@hookform/resolvers/zod';
import { InferSelectModel } from 'drizzle-orm';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size < 4_000_000, {
      message: 'must be less than 4MB.',
    })
    .optional(),
  nickname: z.string().min(1),
  description: z.string(),
});

type Form = z.infer<typeof formSchema>;

type User = Omit<
  InferSelectModel<typeof users>,
  'emailVerified' | 'name' | 'email'
>;

export const EditProfileDialog = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: user.nickname,
      description: user.description,
    },
  });

  const onSubmit = async (values: Form) => {
    setOpen(false);

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

    if (data.message === 'error') {
      toast('Failed 🥹', {
        description: data.error,
      });

      return;
    }

    toast('Success 🎉', { description: '유저 정보가 업데이트 되었습니다' });
    router.refresh();
    router.replace(`/profile/${data.data.nickname}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='rounded-3xl' size='sm'>
          프로필 편집
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[540px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl text-center'>
            내 프로필 편집
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id='form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <FormField
              control={form.control}
              name='image'
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem className='flex justify-center'>
                  <FormControl>
                    <div className='relative w-32 h-32'>
                      <div className='size-7 flex items-center justify-center rounded-full bg-slate-800 absolute right-1 bottom-1 z-10 pointer-events-none'>
                        <Camera className='size-4 stroke-white' />
                      </div>
                      <Avatar className='w-full h-full'>
                        <AvatarImage
                          src={
                            form.getValues('image')
                              ? URL.createObjectURL(form.getValues('image')!)
                              : user.image
                          }
                          className='object-cover'
                        />
                        <AvatarFallback>{user.nickname}</AvatarFallback>
                      </Avatar>
                      <div className='group absolute inset-0 rounded-full opacity-0 hover:opacity-5 hover:bg-black'>
                        <Input
                          className='absolute inset-0 w-full h-full rounded-full z-10 opacity-0 cursor-pointer'
                          type='file'
                          {...rest}
                          accept='image/*'
                          onChange={(event) => {
                            if (!event.target.files?.[0]) return;
                            onChange(event.target.files?.[0]);
                          }}
                        />
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nickname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base font-semibold'>
                    표시 이름
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base font-semibold'>
                    설명
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className='resize-none min-h-[120px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='flex-col sm:flex-col sm:space-x-0 gap-2'>
          <Button
            type='submit'
            form='form'
            variant='fancyBluish'
            className='rounded-3xl'
          >
            변경 사항 저장
          </Button>
          <Button
            onClick={() => setOpen(false)}
            type='button'
            variant='ghost'
            className='rounded-3xl'
          >
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

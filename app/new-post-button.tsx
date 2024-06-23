'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { users } from '@/db/schema';
import { cn } from '@/lib/utils';
import { InferSelectModel } from 'drizzle-orm';
import { ImageIcon, SquarePen, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAddPost } from './use-add-post';
import { toast } from 'sonner';

export const NewPostButton = ({
  user,
}: {
  user: InferSelectModel<typeof users>;
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [images, setImages] = useState<
    {
      file: File;
      base64: string;
    }[]
  >([]);

  const addPostMutation = useAddPost();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='bluish' className='rounded-3xl w-full sm:w-fit'>
          <SquarePen className='sm:mr-1 size-5' />
          <span className='hidden sm:block'>새 게시물</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='p-0 max-w-[600px] top-[10%] translate-y-[-10%]'>
        <AlertDialogHeader className='flex-row space-y-0 justify-between p-4 pb-0'>
          <Button
            asChild
            className='text-blue-500 text-lg border-none hover:text-blue-600'
            variant='ghost'
          >
            <AlertDialogCancel>취소</AlertDialogCancel>
          </Button>
          <Button
            variant='fancyBluish'
            className='rounded-3xl px-6'
            size='sm'
            onClick={async () => {
              if (text.trim().length === 0) {
                toast('텍스트를 입력해주세요');
                return;
              }

              setOpen(false);

              addPostMutation.mutate(
                { images, text },
                {
                  onSuccess: () => {
                    setText('');
                    setImages([]);
                  },
                }
              );
            }}
          >
            게시하기
          </Button>
        </AlertDialogHeader>
        <div>
          <div className='flex gap-2 px-4'>
            <Avatar className='h-14 w-14'>
              <AvatarImage src={user.image!} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
            <Textarea
              value={text}
              required
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              className='min-h-[180px] text-lg'
              placeholder='무슨 일이 일어나고 있나요?'
            />
          </div>
          <div
            className={cn(
              'grid gap-2 px-4',
              images.length === 1 || images.length === 2
                ? 'grid-cols-2'
                : images.length === 3
                ? 'grid-cols-3'
                : images.length === 4
                ? 'grid-cols-4'
                : ''
            )}
          >
            {images.map((image, index) => (
              <div key={image.file.name} className='relative'>
                <Image
                  unoptimized
                  alt={image.file.name}
                  src={image.base64}
                  width={400}
                  height={400}
                  className='aspect-square overflow-hidden object-cover rounded-xl shadow'
                />

                <button
                  onClick={() => {
                    setImages((prev) => [
                      ...prev.slice(0, index),
                      ...prev.slice(index + 1),
                    ]);
                  }}
                  className='absolute right-1.5 top-1.5 size-7 bg-black/80 flex items-center justify-center rounded-full hover:bg-black/60'
                >
                  <X className='size-4 stroke-white stroke-[3px]' />
                </button>
              </div>
            ))}
          </div>
        </div>
        <AlertDialogFooter className='border-t px-4 py-2 sm:justify-start'>
          <div className='relative w-10 h-10 border flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100'>
            <ImageIcon className='stroke-blue-500 group-hover:stroke-blue-600' />
            <input
              onChange={(event) => {
                if (!event.target.files?.[0]) return;
                if (images.length === 4) return;

                const files = Object.values(event.target.files).slice(
                  0,
                  4 - images.length
                );

                setImages((prev) => [
                  ...prev,
                  ...files.map((file) => ({
                    file,
                    base64: URL.createObjectURL(file),
                  })),
                ]);
              }}
              multiple
              accept='image/*'
              type='file'
              id='fileInput'
              className='absolute inset-0 opacity-0'
            />
            <label
              htmlFor='fileInput'
              className='absolute inset-0 cursor-pointer rounded-full'
            />
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

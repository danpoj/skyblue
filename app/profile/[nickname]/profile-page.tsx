'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Ellipsis } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { EditProfileDialog } from './edit-profile-dialog';
import { FollowButton } from './follow-button';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from './actions';
import { notFound } from 'next/navigation';
import ProfileSkeleton from './profile-skeleton';

export function ProfilePage({
  nickname,
  session,
}: {
  nickname: string;
  session: Session;
}) {
  const decodedNickname = decodeURIComponent(nickname);

  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return getProfile(decodedNickname, session.user?.id!);
    },
  });

  if (isPending) return <ProfileSkeleton />;
  if (isError) throw new Error('error on profile');
  const { followers, followings, isFollowingResult, user } = data;
  if (!user) return <ProfileSkeleton />;
  console.log(user);

  const isFollowing = !!isFollowingResult;

  return (
    <div>
      <div className='px-4 items-center bg-[#0070FF] flex gap-2 h-[9rem]'></div>

      <>
        <div className='flex justify-end items-center p-4 pb-2 relative'>
          <Avatar className='h-24 w-24 absolute left-4 -top-10 outline outline-white'>
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.nickname}</AvatarFallback>
          </Avatar>

          <div className='flex items-center gap-2'>
            {user.id === session?.user?.id && (
              <EditProfileDialog user={user!} />
            )}
            <Button variant='secondary' size='icon' className='rounded-full'>
              <Ellipsis />
            </Button>
          </div>
        </div>

        <div className='px-4 space-y-1'>
          <div className='flex gap-2 items-center'>
            <p className='text-3xl font-semibold'>{user.nickname}</p>
            {user.id !== session?.user?.id && (
              <FollowButton id={user.id} isFollowing={isFollowing} />
            )}
          </div>
          <p className='text-muted-foreground'>@{user.handle}</p>
        </div>

        <div className='px-4 py-2 flex gap-2 text-lg'>
          <Link
            href={`/profile/${decodedNickname}/followers`}
            className='space-x-1 hover:underline'
          >
            <span className='font-[500]'>{followers.count}</span>
            <span className='text-muted-foreground'>팔로워</span>
          </Link>
          <Link
            href={`/profile/${decodedNickname}/followings`}
            className='space-x-1 hover:underline'
          >
            <span className='font-[500]'>{followings.count}</span>
            <span className='text-muted-foreground'>팔로우 중</span>
          </Link>
          <p className='space-x-1'>
            <span className='font-[500]'>{0}</span>
            <span className='text-muted-foreground'>게시글 수</span>
          </p>
        </div>

        <p className='px-4 text-slate-800'>{user.description}</p>

        <div className=''>
          {user.posts.map((post) => (
            <div key={post.id} className='p-4 border-b'>
              <div className='flex items-start gap-3'>
                <Avatar className='size-14'>
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.nickname}</AvatarFallback>
                </Avatar>

                <div className='space-y-1'>
                  <div className='flex items-end gap-1'>
                    <p className='font-semibold text-lg'>{user.nickname}</p>
                    <p className='text-muted-foreground'>{user.handle}</p>
                  </div>
                  <p>{post.text}</p>

                  <div
                    className={cn(
                      'grid gap-2',
                      post.images.length === 1 || post.images.length === 2
                        ? 'grid-cols-2'
                        : post.images.length === 3
                        ? 'grid-cols-3'
                        : post.images.length === 4
                        ? 'grid-cols-2'
                        : ''
                    )}
                  >
                    {post.images.map((image, index) => (
                      <div key={image.id}>
                        <Image
                          alt={'post image'}
                          src={image.src}
                          width={400}
                          height={400}
                          className='aspect-square overflow-hidden object-cover rounded-xl shadow'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className='pt-8 text-center text-muted-foreground pb-10'>피드 끝</p>
      </>
    </div>
  );
}

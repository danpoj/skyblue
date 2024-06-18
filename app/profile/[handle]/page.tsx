import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { db } from '@/db/drizzle';
import { and, count, eq } from 'drizzle-orm';
import { Ellipsis } from 'lucide-react';
import { EditProfileDialog } from './edit-profile-dialog';
import { followers as followersTable } from '@/db/schema';
import { auth } from '@/auth';
import { followUser } from '@/actions/user';
import { FollowButton } from './follow-button';

export default async function Page({
  params: { handle },
}: {
  params: { handle: string };
}) {
  const user = await db.query.users.findFirst({
    where: (userTable, { eq }) =>
      eq(userTable.handle, decodeURIComponent(handle)),
    columns: {
      emailVerified: false,
      name: false,
      email: false,
    },
  });

  const session = await auth();

  const followersPromise = db
    .select({ count: count() })
    .from(followersTable)
    .where(eq(followersTable.followsUserId, user?.id!))
    .then((res) => res[0]);

  const followingsPromise = db
    .select({ count: count() })
    .from(followersTable)
    .where(eq(followersTable.userId, user?.id!))
    .then((res) => res[0]);

  const isFollowingPromise = db
    .select()
    .from(followersTable)
    .where(
      and(
        eq(followersTable.userId, session?.user?.id!),
        eq(followersTable.followsUserId, user?.id!)
      )
    )
    .then((res) => res[0]);

  const [followers, followings, isFollowingResult] = await Promise.all([
    followersPromise,
    followingsPromise,
    isFollowingPromise,
  ]);

  if (!user) return <div className='p-4'>유저 없음</div>;

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
            {user.id === session?.user?.id && <EditProfileDialog user={user} />}
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
          <p className='text-muted-foreground'>{user.handle}</p>
        </div>

        <div className='px-4 py-2 flex gap-2 text-lg'>
          <p className='space-x-1'>
            <span className='font-[500]'>{followers.count}</span>
            <span className='text-muted-foreground'>팔로워</span>
          </p>
          <p className='space-x-1'>
            <span className='font-[500]'>{followings.count}</span>
            <span className='text-muted-foreground'>팔로우 중</span>
          </p>
          <p className='space-x-1'>
            <span className='font-[500]'>{0}</span>
            <span className='text-muted-foreground'>게시글 수</span>
          </p>
        </div>
      </>
    </div>
  );
}

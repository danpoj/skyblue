import { auth } from '@/auth';
import { Skyblue } from '@/components/logos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SignIn } from '@/components/sign-in';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, Settings, SquarePen, User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/db/drizzle';
import { InferSelectModel, eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { notFound } from 'next/navigation';
import { NewPostButton } from './new-post-button';

export const LeftSidebar = async () => {
  const session = await auth();

  return (
    <header className='w-20 sm:w-60 flex flex-col pt-3 space-y-3 h-fit sticky top-0 px-2'>
      {session ? (
        <Suspense
          fallback={
            <>
              <Avatar className='h-14 w-14'>
                <Skeleton className='w-14 h-14 flex items-center justify-center' />
              </Avatar>

              <nav className='flex flex-col gap-1'>
                {Array.from({ length: 3 })
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton className='h-10 w-full' key={index} />
                  ))}
              </nav>
            </>
          }
        >
          <LeftSidebarLoggedIn id={session.user?.id!} />
        </Suspense>
      ) : (
        <LeftSidebarLoggedOut />
      )}
    </header>
  );
};

export const LeftSidebarLoggedIn = async ({ id }: { id: string }) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) notFound();

  const links = [
    {
      href: '/',
      text: '홈',
      icon: Home,
    },
    {
      href: `/profile/${user.nickname}`,
      text: '프로필',
      icon: User,
    },
    {
      href: '/setting',
      text: '설정',
      icon: Settings,
    },
  ];

  return (
    <>
      <div className='w-full flex items-center justify-center sm:justify-start sm:pl-4'>
        <UserAvatar user={user} />
      </div>

      <nav className='flex flex-col w-full'>
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Button
              key={link.href}
              asChild
              className='h-12 justify-center sm:justify-start text-xl font-normal w-full'
              variant='ghost'
            >
              <Link href={link.href}>
                <Icon className='sm:mr-3' />
                <span className='hidden sm:inline'>{link.text}</span>
              </Link>
            </Button>
          );
        })}
      </nav>

      <NewPostButton user={user} />
    </>
  );
};

const UserAvatar = ({ user }: { user: InferSelectModel<typeof users> }) => {
  return (
    <Link href={`/profile/${user.nickname}`}>
      <Avatar className='h-14 w-14'>
        <AvatarImage src={user.image!} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export const LeftSidebarLoggedOut = () => {
  return (
    <div className='space-y-2'>
      <Skyblue className='w-12 h-12' />
      <p className='font-semibold'>가입 또는 로그인하여 대화에 참여하세요</p>

      <SignIn />
    </div>
  );
};

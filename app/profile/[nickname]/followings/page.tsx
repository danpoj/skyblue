import { BackButton } from '@/components/back-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/db/drizzle';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page({
  params: { nickname },
}: {
  params: {
    nickname: string;
  };
}) {
  const decodedNickname = decodeURIComponent(nickname);

  const user = await db.query.users.findFirst({
    where: (userTable, { eq }) => eq(userTable.nickname, decodedNickname),
    with: {
      follows: {
        columns: {},
        with: {
          followers: true,
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <div>
      <div className='flex justify-between py-1 px-2 border-b'>
        <BackButton />
        <p className='py-2 text-xl font-semibold'>필로잉 중</p>
        <div />
      </div>

      <div className=''>
        {user.follows.map((user) => {
          const follower = user.followers;

          return (
            <Link key={follower.id} href={`/profile/${follower.nickname}`}>
              <div className='px-2 py-4 space-y-4 border-b hover:bg-primary/5'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-10'>
                      <AvatarImage src={follower.image} />
                      <AvatarFallback>{follower.nickname}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className='text-sm font-semibold'>
                        {follower.nickname}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        @{follower.handle}
                      </p>
                    </div>
                  </div>
                </div>
                <p className='text-gray-700 text-sm pl-12'>
                  {follower.description.length > 100
                    ? `${follower.description} ...`
                    : follower.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

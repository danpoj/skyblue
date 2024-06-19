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
      followers: {
        columns: {},
        with: {
          follows: true,
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <div>
      <p className='border-b text-center py-2 text-xl font-semibold'>팔로워</p>

      <div className=''>
        {user.followers.map((user) => {
          const follower = user.follows;

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

'use client';

import { followUser } from '@/actions/user';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const FollowButton = ({
  id,
  isFollowing,
}: {
  id: string;
  isFollowing: boolean;
}) => {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await followUser(id, isFollowing);

        router.refresh();
      }}
      size='sm'
      className='px-4 rounded-3xl'
      variant={isFollowing ? 'secondary' : 'bluish'}
    >
      팔로우
    </Button>
  );
};

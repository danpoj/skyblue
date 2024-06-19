'use client';

import { followUser } from '@/actions/user';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export const FollowButton = ({
  id,
  isFollowing = false,
}: {
  id: string;
  isFollowing?: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={(e) => {
        e.stopPropagation();
        startTransition(async () => {
          await followUser(id, isFollowing);
          router.refresh();
        });
      }}
      size='sm'
      className='rounded-3xl disabled:cursor-not-allowed w-20'
      variant={isFollowing ? 'outline' : 'bluish'}
    >
      {isPending ? (
        <Loader2 className='size-4 animate-spin' />
      ) : isFollowing ? (
        '팔로우 중'
      ) : (
        '팔로우'
      )}
    </Button>
  );
};

'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push('/');
        }
      }}
      size='icon'
      variant='ghost'
      className='size-12'
    >
      <ChevronLeft className='stroke-[3px] size-7' />
    </Button>
  );
};

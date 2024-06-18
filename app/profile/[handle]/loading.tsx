import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <div className='flex justify-end items-center p-4 pb-2 relative'>
        <Avatar className='h-24 w-24 absolute left-4 -top-10 outline outline-white'>
          <Skeleton className='w-24 h-24' />
        </Avatar>

        <div className='flex items-center gap-2'>
          <Skeleton className='w-20 h-10 rounded-3xl' />
          <Skeleton className='w-10 h-10 rounded-full' />
        </div>
      </div>

      <div className='px-4 space-y-1'>
        <Skeleton className='h-8 w-60' />
        <Skeleton className='h-6 w-40' />
      </div>
    </>
  );
}

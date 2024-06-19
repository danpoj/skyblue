import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <div className='px-4 items-center bg-[#0070FF] flex gap-2 h-[9rem]'></div>

      <>
        <div className='flex justify-end items-center p-4 pb-2 relative'>
          <Skeleton className='size-24 absolute left-4 -top-10 rounded-full' />

          <div className='flex items-center gap-2'>
            <Skeleton className='h-10 w-20' />
            <Skeleton className='size-8 rounded-full' />
          </div>
        </div>

        <div className='px-4 space-y-2'>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='h-7 w-40' />
          <div className='flex gap-2'>
            <Skeleton className='h-7 w-16' />
            <Skeleton className='h-7 w-16' />
            <Skeleton className='h-7 w-16' />
          </div>
        </div>
      </>
    </div>
  );
}

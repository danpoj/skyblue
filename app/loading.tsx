import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='w-full flex items-center justify-center mt-12'>
      <Loader2 className='animate-spin' />
    </div>
  );
}

import { signOut } from '@/auth';
import { Button } from './ui/button';

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <Button
        type='submit'
        variant='destructive'
        size='sm'
        className='rounded-3xl px-4'
      >
        로그아웃
      </Button>
    </form>
  );
}

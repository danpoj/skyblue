import { signIn } from '@/auth';
import { Button } from './ui/button';

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <Button
        type='submit'
        variant='bluish'
        size='sm'
        className='px-4 rounded-3xl'
      >
        로그인
      </Button>
    </form>
  );
}

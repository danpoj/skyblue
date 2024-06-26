import { SignInAction } from './sign-in-action';
import { Button } from './ui/button';

export function SignIn() {
  return (
    <form action={SignInAction}>
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

import { auth } from '@/auth';
import { SignOut } from '@/components/sign-out';

export default async function Page() {
  const session = await auth();

  return <div className='p-4'>{session && <SignOut />}</div>;
}

import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { ProfilePage } from './profile-page';

export default async function Page({
  params: { nickname },
}: {
  params: { nickname: string };
}) {
  const decodedNickname = decodeURIComponent(nickname);
  const session = await auth();
  if (!session) notFound();

  return <ProfilePage nickname={decodedNickname} session={session} />;
}

import { inter } from '@/lib/fonts';
import { LeftSidebar } from '@/app/left-sidebar';
import { RightSidebar } from '@/app/right-sidebar';
import './globals.css';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Skyblue',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn(inter.className, 'overscroll-none')}>
        <div className='h-screen max-w-[76rem] mx-auto flex'>
          <LeftSidebar />
          <main className='flex-1 border-x border-gray-200'>{children}</main>
          <RightSidebar />
        </div>

        <Toaster />
      </body>
    </html>
  );
}

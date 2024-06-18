import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';

const categories = [
  'Following',
  'Discover',
  'All-Time Bangers',
  'Catch Up',
  'Quiet Posters',
  'Best of Follows',
  'Popular With Friends',
  'Anime & Manga (New)',
  'Blacksky',
];

const bottoms = ['피드백', '개인정보', '이용약관', '도움말'];

export const RightSidebar = () => {
  return (
    <aside className='w-80 p-4 hidden lg:block'>
      <div className='relative'>
        <Input
          placeholder='검색'
          className='text-lg h-11 pl-10 rounded-3xl placeholder:text-slate-700'
        />
        <Search className='absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 stroke-slate-800' />
      </div>

      <Separator className='my-4' />

      <div className='flex flex-col'>
        {categories.map((category) => (
          <Button
            key={category}
            variant='link'
            className='justify-normal h-9 text-lg text-muted-foreground font-light'
          >
            {category}
          </Button>
        ))}

        <Button
          className='justify-start text-blue-400 font-normal'
          variant='link'
        >
          피드 더 보기
        </Button>
      </div>

      <Separator className='my-4' />

      <div className='pl-3'>
        {bottoms.map((link) => (
          <Button
            key={link}
            className='text-blue-400 font-normal px-1'
            variant='link'
          >
            {link}
          </Button>
        ))}
      </div>
    </aside>
  );
};

import { Skyblue } from '@/components/logos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/db/drizzle';
import { cn } from '@/lib/utils';
import { ImageZoom } from './image-zoom';

export default function Page() {
  return (
    <div>
      <div className='py-4 flex items-center justify-center border-b border-gray-200'>
        <Skyblue />
      </div>

      <Posts />
    </div>
  );
}

async function Posts() {
  const posts = await db.query.posts.findMany({
    with: {
      images: true,
      user: true,
    },
    limit: 32,
    orderBy: (postTable, { desc }) => desc(postTable.createdAt),
  });

  return (
    <div>
      <div className='border-b mb-10'>
        {posts.map((post) => (
          <div key={post.id} className='px-4 py-6 border-b space-y-3'>
            <div className='flex gap-3'>
              <Avatar className='size-14'>
                <AvatarImage src={post.user.image} />
                <AvatarFallback>{post.user.nickname}</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold text-lg'>{post.user.nickname}</p>
                <p className='text-muted-foreground'>{post.user.handle}</p>
              </div>
            </div>

            <p>{post.text}</p>

            <div
              className={cn(
                'grid gap-2',
                post.images.length === 1 || post.images.length === 2
                  ? 'grid-cols-2'
                  : post.images.length === 3
                  ? 'grid-cols-3'
                  : post.images.length === 4
                  ? 'grid-cols-2'
                  : ''
              )}
            >
              {post.images.map((image) => (
                <ImageZoom key={image.id} image={image} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className='pt-8 text-center text-muted-foreground pb-10'>피드 끝</p>
    </div>
  );
}

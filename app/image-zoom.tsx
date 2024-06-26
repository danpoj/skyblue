'use client';

import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';

type Props = {
  image: {
    id: string;
    src: string;
    postId: number;
  };
};

export const ImageZoom = ({ image }: Props) => {
  return (
    <div>
      <Zoom>
        <Image
          alt={'post image'}
          src={image.src}
          width={400}
          height={400}
          className='aspect-square overflow-hidden object-cover rounded-xl shadow'
        />
      </Zoom>
    </div>
  );
};

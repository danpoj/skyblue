'use client';

import { useSidebarOpen } from '@/components/provider/sidebar-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

export const SidebarToggler = () => {
  const { isOpen, setIsOpen } = useSidebarOpen();

  return (
    <Button
      onClick={() => setIsOpen((prev) => !prev)}
      size='icon'
      className='fixed left-4 bottom-4 z-50 bg-primary/40 hover:bg-primary'
    >
      <ChevronLeft
        className={cn(
          'stroke-[3px] transition',
          isOpen ? 'rotate-0' : 'rotate-180'
        )}
      />
    </Button>
  );
};

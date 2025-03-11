import { ReactNode, cloneElement, isValidElement, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
  className?: string;
}

export function SidebarLayout({ sidebar, content, className}: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={cn("container-fluid h-[calc(100vh-4rem)]", className)}>
      <div className={`grid ${sidebarOpen ? "grid-cols-[320px,1fr]" : "grid-cols-none"} h-full gap-6`}>
        {/* Sidebar */}
        <aside className={cn(`
          border-r border-gray-200 dark:border-gray-800
          bg-gray-50 dark:bg-gray-900
          overflow-y-auto
          transition-all duration-300 ease-in-out
          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
          scrollbar-track-transparent hover:scrollbar-thumb-gray-400
          shadow-sm dark:shadow-gray-800/30
          ${sidebarOpen ? "d-block" : "hidden"}
        `)}>
          <div className="h-full y-4 space-y-4 position-relative">
            {sidebar}
          </div>
        </aside>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
          className="position absolute top-52 left-0 z-50"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Content */}
        <main className={cn(
          "py-6 px-4",
          "overflow-y-auto",
          "transition-all duration-300 ease-in-out",
          "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700",
          "scrollbar-track-transparent"
        )}>
          {content}
        </main>
      </div>
    </div>
  );
}
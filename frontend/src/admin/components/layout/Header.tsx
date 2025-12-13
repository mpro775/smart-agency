import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          {title && (
            <h1 className="text-lg font-semibold text-white hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="بحث..."
              className="w-full pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-400 hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 left-1 w-2 h-2 bg-emerald-500 rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}


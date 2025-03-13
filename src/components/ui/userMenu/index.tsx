import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '../button';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="max-w-[150px] truncate">{user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
        <DropdownMenuItem
          onClick={logout}
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-sm",
            "text-red-600 dark:text-red-400",
            "hover:bg-red-50 dark:hover:bg-red-900/50",
            "focus:bg-red-50 dark:focus:bg-red-900/50",
            "cursor-pointer"
          )}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
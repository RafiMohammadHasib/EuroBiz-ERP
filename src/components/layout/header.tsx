'use client';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import placeholder from '@/lib/placeholder-images.json';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, PieChart, Search } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const userAvatar = placeholder.placeholderImages.find(p => p.id === 'user-avatar') as ImagePlaceholder | undefined;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <SidebarTrigger />
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="ghost" asChild>
        <Link href="/reports">
          <PieChart className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Reports</span>
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[320px]">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start gap-1">
            <p className="font-medium">New invoice #INV-005 created</p>
            <p className="text-xs text-muted-foreground">
              A new invoice for Queen Consolidated has been added.
            </p>
          </DropdownMenuItem>
           <DropdownMenuItem className="flex-col items-start gap-1">
            <p className="font-medium text-destructive">Invoice #INV-004 is overdue</p>
            <p className="text-xs text-muted-foreground">
              Invoice for Cyberdyne Systems is past its due date.
            </p>
          </DropdownMenuItem>
           <DropdownMenuItem className="flex-col items-start gap-1">
            <p className="font-medium">Production order completed</p>
            <p className="text-xs text-muted-foreground">
              Order #PROD-001 for Premium Wall Paint is complete.
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-center">
            <Link href="/notifications" className="text-sm text-primary">
              View all notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Admin" data-ai-hint={userAvatar.imageHint} />}
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

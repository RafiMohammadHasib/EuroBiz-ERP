'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import SidebarNav from '@/components/layout/sidebar-nav';
import Header from '@/components/layout/header';
import { navItems, navGroups } from '@/components/layout/sidebar-nav';
import { useState } from 'react';
import type { Icon } from 'lucide-react';

interface NavItem {
    href: string;
    label: string;
    icon: Icon;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNavItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNavGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(group => group.items.length > 0);

  const isSearching = searchQuery.length > 0;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarNav navItems={filteredNavItems} navGroups={filteredNavGroups} />
      </Sidebar>
      <SidebarInset>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

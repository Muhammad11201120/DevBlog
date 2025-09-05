import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type SupportedLocale } from '@/lib/i18n';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'nav.dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'nav.home',
        href: '/',
        icon: Home,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { direction, auth } = page.props as SharedData & { auth?: { user?: { role?: string } } };
    const locale = (page.props.locale as SupportedLocale) || 'en';
    const side = direction === 'rtl' ? 'right' : 'left';
    const canSeeDashboard = auth?.user?.role === 'writer' || auth?.user?.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset" side={side as 'left' | 'right'}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={canSeeDashboard ? dashboard() : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>{canSeeDashboard && <NavMain items={mainNavItems} />}</SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

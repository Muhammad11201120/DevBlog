import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { translate, type SupportedLocale } from '@/lib/i18n';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const locale = (page.props.locale as SupportedLocale) || 'en';
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{translate('sidebar.platform', locale)}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={(() => {
                                const href = typeof item.href === 'string' ? item.href : item.href.url;
                                const currentUrl = page.url;

                                // Exact match for dashboard and home
                                if (href === '/dashboard' || href === '/') {
                                    return currentUrl === href;
                                }

                                // For admin routes, check if current URL starts with the href
                                if (href.startsWith('/admin/')) {
                                    return currentUrl.startsWith(href);
                                }

                                // For other routes, use startsWith but be more specific
                                return currentUrl.startsWith(href) && (currentUrl === href || currentUrl.startsWith(href + '/'));
                            })()}
                            tooltip={{ children: translate(item.title, locale) }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{translate(item.title, locale)}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { translate, type SupportedLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Languages, LayoutGrid, LogIn, Menu, Moon, Sun, UserPlus, X } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'nav.dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData & { flash?: { success?: string; error?: string; info?: string } }>();
    const locale = (page.props.locale as SupportedLocale) || 'en';
    const isEn = locale === 'en';
    const isAr = locale === 'ar';
    const { auth } = page.props;
    const getInitials = useInitials();
    const canSeeDashboard = auth.user?.role === 'writer' || auth.user?.role === 'admin';
    const { appearance, updateAppearance } = useAppearance();
    return (
        <>
            <div className="sticky top-0 z-40 border-b border-sidebar-border/80 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile (Arabic): logo on right, toggles + burger on left */}
                    {locale === 'ar' && (
                        <div className="flex w-full items-center lg:hidden rtl:flex-row-reverse">
                            {/* Logo at right in RTL (first item) */}
                            {canSeeDashboard ? (
                                <Link href={dashboard()} prefetch className="flex items-center gap-2">
                                    <AppLogo />
                                </Link>
                            ) : (
                                <Link href={'/'} prefetch className="flex items-center gap-2">
                                    <AppLogo />
                                </Link>
                            )}
                            <div className="flex-1" />
                            {/* Theme toggle icon */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        aria-label={translate('toggle.theme', locale)}
                                        title={translate('toggle.theme', locale)}
                                    >
                                        {appearance === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuRadioGroup
                                        value={appearance}
                                        onValueChange={(val) => updateAppearance(val as 'light' | 'dark' | 'system')}
                                    >
                                        <DropdownMenuRadioItem value="light">{translate('theme.light', locale)}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="dark">{translate('theme.dark', locale)}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="system">{translate('theme.system', locale)}</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* Language toggle icon */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        aria-label={translate('toggle.language', locale)}
                                        title={translate('toggle.language', locale)}
                                    >
                                        <Languages className="size-4 opacity-80" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => (window.location.href = `/locale/en`)}>
                                        {translate('lang.english', locale)}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => (window.location.href = `/locale/ar`)}>
                                        {translate('lang.arabic', locale)}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* Burger menu at left */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="ml-1 h-[34px] w-[34px]">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side={'right'} className="flex h-full w-72 flex-col items-stretch justify-between bg-sidebar">
                                    <SheetTitle className="sr-only">{translate('header.navigation_menu', locale)}</SheetTitle>
                                    <SheetHeader className="flex justify-start text-start"></SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-5 p-4 text-sm">
                                        {!auth.user && (
                                            <div className="flex items-center gap-2">
                                                <Link href={login()} className="flex-1">
                                                    <Button variant="outline" className="w-full justify-center gap-2">
                                                        <LogIn className="h-4 w-4" /> {translate('auth.login', locale)}
                                                    </Button>
                                                </Link>
                                                <Link href={register()} className="flex-1">
                                                    <Button className="w-full justify-center gap-2">
                                                        <UserPlus className="h-4 w-4" /> {translate('auth.register', locale)}
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                        {canSeeDashboard && (
                                            <div className="flex flex-col space-y-3">
                                                {mainNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span className="font-medium">{translate(item.title, locale)}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {rightNavItems.length > 0 && (
                                            <div className="flex flex-col space-y-3">
                                                {rightNavItems.map((item) => (
                                                    <a
                                                        key={item.title}
                                                        href={typeof item.href === 'string' ? item.href : item.href.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span className="font-medium">{translate(item.title, locale)}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        <Separator className="my-1" />

                                        {/* Theme toggle inside sheet (Arabic mobile) */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                {translate('toggle.theme', locale)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant={appearance === 'light' ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="flex-1 justify-center gap-2"
                                                    onClick={() => updateAppearance('light')}
                                                >
                                                    <Sun className="h-4 w-4" /> {translate('theme.light', locale)}
                                                </Button>
                                                <Button
                                                    variant={appearance === 'dark' ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="flex-1 justify-center gap-2"
                                                    onClick={() => updateAppearance('dark')}
                                                >
                                                    <Moon className="h-4 w-4" /> {translate('theme.dark', locale)}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Language toggle inside sheet (Arabic mobile) */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                {translate('toggle.language', locale)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant={isEn ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="flex-1 justify-center"
                                                    onClick={() => (window.location.href = `/locale/en`)}
                                                >
                                                    {translate('lang.english', locale)}
                                                </Button>
                                                <Button
                                                    variant={isAr ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="flex-1 justify-center"
                                                    onClick={() => (window.location.href = `/locale/ar`)}
                                                >
                                                    {translate('lang.arabic', locale)}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}

                    {/* Default logo (hidden on mobile for Arabic, visible otherwise) */}
                    {canSeeDashboard ? (
                        <Link href={dashboard()} prefetch className={cn('flex items-center gap-2', isAr ? 'hidden lg:flex' : '')}>
                            <AppLogo />
                        </Link>
                    ) : (
                        <Link href={'/'} prefetch className={cn('flex items-center gap-2', isAr ? 'hidden lg:flex' : '')}>
                            <AppLogo />
                        </Link>
                    )}

                    {/* Desktop Navigation */}
                    {canSeeDashboard && (
                        <div className="hidden h-full items-center gap-6 lg:flex ltr:ml-6 rtl:mr-6">
                            <NavigationMenu className="flex h-full items-stretch">
                                <NavigationMenuList className="flex h-full items-stretch gap-2">
                                    {mainNavItems.map((item, index) => (
                                        <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === (typeof item.href === 'string' ? item.href : item.href.url) && activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="h-4 w-4 ltr:mr-2 rtl:mr-2 rtl:ml-2" />}
                                                {translate(item.title, locale)}
                                            </Link>
                                            {page.url === item.href && (
                                                <div className="absolute bottom-0 h-0.5 w-full translate-y-px bg-black ltr:left-0 rtl:right-0 dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    )}

                    <div className="flex items-center gap-2 ltr:ml-auto rtl:mr-auto">
                        {/* Mobile Menu (English on right) */}
                        {locale !== 'ar' && (
                            <div className="lg:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="ml-2 h-[34px] w-[34px]">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side={'right'}
                                        className="flex h-full w-72 flex-col items-stretch justify-between bg-sidebar [&>button.absolute.top-4.left-4]:hidden"
                                    >
                                        <SheetTitle className="sr-only">{translate('header.navigation_menu', locale)}</SheetTitle>
                                        <SheetHeader className="relative flex items-center justify-start text-start">
                                            <SheetClose asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-8 w-8"
                                                    aria-label="Close"
                                                    title="Close"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </SheetClose>
                                        </SheetHeader>
                                        <div className="flex h-full flex-1 flex-col space-y-5 p-4 text-sm">
                                            {!auth.user && (
                                                <div className="flex items-center gap-2">
                                                    <Link href={login()} className="flex-1">
                                                        <Button variant="outline" className="w-full justify-center gap-2">
                                                            <LogIn className="h-4 w-4" /> {translate('auth.login', locale)}
                                                        </Button>
                                                    </Link>
                                                    <Link href={register()} className="flex-1">
                                                        <Button className="w-full justify-center gap-2">
                                                            <UserPlus className="h-4 w-4" /> {translate('auth.register', locale)}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                            {canSeeDashboard && (
                                                <div className="flex flex-col space-y-3">
                                                    {mainNavItems.map((item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
                                                        >
                                                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                            <span className="font-medium">{translate(item.title, locale)}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {rightNavItems.length > 0 && (
                                                <div className="flex flex-col space-y-3">
                                                    {rightNavItems.map((item) => (
                                                        <a
                                                            key={item.title}
                                                            href={typeof item.href === 'string' ? item.href : item.href.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
                                                        >
                                                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                            <span className="font-medium">{translate(item.title, locale)}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                            <Separator className="my-1" />
                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                    {translate('toggle.theme', locale)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant={appearance === 'light' ? 'default' : 'outline'}
                                                        size="sm"
                                                        className="flex-1 justify-center gap-2"
                                                        onClick={() => updateAppearance('light')}
                                                    >
                                                        <Sun className="h-4 w-4" /> {translate('theme.light', locale)}
                                                    </Button>
                                                    <Button
                                                        variant={appearance === 'dark' ? 'default' : 'outline'}
                                                        size="sm"
                                                        className="flex-1 justify-center gap-2"
                                                        onClick={() => updateAppearance('dark')}
                                                    >
                                                        <Moon className="h-4 w-4" /> {translate('theme.dark', locale)}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                    {translate('toggle.language', locale)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant={isEn ? 'default' : 'outline'}
                                                        size="sm"
                                                        className="flex-1 justify-center"
                                                        onClick={() => (window.location.href = `/locale/en`)}
                                                    >
                                                        {translate('lang.english', locale)}
                                                    </Button>
                                                    <Button
                                                        variant={isAr ? 'default' : 'outline'}
                                                        size="sm"
                                                        className="flex-1 justify-center"
                                                        onClick={() => (window.location.href = `/locale/ar`)}
                                                    >
                                                        {translate('lang.arabic', locale)}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        )}
                        <div className="relative flex items-center gap-1">
                            <div className="hidden lg:flex">
                                {rightNavItems.map((item) => (
                                    <TooltipProvider key={item.title} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <a
                                                    href={typeof item.href === 'string' ? item.href : item.href.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ltr:ml-1 rtl:mr-1"
                                                >
                                                    <span className="sr-only">{translate(item.title, locale)}</span>
                                                    {item.icon && <Icon iconNode={item.icon} className="size-5 opacity-80 group-hover:opacity-100" />}
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{translate(item.title, locale)}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                        <div className={cn('flex items-center gap-1', isAr ? 'hidden lg:flex' : '')}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        aria-label={translate('toggle.theme', locale)}
                                        title={translate('toggle.theme', locale)}
                                    >
                                        {appearance === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuRadioGroup
                                        value={appearance}
                                        onValueChange={(val) => updateAppearance(val as 'light' | 'dark' | 'system')}
                                    >
                                        <DropdownMenuRadioItem value="light">{translate('theme.light', locale)}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="dark">{translate('theme.dark', locale)}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="system">{translate('theme.system', locale)}</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        aria-label={translate('toggle.language', locale)}
                                        title={translate('toggle.language', locale)}
                                    >
                                        <Languages className="size-4 opacity-80" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => (window.location.href = `/locale/en`)}>
                                        {translate('lang.english', locale)}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => (window.location.href = `/locale/ar`)}>
                                        {translate('lang.arabic', locale)}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden items-center gap-2 sm:flex">
                                <Link href={login()} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
                                    <LogIn className="h-4 w-4" /> {translate('auth.login', locale)}
                                </Link>
                                <Link href={register()} className="text-sm">
                                    <Button size="sm" className="gap-2">
                                        <UserPlus className="h-4 w-4" /> {translate('auth.register', locale)}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {(page.props.flash?.success || page.props.flash?.error || page.props.flash?.info) && (
                <div className="mx-auto w-full px-4 py-2 md:max-w-7xl">
                    <Alert variant={page.props.flash?.error ? 'destructive' : 'default'}>
                        <AlertDescription>{page.props.flash?.error || page.props.flash?.success || page.props.flash?.info}</AlertDescription>
                    </Alert>
                </div>
            )}
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}

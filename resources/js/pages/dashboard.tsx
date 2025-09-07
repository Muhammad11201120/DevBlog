import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { PageTransition } from '@/components/ui/page-transition';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { translate, type SupportedLocale } from '@/lib/i18n';
import { dashboard, posts } from '@/routes/simple';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Copy,
    ExternalLink,
    FilePlus2,
    FileText,
    MessageSquare,
    ThumbsDown,
    ThumbsUp,
    Users,
    Wand2,
} from 'lucide-react';

export default function Dashboard() {
    const { metrics, recentPosts, recentComments, locale, direction, auth } = usePage<
        SharedData & {
            metrics: { posts: number; comments: number; likes: number; dislikes: number; users: number };
            recentPosts: Array<{ id: number; title: string; user?: { name: string } }>;
            recentComments: Array<{ id: number; content: string; user?: { name: string }; post?: { id: number; title: string } }>;
        }
    >().props;

    const currentLocale = (locale as SupportedLocale) || 'en';
    const isRtl = direction === 'rtl';
    const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;
    const initials = useInitials();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: translate('dashboard.title', currentLocale),
            href: dashboard(),
        },
    ];

    const kpis = [
        { label: translate('dashboard.kpi.posts', currentLocale), value: metrics?.posts ?? 0, icon: BarChart3 },
        { label: translate('dashboard.kpi.comments', currentLocale), value: metrics?.comments ?? 0, icon: MessageSquare },
        { label: translate('dashboard.kpi.users', currentLocale), value: metrics?.users ?? 0, icon: Users },
        { label: translate('dashboard.kpi.likes', currentLocale), value: metrics?.likes ?? 0, icon: ThumbsUp },
        { label: translate('dashboard.kpi.dislikes', currentLocale), value: metrics?.dislikes ?? 0, icon: ThumbsDown },
    ];

    const chartData = [
        { key: 'likes', label: translate('dashboard.likes', currentLocale), value: metrics?.likes ?? 0, gradient: 'from-emerald-500 to-emerald-400' },
        {
            key: 'dislikes',
            label: translate('dashboard.dislikes', currentLocale),
            value: metrics?.dislikes ?? 0,
            gradient: 'from-rose-500 to-rose-400',
        },
        { key: 'posts', label: translate('dashboard.posts', currentLocale), value: metrics?.posts ?? 0, gradient: 'from-sky-500 to-sky-400' },
        {
            key: 'comments',
            label: translate('dashboard.comments', currentLocale),
            value: metrics?.comments ?? 0,
            gradient: 'from-fuchsia-500 to-fuchsia-400',
        },
    ];
    const maxVal = Math.max(1, ...chartData.map((d) => d.value));

    async function copyLink(url: string) {
        try {
            await navigator.clipboard.writeText(window.location.origin + url);
        } catch (e) {
            console.error('Failed to copy link', e);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translate('dashboard.title', currentLocale)} />
            <PageTransition>
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <motion.div className="flex items-center justify-between gap-3" variants={fadeInUp} initial="hidden" animate="visible">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">{translate('dashboard.welcome', currentLocale)}</h1>
                            <p className="text-sm text-muted-foreground">{translate('dashboard.subtitle', currentLocale)}</p>
                        </div>
                        {(auth?.user?.role === 'writer' || auth?.user?.role === 'admin') && (
                            <motion.div
                                className="flex items-center gap-2"
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.2 }}
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href={posts.create()}>
                                        <Button size="sm" className="gap-2">
                                            <Icon iconNode={FilePlus2} className="size-4" /> {translate('dashboard.actions.new_post', currentLocale)}
                                        </Button>
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href={posts.index()}>
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <Icon iconNode={Wand2} className="size-4" /> {translate('dashboard.actions.manage_posts', currentLocale)}
                                        </Button>
                                    </Link>
                                </motion.div>
                                {auth?.user?.role === 'admin' && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href="/categories">
                                            <Button size="sm" variant="outline" className="gap-2">
                                                <Icon iconNode={Wand2} className="size-4" />{' '}
                                                {translate('admin.dashboard.manage_categories', currentLocale)}
                                            </Button>
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {kpis.map((kpi, index) => (
                            <motion.div key={kpi.label} variants={staggerItem}>
                                <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Card className="relative overflow-hidden">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                                            <motion.div
                                                className="rounded-md bg-gradient-to-tr from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 p-2"
                                                animate={{ rotate: [0, 5, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                            >
                                                <Icon iconNode={kpi.icon} className="size-4" />
                                            </motion.div>
                                        </CardHeader>
                                        <CardContent>
                                            <motion.div
                                                className="text-3xl font-semibold tabular-nums"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                                            >
                                                {kpi.value}
                                            </motion.div>
                                            <CardDescription className="mt-1">{translate('dashboard.updated', currentLocale)}</CardDescription>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="grid gap-4 lg:grid-cols-2"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div variants={staggerItem}>
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{translate('dashboard.recent_posts', currentLocale)}</CardTitle>
                                        <motion.div whileHover={{ scale: 1.05 }}>
                                            <Link href={posts.index()} className="text-sm text-primary hover:underline">
                                                {translate('dashboard.view_all', currentLocale)}
                                            </Link>
                                        </motion.div>
                                    </div>
                                    <CardDescription>{translate('dashboard.recent_posts', currentLocale)}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {(recentPosts ?? []).slice(0, 6).map((p, index) => (
                                            <motion.li
                                                key={p.id}
                                                className="rounded-lg border p-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                            >
                                                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                                    <motion.div
                                                        className="inline-flex items-center justify-center rounded-md bg-gradient-to-tr from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 p-2"
                                                        whileHover={{ rotate: 5 }}
                                                    >
                                                        <FileText className="size-4" />
                                                    </motion.div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate font-medium">{p.title}</div>
                                                        <div className="text-xs text-muted-foreground">{p.user?.name ?? 'Unknown'}</div>
                                                    </div>
                                                    <div className="flex items-center gap-1 self-start sm:self-auto ltr:sm:ml-auto rtl:sm:mr-auto">
                                                        <TooltipProvider delayDuration={0}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                        <Link
                                                                            href={`/posts/${p.id}`}
                                                                            className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                                                                        >
                                                                            <ExternalLink className="size-4" />
                                                                        </Link>
                                                                    </motion.div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{translate('common.view', currentLocale)}</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <TooltipProvider delayDuration={0}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <motion.button
                                                                        onClick={() => copyLink(`/posts/${p.id}`)}
                                                                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <Copy className="size-4" />
                                                                    </motion.button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{translate('common.copy_link', currentLocale)}</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <ArrowIcon className="size-4 shrink-0 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                        {(!recentPosts || recentPosts.length === 0) && (
                                            <motion.div
                                                className="text-sm text-muted-foreground"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                {translate('dashboard.no_posts', currentLocale)}
                                            </motion.div>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={staggerItem}>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle>{translate('dashboard.recent_comments', currentLocale)}</CardTitle>
                                    <CardDescription>{translate('dashboard.recent_comments', currentLocale)}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {(recentComments ?? []).slice(0, 6).map((c, index) => (
                                            <motion.li
                                                key={c.id}
                                                className="rounded-lg border p-3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                whileHover={{ scale: 1.02, x: -5 }}
                                            >
                                                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                                    <motion.div whileHover={{ scale: 1.1 }}>
                                                        <Avatar className="size-8">
                                                            <AvatarFallback className="text-xs">{initials(c.user?.name ?? 'U')}</AvatarFallback>
                                                        </Avatar>
                                                    </motion.div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-sm">{c.content}</div>
                                                        <div className="text-xs text-muted-foreground">{c.user?.name ?? 'Unknown'}</div>
                                                    </div>
                                                    {c.post?.id ? (
                                                        <motion.div whileHover={{ scale: 1.05 }}>
                                                            <Link
                                                                href={`/posts/${c.post.id}`}
                                                                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline sm:mt-0 ltr:sm:ml-auto rtl:sm:mr-auto"
                                                            >
                                                                <span className="line-clamp-1 max-w-[160px] sm:max-w-[220px]">{c.post.title}</span>
                                                                <ArrowIcon className="size-4" />
                                                            </Link>
                                                        </motion.div>
                                                    ) : null}
                                                </div>
                                            </motion.li>
                                        ))}
                                        {(!recentComments || recentComments.length === 0) && (
                                            <motion.div
                                                className="text-sm text-muted-foreground"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                {translate('dashboard.no_comments', currentLocale)}
                                            </motion.div>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                        <Card className="relative overflow-hidden">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Badge variant="secondary" className="rounded-sm">
                                            {translate('dashboard.overview', currentLocale)}
                                        </Badge>
                                    </motion.div>
                                    <CardTitle>{translate('dashboard.engagement', currentLocale)}</CardTitle>
                                </div>
                                <CardDescription>{translate('dashboard.engagement', currentLocale)}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <div className="flex h-[220px] items-end justify-between gap-3">
                                        {chartData.map((d, index) => {
                                            const height = Math.round((d.value / maxVal) * 180);
                                            return (
                                                <motion.div
                                                    key={d.key}
                                                    className="flex w-full min-w-0 flex-1 flex-col items-center"
                                                    initial={{ opacity: 0, y: 50 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.8 + index * 0.1 }}
                                                >
                                                    <div className="flex h-[180px] w-full items-end">
                                                        <motion.div
                                                            className={`w-full rounded-t-md bg-gradient-to-t ${d.gradient}`}
                                                            style={{ height: `${height}px` }}
                                                            aria-label={`${d.label}: ${d.value}`}
                                                            title={`${d.label}: ${d.value}`}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${height}px` }}
                                                            transition={{
                                                                delay: 1 + index * 0.1,
                                                                duration: 0.8,
                                                                ease: 'easeOut',
                                                            }}
                                                        />
                                                    </div>
                                                    <motion.div
                                                        className="mt-2 line-clamp-1 text-center text-xs text-muted-foreground"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 1.2 + index * 0.1 }}
                                                    >
                                                        {d.label} · <span className="font-medium text-foreground">{d.value}</span>
                                                    </motion.div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <motion.div
                                    className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-4"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 1.5 }}
                                >
                                    {[
                                        { key: 'likes', value: metrics?.likes ?? 0, label: translate('dashboard.likes', currentLocale) },
                                        { key: 'dislikes', value: metrics?.dislikes ?? 0, label: translate('dashboard.dislikes', currentLocale) },
                                        { key: 'posts', value: metrics?.posts ?? 0, label: translate('dashboard.posts', currentLocale) },
                                        { key: 'comments', value: metrics?.comments ?? 0, label: translate('dashboard.comments', currentLocale) },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.key}
                                            className="rounded-md border p-3"
                                            variants={staggerItem}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                        >
                                            <div className="text-xs">{item.label}</div>
                                            <motion.div
                                                className="mt-1 text-xl font-semibold"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    delay: 1.8 + index * 0.1,
                                                    type: 'spring',
                                                    stiffness: 200,
                                                }}
                                            >
                                                {item.value}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </PageTransition>
        </AppLayout>
    );
}

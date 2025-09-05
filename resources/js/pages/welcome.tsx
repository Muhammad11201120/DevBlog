import { AppHeader } from '@/components/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { translate, type SupportedLocale } from '@/lib/i18n';
import { getPaginationLabel } from '@/lib/pagination';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import type { BlogPost } from '@/types/blog';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type PaginationLink = { url: string | null; label: string; active: boolean };

export default function Welcome() {
    const page = usePage<SharedData & { posts?: { data: BlogPost[]; links: PaginationLink[] } }>();
    const { auth, posts } = page.props;
    const locale = (page.props.locale as SupportedLocale) || 'en';
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    return (
        <>
            <Head title={translate('welcome.title', locale)}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <AppHeader />
            <div className="relative flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:p-8">
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute top-24 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 blur-3xl" />
                </div>

                <section className="relative mb-12 w-full max-w-6xl overflow-hidden rounded-2xl border bg-card p-8 sm:p-12">
                    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
                        <div className="absolute top-1/3 -right-16 size-72 rounded-full bg-sky-500/30 blur-3xl" />
                        <div className="absolute bottom-0 left-1/2 size-80 -translate-x-1/2 rounded-full bg-emerald-500/25 blur-3xl" />
                    </div>
                    <PlaceholderPattern className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 opacity-10" />
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge className="mb-4 bg-gradient-to-r from-fuchsia-600 to-sky-600 text-white shadow-sm">
                            {translate('welcome.badge', locale)}
                        </Badge>
                        <h1 className="bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 bg-clip-text text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-5xl md:text-6xl">
                            {translate('welcome.hero_title_prefix', locale)} <bdi>DevBlog</bdi>
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">{translate('welcome.hero_subtitle', locale)}</p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            {auth.user && (auth.user.role === 'writer' || auth.user.role === 'admin') ? (
                                <>
                                    <Link href={dashboard()}>
                                        <Button className="bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 text-white shadow-lg shadow-fuchsia-500/10 hover:from-fuchsia-600/90 hover:via-sky-600/90 hover:to-emerald-600/90">
                                            {translate('welcome.cta_go_to_dashboard', locale)}
                                        </Button>
                                    </Link>
                                    <a href="#posts">
                                        <Button variant="outline">{translate('welcome.cta_browse_posts', locale)}</Button>
                                    </a>
                                </>
                            ) : (
                                <>
                                    <Link href={register()}>
                                        <Button className="bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 text-white shadow-lg shadow-fuchsia-500/10 hover:from-fuchsia-600/90 hover:via-sky-600/90 hover:to-emerald-600/90">
                                            {translate('welcome.cta_create_account', locale)}
                                        </Button>
                                    </Link>
                                    <Link href={login()}>
                                        <Button variant="outline">{translate('auth.login', locale)}</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>
                <section id="posts" className="w-full max-w-6xl">
                    <div className="mb-8 text-center">
                        <h2 className="bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 bg-clip-text text-3xl font-semibold tracking-tight text-balance text-transparent">
                            {translate('welcome.latest_posts', locale)}
                        </h2>
                        <p className="mt-2 text-muted-foreground">{translate('welcome.latest_subtitle', locale)}</p>
                    </div>
                    {/* Search removed */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts?.data?.map((post: BlogPost) => (
                            <div
                                key={post.id}
                                className="group rounded-xl bg-gradient-to-b from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 p-[1px]"
                            >
                                <Card className="h-full rounded-[calc(theme(borderRadius.lg)-1px)] bg-card/90 backdrop-blur transition-shadow hover:shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">
                                            <Link href={`/posts/${post.id}`} className="hover:underline">
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground">
                                            {translate('post.by', locale)} {post.user?.name ?? translate('post.unknown', locale)}
                                        </div>
                                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>💬 {post.comments_count ?? 0}</span>
                                            <span>👍 {post.likes_count ?? 0}</span>
                                            <span>👎 {post.dislikes_count ?? 0}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-auto px-2"
                                                onClick={async () => {
                                                    try {
                                                        await navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`);
                                                    } catch (error) {
                                                        console.error('Failed to copy link to clipboard', error);
                                                    }
                                                }}
                                            >
                                                {translate('post.share', locale)}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                    {posts?.links && (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            {posts.links.map((link: PaginationLink, idx: number) =>
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`rounded-md border px-3 py-1 ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                    >
                                        <span>{getPaginationLabel(link.label, locale)}</span>
                                    </Link>
                                ) : (
                                    <span key={idx} className="rounded-md border px-3 py-1 text-muted-foreground opacity-60">
                                        <span>{getPaginationLabel(link.label, locale)}</span>
                                    </span>
                                ),
                            )}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import AppLayout from '@/layouts/app-layout';
import { type SupportedLocale } from '@/lib/i18n';
import { getPaginationLabel } from '@/lib/pagination';
import type { User } from '@/types';
import type { BlogPost } from '@/types/blog';
import { Link, usePage } from '@inertiajs/react';

type PaginationLink = { url: string | null; label: string; active: boolean };
type Paginated<T> = { data: T[]; links: PaginationLink[] };

const Index = () => {
    const page = usePage<{ posts: Paginated<BlogPost>; auth?: { user?: (User & { role?: string }) | null }; locale?: SupportedLocale }>();
    const { posts, auth } = page.props;
    const locale = (page.props.locale as SupportedLocale) || 'en';

    return (
        <AppLayout>
            {/* Search removed */}
            <div className="mb-4 flex items-center justify-end">
                {auth?.user && (auth.user.role === 'writer' || auth.user.role === 'admin') && (
                    <Link href="/posts/create" className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90">
                        New Post
                    </Link>
                )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.data.map((post: BlogPost) => (
                    <Card key={post.id}>
                        <CardHeader>
                            <CardTitle>
                                <Link href={`/posts/${post.id}`}>{post.title}</Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">by {post.user?.name ?? 'Unknown'}</div>
                            {post.category && (
                                <div className="mt-1">
                                    <span
                                        className="inline-block rounded-full px-2 py-1 text-xs font-medium text-white"
                                        style={{ backgroundColor: post.category.color }}
                                    >
                                        {post.category.name}
                                    </span>
                                </div>
                            )}
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                <span> 💬 {post.comments_count ?? 0} </span>
                                <span> 👍 {post.likes_count ?? 0}</span>
                                <span> 👎 {post.dislikes_count ?? 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {posts?.links && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                    {posts.links.map((link: PaginationLink, idx: number) =>
                        link.url ? (
                            <Link
                                key={idx}
                                href={link.url}
                                className={`rounded border px-3 py-1 ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            >
                                <span>{getPaginationLabel(link.label, locale)}</span>
                            </Link>
                        ) : (
                            <span key={idx} className="rounded border px-3 py-1 text-muted-foreground opacity-60">
                                <span>{getPaginationLabel(link.label, locale)}</span>
                            </span>
                        ),
                    )}
                </div>
            )}
        </AppLayout>
    );
};

export default Index;

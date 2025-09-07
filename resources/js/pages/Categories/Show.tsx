import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { translate, type SupportedLocale } from '@/lib/i18n';
import type { SharedData } from '@/types';
import { ArrowLeft, Calendar, MessageCircle, Heart, ThumbsDown, User, FileText } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    created_at: string;
    user: {
        name: string;
    };
    category: {
        name: string;
        color: string;
    };
    comments_count: number;
    likes_count: number;
    dislikes_count: number;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color: string;
    created_at: string;
    updated_at: string;
}

interface CategoryShowData {
    category: Category;
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
}

export default function CategoryShow() {
    const page = usePage<SharedData & CategoryShowData>();
    const { category, posts } = page.props;
    const locale = (page.props.locale as SupportedLocale) || 'en';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return translate('admin.categories.today', locale);
        if (diffInDays === 1) return translate('admin.categories.yesterday', locale);
        if (diffInDays < 7) return translate('admin.categories.days_ago', locale).replace('{count}', String(diffInDays));
        if (diffInDays < 30) return translate('admin.categories.weeks_ago', locale).replace('{count}', String(Math.floor(diffInDays / 7)));
        if (diffInDays < 365) return translate('admin.categories.months_ago', locale).replace('{count}', String(Math.floor(diffInDays / 30)));
        return translate('admin.categories.years_ago', locale).replace('{count}', String(Math.floor(diffInDays / 365)));
    };

    return (
        <AppLayout>
            <Head title={category.name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {translate('admin.categories.back', locale)}
                    </Button>
                </div>

                {/* Category Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-full flex-shrink-0"
                                style={{ backgroundColor: category.color }}
                            />
                            <div className="flex-1">
                                <CardTitle className="text-3xl">{category.name}</CardTitle>
                                {category.description && (
                                    <CardDescription className="text-lg mt-2">
                                        {category.description}
                                    </CardDescription>
                                )}
                                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        {translate('admin.categories.posts_count_label', locale).replace('{count}', String(posts.total))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {translate('admin.categories.created_at', locale)} {formatDate(category.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Posts */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{translate('admin.categories.posts_in_category', locale)}</h2>
                        <Badge variant="secondary">
                            {translate('admin.categories.posts_count_label', locale).replace('{count}', String(posts.total))}
                        </Badge>
                    </div>

                    {posts.data.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{translate('admin.categories.no_posts_found', locale)}</h3>
                                <p className="text-muted-foreground mb-4">
                                    {translate('admin.categories.no_posts_in_category', locale)}
                                </p>
                                <Button asChild>
                                    <Link href="/posts/create">
                                        {translate('admin.categories.create_first_post', locale)}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {posts.data.map((post) => (
                                <Card key={post.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    <Link
                                                        href={`/posts/${post.slug}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                {post.excerpt && (
                                                    <CardDescription className="text-base mb-3">
                                                        {post.excerpt}
                                                    </CardDescription>
                                                )}
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        {post.user.name}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatRelativeDate(post.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                                            >
                                                {post.category.name}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                {post.comments_count} {translate('admin.categories.comments', locale)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                {post.likes_count} {translate('admin.categories.likes', locale)}
                                            </div>
                                            {post.dislikes_count > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <ThumbsDown className="w-4 h-4" />
                                                    {post.dislikes_count} {translate('admin.categories.dislikes', locale)}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {translate('admin.categories.pagination_showing', locale)
                                .replace('{from}', String((posts.current_page - 1) * posts.per_page + 1))
                                .replace('{to}', String(Math.min(posts.current_page * posts.per_page, posts.total)))
                                .replace('{total}', String(posts.total))}
                        </div>
                        <div className="flex gap-2">
                            {posts.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && (window.location.href = link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

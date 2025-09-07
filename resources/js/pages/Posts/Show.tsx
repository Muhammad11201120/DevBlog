import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { translate, type SupportedLocale } from '@/lib/i18n';
import type { SharedData } from '@/types';
import type { BlogPost } from '@/types/blog';
import { router, useForm, usePage } from '@inertiajs/react';
import { Calendar, Facebook, Link2, Linkedin, MessageCircle, ThumbsDown, ThumbsUp, Twitter } from 'lucide-react';
import React, { useState } from 'react';
type CommentNode = {
    id: number;
    content: string;
    user_id: number;
    user?: { name?: string } | null;
    likes_count?: number;
    dislikes_count?: number;
    replies?: CommentNode[];
};

const Show = () => {
    const { post, user_like, auth, locale } = usePage<
        SharedData & {
            post: BlogPost & {
                comments: Array<{
                    id: number;
                    content: string;
                    user_id: number;
                    user?: { name?: string } | null;
                    likes_count?: number;
                    dislikes_count?: number;
                    replies?: Array<{
                        id: number;
                        content: string;
                        user_id: number;
                        user?: { name?: string } | null;
                        likes_count?: number;
                        dislikes_count?: number;
                    }>;
                }>;
            };
            user_like?: { is_dislike: boolean } | null;
        }
    >().props;

    const currentLocale = (locale as SupportedLocale) || 'en';

    // removed unused like/dislike/subscribe forms
    const commentForm = useForm({ content: '', parent_id: null as number | null });
    const [replyParentId, setReplyParentId] = useState<number | null>(null);

    const toggleLike = (is_dislike: boolean) => {
        router.post(`/posts/${post.id}/like`, { is_dislike }, { preserveScroll: true });
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.post(`/posts/${post.id}/comments`, {
            onSuccess: () => commentForm.reset('content'),
        });
    };

    const readingTime = Math.max(1, Math.round((post.content?.split(/\s+/)?.length || 0) / 220));

    return (
        <AppLayout>
            <div className="relative">
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute top-10 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 blur-3xl" />
                </div>
                <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
                    <section className="relative mb-4 overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
                        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                            <div className="absolute -top-20 -left-20 size-60 rounded-full bg-fuchsia-500/25 blur-3xl" />
                            <div className="absolute top-1/3 -right-16 size-60 rounded-full bg-sky-500/25 blur-3xl" />
                        </div>
                        <PlaceholderPattern className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 opacity-10" />
                        <Badge className="mb-3 bg-gradient-to-r from-fuchsia-600 to-sky-600 text-white">
                            {translate('post.article', currentLocale)}
                        </Badge>
                        <h1 className="bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 bg-clip-text text-3xl font-semibold tracking-tight text-balance text-transparent sm:text-4xl">
                            {post.title}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                            <span>
                                {translate('post.by', currentLocale)} {post.user?.name ?? translate('post.unknown', currentLocale)}
                            </span>
                            {post.category && (
                                <span
                                    className="inline-block rounded-full px-2 py-1 text-xs font-medium text-white"
                                    style={{ backgroundColor: post.category.color }}
                                >
                                    {post.category.name}
                                </span>
                            )}
                            {post.created_at && (
                                <span className="inline-flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    {translate('post.published_on', currentLocale)} {new Date(post.created_at).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </section>
                    <div className="rounded-xl bg-gradient-to-b from-fuchsia-500/20 via-sky-500/20 to-emerald-500/20 p-[1px]">
                        <Card className="rounded-[calc(theme(borderRadius.lg)-1px)] bg-card/90 p-6 backdrop-blur">
                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </Card>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Button variant={user_like && !user_like.is_dislike ? 'default' : 'outline'} onClick={() => toggleLike(false)}>
                            <ThumbsUp className="size-4 ltr:mr-2 rtl:ml-2" /> {post.likes_count ?? 0}
                        </Button>
                        <Button variant={user_like && user_like.is_dislike ? 'default' : 'outline'} onClick={() => toggleLike(true)}>
                            <ThumbsDown className="size-4 ltr:mr-2 rtl:ml-2" /> {post.dislikes_count ?? 0}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <MessageCircle className="size-4 ltr:mr-2 rtl:ml-2" /> {translate('post.share', currentLocale)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>{translate('post.share_to', currentLocale)}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Twitter className="mr-2 size-4" /> {translate('post.share.twitter', currentLocale)}
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Facebook className="mr-2 size-4" /> {translate('post.share.facebook', currentLocale)}
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Linkedin className="mr-2 size-4" /> {translate('post.share.linkedin', currentLocale)}
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(window.location.href);
                                        } catch (error) {
                                            console.error('Failed to copy link to clipboard', error);
                                        }
                                    }}
                                >
                                    <Link2 className="mr-2 size-4" /> {translate('common.copy_link', currentLocale)}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <section>
                        <h2 className="my-3 bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 bg-clip-text text-xl font-semibold text-transparent">
                            {translate('post.comments', currentLocale)}
                        </h2>
                        <form onSubmit={submitComment} className="space-y-2">
                            <textarea
                                className="w-full rounded border p-2"
                                rows={3}
                                value={commentForm.data.content}
                                onChange={(e) => commentForm.setData('content', e.target.value)}
                                placeholder={translate('post.write_comment', currentLocale)}
                            />
                            <div>
                                <Button type="submit" disabled={commentForm.processing}>
                                    {translate('post.comment', currentLocale)}
                                </Button>
                            </div>
                        </form>
                        <ul className="mt-4 space-y-3">
                            {(post.comments as CommentNode[]).map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    depth={0}
                                    postId={post.id}
                                    authUserId={auth?.user?.id}
                                    replyParentId={replyParentId}
                                    setReplyParentId={setReplyParentId}
                                    commentForm={commentForm}
                                    locale={currentLocale}
                                />
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;

function CommentItem({
    comment,
    depth = 0,
    postId,
    authUserId,
    replyParentId,
    setReplyParentId,
    commentForm,
    locale,
}: {
    comment: CommentNode;
    depth?: number;
    postId: number;
    authUserId?: number;
    replyParentId: number | null;
    setReplyParentId: React.Dispatch<React.SetStateAction<number | null>>;
    commentForm: ReturnType<typeof useForm<{ content: string; parent_id: number | null }>>;
    locale: SupportedLocale;
}) {
    const containerClasses = depth === 0 ? 'rounded-xl border bg-card/70 p-3 backdrop-blur' : 'rounded-lg border bg-card/60 p-2 backdrop-blur';

    return (
        <li className={containerClasses}>
            <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
                <span>{comment.user?.name ?? translate('post.unknown', locale)}</span>
                {authUserId === comment.user_id && (
                    <form
                        method="post"
                        action={`/comments/${comment.id}`}
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.delete(`/comments/${comment.id}`, { preserveScroll: true });
                        }}
                    >
                        <Button type="submit" variant="ghost" size="sm">
                            {translate('post.delete', locale)}
                        </Button>
                    </form>
                )}
            </div>
            <div className="mb-2">{comment.content}</div>
            <div className="flex items-center gap-2 text-sm">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.post(`/comments/${comment.id}/like`, { is_dislike: false }, { preserveScroll: true })}
                >
                    👍 {comment.likes_count ?? 0}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.post(`/comments/${comment.id}/like`, { is_dislike: true }, { preserveScroll: true })}
                >
                    👎 {comment.dislikes_count ?? 0}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setReplyParentId(replyParentId === comment.id ? null : comment.id)}>
                    {translate('post.reply', locale)}
                </Button>
            </div>
            {replyParentId === comment.id && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        commentForm.setData('parent_id', comment.id);
                        commentForm.post(`/posts/${postId}/comments`, {
                            onSuccess: () => {
                                commentForm.reset('content');
                                setReplyParentId(null);
                                commentForm.setData('parent_id', null);
                            },
                        });
                    }}
                    className="mt-2 space-y-2"
                >
                    <textarea
                        className="w-full rounded border p-2"
                        rows={2}
                        value={commentForm.data.content}
                        onChange={(e) => commentForm.setData('content', e.target.value)}
                        placeholder={`${translate('post.reply_to', locale)} ${comment.user?.name ?? translate('post.comment_noun', locale)}...`}
                    />
                    <div className="flex items-center gap-2">
                        <Button type="submit" size="sm" disabled={commentForm.processing}>
                            {translate('post.reply', locale)}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setReplyParentId(null);
                                commentForm.setData('parent_id', null);
                                commentForm.setData('content', '');
                            }}
                        >
                            {translate('post.cancel', locale)}
                        </Button>
                    </div>
                </form>
            )}
            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <ul className="mt-3 space-y-2 border-l pl-3">
                    {comment.replies.map((child) => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            depth={depth + 1}
                            postId={postId}
                            authUserId={authUserId}
                            replyParentId={replyParentId}
                            setReplyParentId={setReplyParentId}
                            commentForm={commentForm}
                            locale={locale}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

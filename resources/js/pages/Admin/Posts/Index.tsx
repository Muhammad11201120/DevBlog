import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { translate, type SupportedLocale } from '@/lib/i18n';
import { getPaginationLabel } from '@/lib/pagination';
import { posts } from '@/routes/simple';
import type { BreadcrumbItem, User } from '@/types';
import type { BlogPost } from '@/types/blog';
import { Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Edit,
    Eye,
    FileText,
    Filter,
    MessageCircle,
    Plus,
    Search,
    ThumbsUp,
    Trash2,
    User as UserIcon,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type PaginationLink = { url: string | null; label: string; active: boolean };
type Paginated<T> = { data: T[]; links: PaginationLink[] };

const AdminPostsIndex = () => {
    const page = usePage<{ posts: Paginated<BlogPost>; auth?: { user?: (User & { role?: string }) | null }; locale?: SupportedLocale }>();
    const { posts: postsData } = page.props;
    const locale = (page.props.locale as SupportedLocale) || 'en';
    const [deletingPost, setDeletingPost] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: translate('breadcrumb.dashboard', locale),
            href: '/dashboard',
        },
        {
            title: translate('breadcrumb.admin_posts', locale),
            href: posts.index(),
        },
    ];

    const handleDelete = (postId: number) => {
        setDeletingPost(postId);
        router.delete(posts.show(postId), {
            onSuccess: () => {
                setDeletingPost(null);
            },
            onError: () => {
                setDeletingPost(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (post: BlogPost) => {
        const now = new Date();
        const publishedAt = post.published_at ? new Date(post.published_at) : null;

        if (publishedAt && publishedAt <= now) {
            return (
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {translate('admin.posts.published', locale)}
                </Badge>
            );
        } else if (publishedAt && publishedAt > now) {
            return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className="mr-1 h-3 w-3" />
                    {translate('admin.posts.scheduled', locale)}
                </Badge>
            );
        } else {
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    <XCircle className="mr-1 h-3 w-3" />
                    {translate('admin.posts.drafts', locale)}
                </Badge>
            );
        }
    };

    const filteredPosts = postsData.data.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'published') {
            const publishedAt = post.published_at ? new Date(post.published_at) : null;
            return matchesSearch && publishedAt && publishedAt <= new Date();
        }
        if (statusFilter === 'draft') {
            return matchesSearch && !post.published_at;
        }
        if (statusFilter === 'scheduled') {
            const publishedAt = post.published_at ? new Date(post.published_at) : null;
            return matchesSearch && publishedAt && publishedAt > new Date();
        }
        return matchesSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{translate('admin.posts.title', locale)}</h1>
                        <p className="text-muted-foreground">{translate('admin.posts.subtitle', locale)}</p>
                    </div>
                    <Link href={posts.create()}>
                        <Button className="w-full md:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {translate('admin.posts.create_new', locale)}
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{translate('admin.posts.total_posts', locale)}</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{postsData.data.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{translate('admin.posts.published', locale)}</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    postsData.data.filter((post) => {
                                        const publishedAt = post.published_at ? new Date(post.published_at) : null;
                                        return publishedAt && publishedAt <= new Date();
                                    }).length
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{translate('admin.posts.drafts', locale)}</CardTitle>
                            <XCircle className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{postsData.data.filter((post) => !post.published_at).length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{translate('admin.posts.scheduled', locale)}</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    postsData.data.filter((post) => {
                                        const publishedAt = post.published_at ? new Date(post.published_at) : null;
                                        return publishedAt && publishedAt > new Date();
                                    }).length
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={translate('admin.posts.search_placeholder', locale)}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder={translate('admin.posts.filter_by_status', locale)} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{translate('admin.posts.filter_all', locale)}</SelectItem>
                                    <SelectItem value="published">{translate('admin.posts.filter_published', locale)}</SelectItem>
                                    <SelectItem value="draft">{translate('admin.posts.filter_draft', locale)}</SelectItem>
                                    <SelectItem value="scheduled">{translate('admin.posts.filter_scheduled', locale)}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                </Card>

                {/* Posts Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{translate('admin.posts.posts_count', locale).replace('{count}', filteredPosts.length.toString())}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                            {translate('admin.posts.post', locale)}
                                        </TableHead>
                                        <TableHead className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                            {translate('admin.posts.author', locale)}
                                        </TableHead>
                                        <TableHead className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                            {translate('admin.posts.category', locale)}
                                        </TableHead>
                                        <TableHead className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                            {translate('admin.posts.status', locale)}
                                        </TableHead>
                                        <TableHead className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                            {translate('admin.posts.engagement', locale)}
                                        </TableHead>
                                        <TableHead className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                            {translate('admin.posts.created', locale)}
                                        </TableHead>
                                        <TableHead className={locale === 'ar' ? 'text-left' : 'text-right'}>
                                            {translate('admin.posts.actions', locale)}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPosts.map((post: BlogPost) => (
                                        <TableRow key={post.id} className="hover:bg-muted/50">
                                            <TableCell className={`max-w-[300px] ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                                                <div className={`space-y-1 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                                                    <Link href={posts.show(post.id)} className="line-clamp-1 font-medium hover:text-primary">
                                                        {post.title}
                                                    </Link>
                                                    {post.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
                                                </div>
                                            </TableCell>
                                            <TableCell className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                                <div className={`flex items-center ${locale === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {post.user?.name ?? translate('admin.posts.unknown_author', locale)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                                {post.category ? (
                                                    <Badge
                                                        variant="secondary"
                                                        style={{ backgroundColor: post.category.color, color: 'white' }}
                                                        className="text-xs"
                                                    >
                                                        {post.category.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        {translate('admin.posts.no_category', locale)}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className={locale === 'ar' ? 'text-right' : 'text-left'}>{getStatusBadge(post)}</TableCell>
                                            <TableCell className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                                <div
                                                    className={`flex items-center ${locale === 'ar' ? 'space-x-4 space-x-reverse' : 'space-x-4'} text-sm text-muted-foreground`}
                                                >
                                                    <div
                                                        className={`flex items-center ${locale === 'ar' ? 'space-x-1 space-x-reverse' : 'space-x-1'}`}
                                                    >
                                                        <MessageCircle className="h-3 w-3" />
                                                        <span>{post.comments_count ?? 0}</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center ${locale === 'ar' ? 'space-x-1 space-x-reverse' : 'space-x-1'}`}
                                                    >
                                                        <ThumbsUp className="h-3 w-3" />
                                                        <span>{post.likes_count ?? 0}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                                <div className="text-sm">
                                                    <div>{formatDate(post.created_at || '')}</div>
                                                    {post.published_at && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {translate('admin.posts.published_on', locale).replace(
                                                                '{date}',
                                                                formatDateTime(post.published_at),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className={locale === 'ar' ? 'text-left' : 'text-right'}>
                                                <div
                                                    className={`flex items-center ${locale === 'ar' ? 'justify-start space-x-2 space-x-reverse' : 'justify-end space-x-2'}`}
                                                >
                                                    <Link href={posts.show(post.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={posts.edit(post.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>{translate('admin.posts.delete_title', locale)}</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {translate('admin.posts.delete_description', locale).replace(
                                                                        '{title}',
                                                                        post.title,
                                                                    )}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    {translate('admin.posts.delete_cancel', locale)}
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(post.id)}
                                                                    className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-red-400"
                                                                    disabled={deletingPost === post.id}
                                                                >
                                                                    {deletingPost === post.id
                                                                        ? translate('admin.posts.deleting', locale)
                                                                        : translate('admin.posts.delete_confirm', locale)}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {postsData?.links && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {postsData.links.map((link: PaginationLink, idx: number) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                                                link.active ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'
                                            }`}
                                        >
                                            {getPaginationLabel(link.label, locale)}
                                        </Link>
                                    ) : (
                                        <span key={idx} className="rounded-md border px-3 py-2 text-sm text-muted-foreground opacity-60">
                                            {getPaginationLabel(link.label, locale)}
                                        </span>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
};

export default AdminPostsIndex;

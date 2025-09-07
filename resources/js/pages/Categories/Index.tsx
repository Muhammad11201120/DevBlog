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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { translate, type SupportedLocale } from '@/lib/i18n';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Edit, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color: string;
    posts_count: number;
    created_at: string;
    updated_at: string;
}

interface CategoriesData {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters?: {
        search?: string;
        sort?: string;
        direction?: string;
    };
}

export default function CategoriesIndex() {
    const page = usePage<SharedData & CategoriesData>();

    // Debug logging (can be removed in production)
    // console.log('Page props:', page.props);
    // console.log('Categories:', page.props.categories);
    // console.log('Filters:', page.props.filters);

    const { categories, filters } = page.props;
    const locale = (page.props.locale as SupportedLocale) || 'en';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: translate('breadcrumb.dashboard', locale),
            href: '/dashboard',
        },
        {
            title: translate('breadcrumb.categories', locale),
            href: '/categories',
        },
    ];

    // Ensure filters is always an object with safe defaults
    // Handle both array and object cases
    const safeFilters = (() => {
        if (!filters) return {};
        if (Array.isArray(filters)) return {};
        if (typeof filters === 'object') return filters;
        return {};
    })();

    // Ensure categories has the expected structure
    const safeCategories =
        categories && typeof categories === 'object'
            ? categories
            : {
                  data: [],
                  current_page: 1,
                  last_page: 1,
                  per_page: 12,
                  total: 0,
                  links: [],
              };

    // Safe property access with additional null checks
    const [search, setSearch] = useState(() => {
        try {
            return safeFilters?.search || '';
        } catch (e) {
            console.error('Error accessing safeFilters.search:', e);
            return '';
        }
    });

    const [sort, setSort] = useState(() => {
        try {
            return safeFilters?.sort || 'created_at';
        } catch (e) {
            console.error('Error accessing safeFilters.sort:', e);
            return 'created_at';
        }
    });

    const [direction, setDirection] = useState(() => {
        try {
            return safeFilters?.direction || 'desc';
        } catch (e) {
            console.error('Error accessing safeFilters.direction:', e);
            return 'desc';
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/categories',
            { search, sort, direction },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSort = (newSort: string) => {
        const newDirection = sort === newSort && direction === 'asc' ? 'desc' : 'asc';
        setSort(newSort);
        setDirection(newDirection);
        router.get(
            '/categories',
            { search, sort: newSort, direction: newDirection },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (categoryId: number) => {
        router.delete(`/categories/${categoryId}`, {
            onSuccess: () => {
                // Success message will be shown via flash message
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translate('admin.categories.title', locale)} />

            <div className={`space-y-6 ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">{translate('admin.categories.title', locale)}</h1>
                        <p className="text-muted-foreground">{translate('admin.categories.subtitle', locale)}</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/categories/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {translate('admin.categories.create_button', locale)}
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>{translate('admin.categories.filters_title', locale)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className={`flex flex-col gap-4 md:flex-row md:items-end ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
                            <div className="flex-1">
                                <label htmlFor="search" className="mb-2 block text-sm font-medium">
                                    {translate('admin.categories.search_label', locale)}
                                </label>
                                <div className="relative">
                                    <Search
                                        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground ${locale === 'ar' ? 'right-3' : 'left-3'}`}
                                    />
                                    <Input
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={translate('admin.categories.search_placeholder', locale)}
                                        className={locale === 'ar' ? 'pr-10' : 'pl-10'}
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-48">
                                <label htmlFor="sort" className="mb-2 block text-sm font-medium">
                                    {translate('admin.categories.sort_by', locale)}
                                </label>
                                <Select value={sort} onValueChange={handleSort}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="created_at">{translate('admin.categories.created_desc', locale)}</SelectItem>
                                        <SelectItem value="name">{translate('admin.categories.name_asc', locale)}</SelectItem>
                                        <SelectItem value="posts_count">{translate('admin.categories.posts_desc', locale)}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" variant="outline" className="w-full md:w-auto">
                                <Search className="mr-2 h-4 w-4" />
                                {translate('admin.categories.search_button', locale)}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categories ({safeCategories.total})</CardTitle>
                        <CardDescription>
                            {safeCategories.total === 0
                                ? translate('admin.categories.no_categories', locale)
                                : `Showing ${safeCategories.data.length} of ${safeCategories.total} categories`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {safeCategories.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">{translate('admin.categories.no_categories', locale)}</h3>
                                <p className="mb-4 text-muted-foreground">{translate('admin.categories.no_categories_description', locale)}</p>
                                <Button asChild>
                                    <Link href="/categories/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        {translate('admin.categories.create_first', locale)}
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Mobile View - Card Layout */}
                                <div className="block space-y-3 md:hidden">
                                    {safeCategories.data.map((category) => (
                                        <Card key={category.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                                    <div className="h-4 w-4 flex-shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate font-medium">{category.name}</div>
                                                        {category.description && (
                                                            <div className="truncate text-sm text-muted-foreground">{category.description}</div>
                                                        )}
                                                        <div className="text-xs text-muted-foreground">/{category.slug}</div>
                                                    </div>
                                                </div>
                                                <div className="ml-2 flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/categories/${category.slug}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/categories/${category.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    {translate('admin.categories.delete_confirm_title', locale)}
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {translate('admin.categories.delete_confirm_message', locale)}
                                                                    <br />
                                                                    <br />
                                                                    {translate('admin.categories.delete_confirm_description', locale)}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    {translate('admin.categories.delete_cancel_button', locale)}
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(category.id)}
                                                                    className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                                                                >
                                                                    {translate('admin.categories.delete_confirm_button', locale)}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Desktop View - Table Layout */}
                                <div className="hidden overflow-x-auto md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{translate('admin.categories.table_category', locale)}</TableHead>
                                                <TableHead className="text-center">{translate('admin.categories.table_posts', locale)}</TableHead>
                                                <TableHead className="text-center">{translate('admin.categories.table_created', locale)}</TableHead>
                                                <TableHead className="text-right">{translate('admin.categories.table_actions', locale)}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {safeCategories.data.map((category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="h-4 w-4 flex-shrink-0 rounded-full"
                                                                style={{ backgroundColor: category.color }}
                                                            />
                                                            <div>
                                                                <div className="font-medium">{category.name}</div>
                                                                {category.description && (
                                                                    <div className="text-sm text-muted-foreground">{category.description}</div>
                                                                )}
                                                                <div className="text-xs text-muted-foreground">/{category.slug}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary">{category.posts_count}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(category.created_at)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/categories/${category.slug}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/categories/${category.id}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-destructive hover:text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            {translate('admin.categories.delete_confirm_title', locale)}
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            {translate('admin.categories.delete_confirm_message', locale)}
                                                                            <br />
                                                                            <br />
                                                                            {translate('admin.categories.delete_confirm_description', locale)}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            {translate('admin.categories.delete_cancel_button', locale)}
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(category.id)}
                                                                            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                                                                        >
                                                                            {translate('admin.categories.delete_confirm_button', locale)}
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
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {safeCategories.last_page > 1 && (
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-center text-sm text-muted-foreground sm:text-left">
                            {translate('admin.categories.pagination_showing', locale)
                                .replace('{from}', String((safeCategories.current_page - 1) * safeCategories.per_page + 1))
                                .replace('{to}', String(Math.min(safeCategories.current_page * safeCategories.per_page, safeCategories.total)))
                                .replace('{total}', String(safeCategories.total))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {safeCategories.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
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

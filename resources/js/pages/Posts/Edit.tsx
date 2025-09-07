import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { translate, type SupportedLocale } from '@/lib/i18n';
import { posts } from '@/routes/simple';
import type { BreadcrumbItem } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import React, { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color: string;
}

export default function Edit() {
    const { post, categories, locale } = usePage<{
        post: {
            id: number;
            title: string;
            slug: string;
            content: string;
            excerpt: string;
            image_url?: string;
            published_at?: string;
            category_id?: number;
        };
        categories: Category[];
        locale?: SupportedLocale;
    }>().props;

    const currentLocale = (locale as SupportedLocale) || 'en';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: translate('breadcrumb.dashboard', currentLocale),
            href: '/dashboard',
        },
        {
            title: translate('breadcrumb.posts', currentLocale),
            href: '/posts',
        },
        {
            title: translate('breadcrumb.edit_post', currentLocale),
            href: posts.edit(post.id),
        },
    ];

    const [imagePreview, setImagePreview] = useState<string | null>(post.image_url || null);
    const form = useForm({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        image: null as File | null,
        published_at: post.published_at ?? '',
        category_id: post.category_id || (null as number | null),
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        form.setData('image', null);
        setImagePreview(null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(posts.show(post.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={posts.index()}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Posts
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Post</h1>
                        <p className="text-muted-foreground">Update your blog post</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="mt-1" />
                                {form.errors.title && <p className="mt-1 text-sm text-destructive">{form.errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className="mt-1" />
                                {form.errors.slug && <p className="mt-1 text-sm text-destructive">{form.errors.slug}</p>}
                            </div>

                            <div>
                                <Label htmlFor="category_id">Category</Label>
                                <select
                                    id="category_id"
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    value={form.data.category_id || ''}
                                    onChange={(e) => form.setData('category_id', e.target.value ? parseInt(e.target.value) : null)}
                                >
                                    <option value="">Select a category</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.category_id && <p className="mt-1 text-sm text-destructive">{form.errors.category_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="published_at">Published At (optional)</Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={form.data.published_at}
                                    onChange={(e) => form.setData('published_at', e.target.value)}
                                    className="mt-1"
                                />
                                {form.errors.published_at && <p className="mt-1 text-sm text-destructive">{form.errors.published_at}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    value={form.data.excerpt}
                                    onChange={(e) => form.setData('excerpt', e.target.value)}
                                    className="mt-1"
                                    rows={4}
                                    placeholder="Brief description of your post..."
                                />
                                {form.errors.excerpt && <p className="mt-1 text-sm text-destructive">{form.errors.excerpt}</p>}
                            </div>

                            <div>
                                <Label>Featured Image</Label>
                                <div className="mt-1">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                                            <div className="text-center">
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-4">
                                                    <label htmlFor="image-upload" className="cursor-pointer">
                                                        <span className="mt-2 block text-sm font-medium text-gray-900">Click to upload an image</span>
                                                        <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 2MB</span>
                                                    </label>
                                                    <input
                                                        id="image-upload"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {form.errors.image && <p className="mt-1 text-sm text-destructive">{form.errors.image}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="content">Content</Label>
                        <div className="mt-1">
                            <RichTextEditor value={form.data.content} onChange={(html) => form.setData('content', html)} />
                        </div>
                        {form.errors.content && <p className="mt-1 text-sm text-destructive">{form.errors.content}</p>}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href={posts.index()}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Updating...' : 'Update Post'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { translate, type SupportedLocale } from '@/lib/i18n';
import type { BreadcrumbItem, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Image as ImageIcon, X } from 'lucide-react';
import React, { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color: string;
}

export default function Create() {
    const { locale, categories } = usePage<SharedData & { categories: Category[] }>().props;
    const currentLocale = (locale as SupportedLocale) || 'en';
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
            title: translate('breadcrumb.create_post', currentLocale),
            href: '/posts/create',
        },
    ];
    const form = useForm({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image: null as File | null,
        published_at: '',
        category_id: null as number | null,
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
        form.post('/posts', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4">
                <div>
                    <label className="block text-sm font-medium">{translate('post.title', currentLocale)}</label>
                    <input
                        className="mt-1 w-full rounded border p-2"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                    />
                    {form.errors.title && <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">{translate('post.slug', currentLocale)}</label>
                    <input className="mt-1 w-full rounded border p-2" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                    {form.errors.slug && <p className="mt-1 text-sm text-red-600">{form.errors.slug}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">{translate('post.excerpt', currentLocale)}</label>
                    <textarea
                        className="mt-1 w-full rounded border p-2"
                        rows={4}
                        value={form.data.excerpt}
                        onChange={(e) => form.setData('excerpt', e.target.value)}
                        placeholder="Brief description of your post..."
                    />
                    {form.errors.excerpt && <p className="mt-1 text-sm text-red-600">{form.errors.excerpt}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Featured Image</label>
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
                                        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {form.errors.image && <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">{translate('post.content', currentLocale)}</label>
                    <RichTextEditor value={form.data.content} onChange={(html) => form.setData('content', html)} />
                    {form.errors.content && <p className="mt-1 text-sm text-red-600">{form.errors.content}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">{translate('post.category', currentLocale)}</label>
                    <select
                        className="mt-1 w-full rounded border p-2"
                        value={form.data.category_id || ''}
                        onChange={(e) => form.setData('category_id', e.target.value ? parseInt(e.target.value) : null)}
                    >
                        <option value="">{translate('post.select_category', currentLocale)}</option>
                        {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {form.errors.category_id && <p className="mt-1 text-sm text-red-600">{form.errors.category_id}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">{translate('post.published_at', currentLocale)}</label>
                    <input
                        type="datetime-local"
                        className="mt-1 w-full rounded border p-2"
                        value={form.data.published_at}
                        onChange={(e) => form.setData('published_at', e.target.value)}
                    />
                    {form.errors.published_at && <p className="mt-1 text-sm text-red-600">{form.errors.published_at}</p>}
                </div>
                <Button type="submit" disabled={form.processing}>
                    {translate('post.create', currentLocale)}
                </Button>
            </form>
        </AppLayout>
    );
}

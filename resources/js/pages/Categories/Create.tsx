import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { translate, type SupportedLocale } from '@/lib/i18n';
import type { SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, FileText, Hash, Palette } from 'lucide-react';
import React, { useEffect } from 'react';

export default function CreateCategory() {
    const page = usePage<SharedData>();
    const locale = (page.props.locale as SupportedLocale) || 'en';
    const form = useForm({
        name: '',
        slug: '',
        description: '',
        color: '#3B82F6',
    });

    // Auto-generate slug from name
    useEffect(() => {
        if (form.data.name && !form.data.slug) {
            const slug = form.data.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            form.setData('slug', slug);
        }
    }, [form, form.data.name]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/categories', {
            onSuccess: () => {
                // Success message will be shown via flash message
            },
        });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setData('name', name);

        // Auto-generate slug if user hasn't manually edited it
        if (
            !form.data.slug ||
            form.data.slug ===
                form.data.name
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim()
        ) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            form.setData('slug', slug);
        }
    };

    return (
        <AppLayout>
            <Head title={translate('admin.categories.create_title', locale)} />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.get('/categories')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Categories
                    </Button>
                </div>

                <div>
                    <h1 className="text-3xl font-bold">{translate('admin.categories.create_title', locale)}</h1>
                    <p className="text-muted-foreground">{translate('admin.categories.create_subtitle', locale)}</p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                        <CardDescription>Fill in the information below to create a new category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    {translate('admin.categories.name', locale)} *
                                </Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={handleNameChange}
                                    placeholder={translate('admin.categories.name_placeholder', locale)}
                                    required
                                    className={form.errors.name ? 'border-destructive' : ''}
                                />
                                {form.errors.name && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{form.errors.name}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Slug Field */}
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-sm font-medium">
                                    {translate('admin.categories.slug', locale)}
                                </Label>
                                <div className="relative">
                                    <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        id="slug"
                                        value={form.data.slug}
                                        onChange={(e) => form.setData('slug', e.target.value)}
                                        placeholder={translate('admin.categories.slug_placeholder', locale)}
                                        className={`pl-10 ${form.errors.slug ? 'border-destructive' : ''}`}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">{translate('admin.categories.slug_help', locale)}</p>
                                {form.errors.slug && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{form.errors.slug}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Description Field */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    {translate('admin.categories.description', locale)}
                                </Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder={translate('admin.categories.description_placeholder', locale)}
                                    rows={3}
                                    className={form.errors.description ? 'border-destructive' : ''}
                                />
                                {form.errors.description && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{form.errors.description}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Color Field */}
                            <div className="space-y-2">
                                <Label htmlFor="color" className="text-sm font-medium">
                                    {translate('admin.categories.color', locale)}
                                </Label>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Palette className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                        <input
                                            id="color"
                                            type="color"
                                            value={form.data.color}
                                            onChange={(e) => form.setData('color', e.target.value)}
                                            className="h-10 w-16 cursor-pointer rounded border p-1"
                                        />
                                    </div>
                                    <Input
                                        value={form.data.color}
                                        onChange={(e) => form.setData('color', e.target.value)}
                                        placeholder="#3B82F6"
                                        className={`flex-1 ${form.errors.color ? 'border-destructive' : ''}`}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">{translate('admin.categories.color_help', locale)}</p>
                                {form.errors.color && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{form.errors.color}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Preview */}
                            {(form.data.name || form.data.color) && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Preview</Label>
                                    <div className="rounded-lg border bg-muted/50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 flex-shrink-0 rounded-full" style={{ backgroundColor: form.data.color }} />
                                            <div>
                                                <div className="font-medium">{form.data.name || 'Category Name'}</div>
                                                {form.data.description && (
                                                    <div className="text-sm text-muted-foreground">{form.data.description}</div>
                                                )}
                                                {form.data.slug && <div className="text-xs text-muted-foreground">/{form.data.slug}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={form.processing} className="flex-1">
                                    <FileText className="mr-2 h-4 w-4" />
                                    {form.processing
                                        ? translate('admin.categories.creating', locale)
                                        : translate('admin.categories.create_button', locale)}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/categories')} disabled={form.processing}>
                                    {translate('admin.categories.cancel', locale)}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/rich-text-editor';
import { translate, type SupportedLocale } from '@/lib/i18n';
import type { SharedData } from '@/types';

export default function Create() {
	const { locale } = usePage<SharedData>().props;
	const currentLocale = (locale as SupportedLocale) || 'en';
	const form = useForm({ title: '', slug: '', content: '', published_at: '' });

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		form.post('/posts');
	};

	return (
		<AppLayout>
			<form onSubmit={submit} className="mx-auto max-w-2xl space-y-4">
				<div>
					<label className="block text-sm font-medium">{translate('post.title', currentLocale)}</label>
					<input className="mt-1 w-full rounded border p-2" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
					{form.errors.title && <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>}
				</div>
				<div>
					<label className="block text-sm font-medium">{translate('post.slug', currentLocale)}</label>
					<input className="mt-1 w-full rounded border p-2" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
					{form.errors.slug && <p className="mt-1 text-sm text-red-600">{form.errors.slug}</p>}
				</div>
				<div>
					<label className="block text-sm font-medium">{translate('post.content', currentLocale)}</label>
					<RichTextEditor value={form.data.content} onChange={(html) => form.setData('content', html)} />
					{form.errors.content && <p className="mt-1 text-sm text-red-600">{form.errors.content}</p>}
				</div>
				<div>
					<label className="block text-sm font-medium">{translate('post.published_at', currentLocale)}</label>
					<input type="datetime-local" className="mt-1 w-full rounded border p-2" value={form.data.published_at} onChange={(e) => form.setData('published_at', e.target.value)} />
					{form.errors.published_at && <p className="mt-1 text-sm text-red-600">{form.errors.published_at}</p>}
				</div>
				<Button type="submit" disabled={form.processing}>{translate('post.create', currentLocale)}</Button>
			</form>
		</AppLayout>
	);
}



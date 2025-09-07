// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { translate, type SupportedLocale } from '@/lib/i18n';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const locale = ((usePage().props as any).locale as SupportedLocale) || 'en';
    return (
        <AuthLayout title={translate('auth.verify.head', locale)} description={translate('auth.verify.description', locale)}>
            <Head title={translate('auth.verify.title', locale)} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {translate('auth.verify.link_sent', locale)}
                </div>
            )}

            <Form {...EmailVerificationNotificationController.store.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {translate('auth.verify.cta', locale)}
                        </Button>

                        <TextLink href={logout()} className="mx-auto block text-sm">
                            {translate('auth.log_out', locale)}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

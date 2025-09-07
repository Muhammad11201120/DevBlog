import ConfirmablePasswordController from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { translate, type SupportedLocale } from '@/lib/i18n';

export default function ConfirmPassword() {
    const locale = ((usePage().props as any).locale as SupportedLocale) || 'en';
    return (
        <AuthLayout
            title={translate('auth.confirm.head', locale)}
            description={translate('auth.confirm.description', locale)}
        >
            <Head title={translate('auth.confirm.title', locale)} />

            <Form {...ConfirmablePasswordController.store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">{translate('auth.password', locale)}</Label>
                            <Input id="password" type="password" name="password" placeholder={translate('auth.password', locale)} autoComplete="current-password" autoFocus />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button className="w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {translate('auth.confirm.cta', locale)}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}

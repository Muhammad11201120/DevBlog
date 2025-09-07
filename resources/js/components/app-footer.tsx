import { translate, type SupportedLocale } from '@/lib/i18n';
import { usePage } from '@inertiajs/react';
import { Github, Mail } from 'lucide-react';

export function AppFooter() {
    const page = usePage<{ locale: SupportedLocale }>();
    const locale = (page.props.locale as SupportedLocale) || 'en';

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { name: 'GitHub', href: 'https://github.com/Muhammad11201120', icon: Github },
        { name: 'Email', href: 'muha.prog.11201120@gmail.com', icon: Mail },
    ];

    return (
        <footer className="border-t bg-background">
            <div className="border-t bg-muted/50">
                <div className="mx-auto max-w-7xl px-6 py-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex flex-col space-y-4 text-center md:flex-row md:items-center md:space-y-0 md:space-x-6">
                        <p className="text-sm text-muted-foreground">{translate('footer.copyright', locale, { year: currentYear })}</p>
                    </div>
                    <div className="mt-6 flex space-x-6 md:mt-0">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={item.name}
                            >
                                <item.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

import { translate, type SupportedLocale } from '@/lib/i18n';

/**
 * Normalizes Laravel pagination link labels and translates special tokens.
 * Laravel returns labels like "&laquo; Previous", "Next &raquo;", and "...".
 */
export function getPaginationLabel(rawLabel: string, locale: SupportedLocale): string {
    const label = decodeHtml(rawLabel).trim();

    // Common patterns from Laravel's paginator
    if (label === '«' || label.toLowerCase().includes('previous')) {
        return translate('pagination.previous', locale);
    }

    if (label === '»' || label.toLowerCase().includes('next')) {
        return translate('pagination.next', locale);
    }

    if (label === '...' || label === '…') {
        return translate('pagination.ellipsis', locale);
    }

    // Fallback: numbers or other labels unchanged
    return label;
}

function decodeHtml(input: string): string {
    // Minimal decode for &laquo; &raquo; &hellip; and numeric entities
    return input
        .replace(/&laquo;|&#171;|&#x00AB;/gi, '«')
        .replace(/&raquo;|&#187;|&#x00BB;/gi, '»')
        .replace(/&hellip;|&#8230;|&#x2026;/gi, '…')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}



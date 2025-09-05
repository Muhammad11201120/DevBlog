<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App as LaravelApp;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supported = ['en', 'ar'];
        $fallback = config('app.fallback_locale', 'en');

        $cookieLocale = $request->cookie('locale');
        $headerLocale = substr((string) $request->getPreferredLanguage($supported), 0, 2) ?: null;
        $locale = in_array($cookieLocale, $supported, true) ? $cookieLocale : ($headerLocale ?: $fallback);

        LaravelApp::setLocale($locale);

        $direction = in_array($locale, ['ar', 'he', 'fa', 'ur'], true) ? 'rtl' : 'ltr';

        View::share('locale', $locale);
        View::share('direction', $direction);

        return $next($request);
    }
}



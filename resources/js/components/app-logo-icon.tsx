import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DevBlog">
            <g fill="currentColor">
                <path d="M10 8h20a2 2 0 0 1 2 2v4H12a2 2 0 0 1-2-2V8z" />
                <rect x="8" y="14" width="32" height="22" rx="3" />
                <circle cx="16" cy="22" r="2.5" />
                <circle cx="24" cy="22" r="2.5" />
                <circle cx="32" cy="22" r="2.5" />
                <path d="M16 28h16a1.5 1.5 0 0 1 0 3H16a1.5 1.5 0 0 1 0-3z" />
            </g>
        </svg>
    );
}

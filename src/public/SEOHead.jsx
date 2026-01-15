import { useEffect } from 'react';

/**
 * SEOHead: Injected metadata for search engines and social sharing.
 * Aligns with the "Personal Institutional System" framing.
 */
export const SEOHead = ({ title, description, path }) => {
    useEffect(() => {
        // 1. Update Title
        const fullTitle = `${title} | IRON - Personal Institutional System`;
        document.title = fullTitle;

        // 2. Update Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = description;

        // 3. Open Graph Tags
        const ogTitle = document.querySelector('meta[property="og:title"]') || createMeta('og:title');
        ogTitle.content = fullTitle;

        const ogDesc = document.querySelector('meta[property="og:description"]') || createMeta('og:description');
        ogDesc.content = description;

        const ogUrl = document.querySelector('meta[property="og:url"]') || createMeta('og:url');
        ogUrl.content = `https://iron.institution${path}`;

    }, [title, description, path]);

    return null;
};

const createMeta = (property) => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
    return meta;
};

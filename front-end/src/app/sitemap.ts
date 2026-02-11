import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://goldservice-egypt.com'

    // Main routes
    const routes = [
        '',
        '/gold',
        '/calculator',
        '/countries',
        '/currencies',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'always' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic routes (Countries)
    const countries = [
        'egypt', 'saudi-arabia', 'united-arab-emirates', 'kuwait',
        'qatar', 'bahrain', 'oman', 'jordan', 'lebanon', 'iraq',
        'yemen', 'palestine', 'algeria', 'morocco'
    ].map((slug) => ({
        url: `${baseUrl}/countries/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.6,
    }))

    return [...routes, ...countries]
}

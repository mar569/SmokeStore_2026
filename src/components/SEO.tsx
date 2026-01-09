import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    image?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    image = "https://smoke-store-shlisselburg.ru/og-image.jpg",
    type = "website",
}) => {
    const fullTitle = `${title} | Smoke Store`;
    const canonicalUrl = canonical ? `https://smoke-store-shlisselburg.ru${canonical}` : undefined;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl || "https://smoke-store-shlisselburg.ru"} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content="ru_RU" />
            <meta property="og:site_name" content="Smoke Store" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
// components/ProductDetail/RecentlyViewed.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';

const RecentlyViewedItem = ({ slug }) => {
    const { data: product, isLoading } = useProduct(slug);

    if (isLoading || !product) return null;

    return (
        <Link to={`/product/${product.slug}`} className="block">
            <div className="bg-card rounded-lg p-2 border border-border hover:shadow-md transition-shadow">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                    {product.product_images && product.product_images.length > 0 ? (
                        <img
                            src={product.product_images[0].url}
                            alt={product.product_images[0].alt_text || product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
                <h4 className="text-sm font-medium truncate">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.price.toLocaleString()} ₽</p>
            </div>
        </Link>
    );
};

interface RecentlyViewedProps {
    currentProductSlug: string;
}

export default function RecentlyViewed({ currentProductSlug }: RecentlyViewedProps) {
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {

        const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(stored);
    }, []);


    const filteredViewed = recentlyViewed.filter(slug => slug !== currentProductSlug).slice(0, 5); // Ограничиваем до 5 товаров

    if (filteredViewed.length === 0) return null;

    return (
        <motion.section
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
        >
            <div className='w-full flex items-center justify-center'>
                <h3 className="font-display text-xl font-bold mb-6 uppercase">
                    Недавно просмотренные товары
                </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredViewed.map((slug) => (
                    <RecentlyViewedItem key={slug} slug={slug} />
                ))}
            </div>
        </motion.section>
    );
}
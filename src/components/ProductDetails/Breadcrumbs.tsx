// components/ProductDetail/Breadcrumbs.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BreadcrumbsProps {
    product: any;
}

export default function Breadcrumbs({ product }: BreadcrumbsProps) {
    return (
        <motion.div
            className="flex items-center gap-2 text-muted-foreground pb-10 flex-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Link to="/catalog" className="hover:text-foreground text-sm">
                Каталог
            </Link>
            <span>/</span>
            {product.categories && (
                <>
                    <Link to={`/catalog?category=${product.categories.slug}`} className="hover:text-foreground text-sm">
                        {product.categories.name}
                    </Link>
                    <span>/</span>
                </>
            )}
            <span className="text-black font-semibold text-base">{product.name}</span>
        </motion.div>
    );
}
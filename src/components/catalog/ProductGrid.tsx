// components/ProductGrid.tsx (без изменений, но убедился в типе hasFilters)
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { Product } from '@/hooks/useProducts';

interface ProductGridProps {
    productsLoading: boolean;
    filteredProducts: Product[];
    hasFilters: boolean;
    clearAllFilters: () => void;
    viewMode: 'grid' | 'list';
}

export default function ProductGrid({
    productsLoading,
    filteredProducts,
    hasFilters,
    clearAllFilters,
    viewMode,
}: ProductGridProps) {

    if (productsLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Товары не найдены</p>
                {hasFilters && (
                    <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                        Сбросить фильтры
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch ${viewMode === 'list' ? 'hidden' : ''}`}>
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
        </div>
    );
}
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { Product, ProductVariant } from '@/hooks/useProducts';

interface ProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
    // Состояние для выбранного варианта
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Автоматическая установка первого варианта при загрузке продукта
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        } else {
            setSelectedVariant(null);
        }
    }, [product]);

    // Логика выбора изображения: приоритет на выбранный вариант, затем product_images, затем первый вариант
    const displayImage = selectedVariant?.image_url ||
        (product.product_images && product.product_images.length > 0 ? product.product_images[0].url :
            (product.variants && product.variants.length > 0 ? product.variants[0].image_url : null));

    // Текущие данные: если выбран вариант, используем его данные, иначе данные продукта
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentCompareAtPrice = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price;
    const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;

    // Расчет скидок: проверяем все варианты и базовый продукт
    const allPrices = product.variants && product.variants.length > 0
        ? product.variants.map(v => ({ price: v.price, compareAtPrice: v.compare_at_price }))
        : [{ price: product.price, compareAtPrice: product.compare_at_price }];
    const discountPercents = allPrices
        .map(p => p.compareAtPrice && p.price < p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0)
        .filter(p => p > 0);
    const maxDiscountPercent = discountPercents.length > 0 ? Math.max(...discountPercents) : 0;
    const hasAnyDiscount = maxDiscountPercent > 0;
    const hasDiscount = currentCompareAtPrice && currentPrice < currentCompareAtPrice; // Для зачеркнутой цены только текущего

    if (viewMode === 'list') {
        return (
            <motion.div
                className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={product.product_images?.[0]?.alt_text || product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>
                </Link>

                <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.slug}`}>
                        <h3 className="font-medium text-lg truncate">{product.name}</h3>
                    </Link>
                    {product.brands && (
                        <p className="text-sm text-muted-foreground">{product.brands.name}</p>
                    )}
                    {product.variants && product.variants.length > 0 ? (
                        <div className="flex gap-1 flex-wrap mt-1">
                            {product.variants.map((variant) => {
                                const variantHasDiscount = variant.compare_at_price && variant.price < variant.compare_at_price;
                                return (
                                    <Button
                                        key={variant.id}
                                        variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedVariant(variant)}
                                        className="text-xs h-6"
                                    >
                                        {variant.weight}г {variant.price}₽
                                        {variantHasDiscount && (
                                            <span className="line-through text-muted-foreground ml-1">
                                                {variant.compare_at_price}₽
                                            </span>
                                        )}
                                    </Button>

                                );
                            })}
                        </div>
                    ) : (
                        product.weight && (
                            <p className="text-sm text-muted-foreground">
                                {product.weight} {product.weight_unit === 'g' ? 'г' : product.weight_unit === 'ml' ? 'мл' : 'шт'}
                            </p>
                        )
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-lg">{currentPrice} ₽</span>
                        {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                                {currentCompareAtPrice} ₽
                            </span>
                        )}
                        {hasAnyDiscount && (
                            <Badge className="bg-destructive text-destructive-foreground text-xs">
                                -{maxDiscountPercent}%
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {currentStock > 0 ? 'В наличии' : 'Нет'}
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Link to={`/product/${product.slug}`} className="block">
                <div className="aspect-square bg-muted relative overflow-hidden">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={product.product_images?.[0]?.alt_text || product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                    )}

                    {hasAnyDiscount && (
                        <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                            -{maxDiscountPercent}%
                        </Badge>
                    )}

                    {product.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                            Хит
                        </Badge>
                    )}
                </div>

                <div className="p-4">
                    {product.brands && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            {product.brands.name}
                        </p>
                    )}

                    <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>

                    {product.variants && product.variants.length > 0 ? (
                        <div className="flex gap-1 flex-wrap mb-2">
                            {product.variants.map((variant) => {
                                const variantHasDiscount = variant.compare_at_price && variant.price < variant.compare_at_price;
                                return (
                                    <Button
                                        key={variant.id}
                                        variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();  // Предотвращаем переход по ссылке при клике на кнопку
                                            setSelectedVariant(variant);
                                        }}
                                        className="text-xs h-6"
                                    >
                                        {variant.weight}г {variant.price}₽
                                        {variantHasDiscount && (
                                            <span className="line-through text-muted-foreground ml-1">
                                                {variant.compare_at_price}₽
                                            </span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    ) : (
                        product.weight && (
                            <p className="text-xs text-muted-foreground mb-2">
                                {product.weight} {product.weight_unit === 'g' ? 'г' : product.weight_unit === 'ml' ? 'мл' : 'шт'}
                            </p>
                        )
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{currentPrice} ₽</span>
                            {hasDiscount && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {currentCompareAtPrice} ₽
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
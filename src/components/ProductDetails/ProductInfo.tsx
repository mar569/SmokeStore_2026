
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert'; // Добавлен Alert для красивого отображения метки
import { Info } from 'lucide-react'; // Иконка для метки

import { Product, ProductVariant } from '@/hooks/useProducts';

interface ProductInfoProps {
    product: Product;
    specific: any;
    renderColor: () => JSX.Element | null;
    renderSpecificDetails: () => JSX.Element | null;
    productVariants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onVariantSelect: (variant: ProductVariant | null) => void;
}

export default function ProductInfo({
    product,
    specific,
    renderColor,
    renderSpecificDetails,
    productVariants,
    selectedVariant,
    onVariantSelect,
}: ProductInfoProps) {
    // Текущие данные: если выбран вариант, используем его данные, иначе данные продукта
    const currentPrice = selectedVariant?.price || product.price;
    const currentCompareAtPrice = selectedVariant?.compare_at_price;
    const currentStock = selectedVariant?.stock_quantity || product.stock_quantity;
    const currentSku = selectedVariant?.sku || product.sku;
    const currentWeight = selectedVariant?.weight || product.weight;

    const hasDiscount = currentCompareAtPrice && currentPrice < currentCompareAtPrice;
    const discountPercent = hasDiscount
        ? Math.round((1 - currentPrice / currentCompareAtPrice!) * 100)
        : 0;

    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >

            {/* Name */}
            <motion.h1
                className="font-display text-xl md:text-2xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {product.name}
            </motion.h1>

            {/* Badges */}
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                {hasDiscount && (
                    <Badge className="bg-destructive text-destructive-foreground">
                        -{discountPercent}%
                    </Badge>
                )}
                {product.is_featured && (
                    <Badge className="bg-primary text-primary-foreground">
                        Хит
                    </Badge>
                )}
                <Badge
                    variant={currentStock > 0 ? 'default' : 'secondary'}
                >
                    {currentStock > 0 ? 'В наличии' : 'Нет'}
                </Badge>
            </motion.div>


            <Separator />

            {/* Specs */}
            <motion.div
                className="grid grid-cols-2 gap-2 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >

                {currentWeight && (
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Вес/Объём/Количество:</span>
                        <span className="font-medium">
                            {currentWeight} {product.weight_unit === 'g' ? 'г' : product.weight_unit === 'ml' ? 'мл' : 'шт'}
                        </span>
                    </div>
                )}
                {product.flavor && (
                    <div>
                        <span className="text-muted-foreground">Вкус:</span>
                        <span className="ml-2 font-medium">{product.flavor}</span>
                    </div>
                )}
                {product.strength && (
                    <div>
                        <span className="text-muted-foreground">Крепость:</span>
                        <span className="ml-2 font-medium">{product.strength}</span>
                    </div>
                )}
                {currentSku && (
                    <div>
                        <span className="text-muted-foreground">Артикул:</span>
                        <span className="ml-2 font-medium">{currentSku}</span>
                    </div>
                )}
            </motion.div>

            <Separator />

            {/* Селектор вариантов */}
            {productVariants.length > 0 && (
                <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <h3 className="font-display text-base md:text-lg font-semibold">Варианты</h3>
                    <div className="flex gap-2 flex-wrap">
                        {productVariants.map((variant) => (
                            <Button
                                key={variant.id}
                                variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onVariantSelect(variant)}
                            >
                                {variant.weight}г
                            </Button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Price */}
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <span className="font-display text-2xl md:text-3xl font-bold">
                    {currentPrice} ₽
                </span>
                {currentCompareAtPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                        {currentCompareAtPrice} ₽
                    </span>
                )}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
            >
                <Alert className="border-primary bg-primary/10 text-muted-foreground dark:border-primary/50 ">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        Дистанционная продажа товара не осуществляется. Доступно покупка в магазине SS лично. Информация на сайте несет информационный характер и не является публичной офертой.
                    </AlertDescription>
                </Alert>
            </motion.div>

            {renderColor()}
            {Object.keys(specific).length > 0 && (
                <>
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <h3 className="font-display text-base md:text-lg font-semibold">Характеристики</h3>
                        {renderSpecificDetails()}
                    </motion.div>
                    <Separator />
                </>
            )}

            {product.description && (
                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                    <div className='text-sm mb-6'>
                        <h2>Варианты оплаты</h2>
                        <p className='text-muted-foreground pt-2'>Наш магазин принимает к оплате наличные и банковские карты.</p>
                    </div>
                    <h3 className="font-display text-base md:text-lg font-semibold">Описание</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                        {product.description}
                    </p>
                </motion.div>
            )}



        </motion.div>
    );
}
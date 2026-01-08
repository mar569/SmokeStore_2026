// ProductImages.tsx (обновленный код с логикой отображения первого изображения варианта)

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductVariant } from '@/hooks/useProducts';  // Добавлен импорт

interface ProductImagesProps {
    images: any[];
    productName: string;
    selectedVariant?: ProductVariant | null;  // Новое: выбранный вариант
    productVariants?: ProductVariant[];  // Новое: все варианты продукта
}

export default function ProductImages({ images, productName, selectedVariant, productVariants }: ProductImagesProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const goToPrev = () => {
        setSelectedImageIndex((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1));
    };

    const goToNext = () => {
        setSelectedImageIndex((prev) => (prev + 1) % (images?.length || 1));
    };

    const goToSlide = (index: number) => {
        setSelectedImageIndex(index);
    };

    // Логика: если выбран вариант с image_url, используем его; иначе — изображение первого варианта, если есть; иначе — основные изображения
    const firstVariantImage = productVariants?.[0]?.image_url;
    const displayImages = selectedVariant?.image_url
        ? [{ url: selectedVariant.image_url }]
        : firstVariantImage
            ? [{ url: firstVariantImage }]
            : images;
    const currentImage = displayImages?.[selectedImageIndex];

    return (
        <motion.div
            className="space-y-4 max-w-[90%] mx-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            {displayImages && displayImages.length > 1 ? (
                <div className="relative overflow-hidden rounded-xl ">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
                    >
                        {displayImages.map((image, index) => (
                            <div key={index} className="min-w-full aspect-square bg-muted">
                                <img
                                    src={image.url}
                                    alt={image.alt_text || productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {displayImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === selectedImageIndex ? 'bg-card' : 'bg-card/40'}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="aspect-square rounded-xl overflow-hidden border border-border bg-muted md:max-w-[80%]">
                    {currentImage ? (
                        <motion.img
                            src={currentImage.url}
                            alt={currentImage.alt_text || productName}
                            className="md:h-full md:w-full object-cover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-24 w-24 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
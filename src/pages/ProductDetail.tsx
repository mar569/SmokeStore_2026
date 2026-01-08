// ProductDetail.tsx (обновленный с использованием FlaskDisplay и BowlDisplay)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import SearchModal from '@/components/SearchModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useProduct, Product, ProductVariant } from '@/hooks/useProducts';
import { useProductImages } from '@/hooks/useProductImages';

import {
  TobaccoDisplay,
  HookahDisplay,
  CoalDisplay,
  FlaskDisplay, // Заменили ColbaDisplay на FlaskDisplay
  BowlDisplay, // Добавили BowlDisplay
  GeneralDisplay,
  AccessoryDisplay,
  AdapterDisplay,
  ChargerDisplay,
  HoseDisplay,
  LiquidDisplay,
  MouthpieceDisplay,
  StandDisplay,
  ToolDisplay,
  VapeDisplay,
} from '@/components/DisplayGoods';
import { ElectronicalDisplay } from '@/components/DisplayGoods/ElectronicalDisplay';
import Breadcrumbs from '@/components/ProductDetails/Breadcrumbs';
import ProductImages from '@/components/ProductDetails/ProductImages';
import ProductInfo from '@/components/ProductDetails/ProductInfo';
import RecentlyViewed from '@/components/ProductDetails/RecentlyViewed';

// Новый хук для получения вариантов продукта (того же бренда, вкуса, но разных весов)
import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';

const useProductVariants = (product: Product | undefined): ProductVariant[] => {
  const { data: allProducts } = useProducts({}); // Получаем все продукты (можно оптимизировать фильтром по бренду)

  return useMemo(() => {
    if (!product || !allProducts || product.categories?.product_type !== 'tobacco') return [];

    const currentFlavor = product.specific ? JSON.parse(product.specific).flavor_type : null;
    if (!currentFlavor) return [];

    // Фильтруем продукты: тот же бренд, вкус, но другой вес, активные
    const variants = allProducts.filter(p =>
      p.brand_id === product.brand_id &&
      p.specific && JSON.parse(p.specific).flavor_type === currentFlavor &&
      p.weight !== product.weight &&
      p.is_active
    );

    // Группируем по весу (чтобы избежать дубликатов)
    const uniqueVariants = variants.reduce((acc, p) => {
      if (!acc.find(v => v.weight === p.weight)) acc.push(p);
      return acc;
    }, [] as Product[]);

    return uniqueVariants.sort((a, b) => (a.weight || 0) - (b.weight || 0));
  }, [product, allProducts]);
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: product, isLoading, error } = useProduct(slug || '');
  const { data: images } = useProductImages(product?.id || '');

  // Получаем варианты продукта (другие продукты того же бренда и вкуса)
  const productVariants = useProductVariants(product);

  // Новое: состояние для выбранного варианта (из product.variants)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // При загрузке продукта устанавливаем первый вариант или базовый
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null); // Базовый продукт
    }
  }, [product]);

  // Функция для выбора варианта
  const handleVariantSelect = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
  };

  // Прокрутка в верх при изменении slug (переходе к новому товару)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Добавляем товар в недавно просмотренные при загрузке
  useEffect(() => {
    if (product?.slug) {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updated = [product.slug, ...stored.filter(s => s !== product.slug)].slice(0, 10); // Храним до 10 товаров
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    }
  }, [product?.slug]);

  let specific: any = {}; // Можно оставить any для specific, так как это JSON-строка, или типизировать отдельно
  try {
    specific = product?.specific ? JSON.parse(product.specific) : {};
  } catch (error) {
    console.error('Ошибка парсинга specific:', error);
    specific = {};
  }

  const renderColor = () => {
    const isColorProduct = ['hookah', 'vape', 'mouthpiece', 'flask', 'bowl'].includes(product?.categories?.product_type); // Добавили 'bowl'
    if (!isColorProduct || !product?.color) return null;

    return (
      <motion.div
        className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
            style={{ backgroundColor: product.color.toLowerCase() === 'другой' ? '#ccc' : product.color }}
          ></div>
          <span className="text-sm font-medium">
            Цвет: {product.color}
          </span>
          {product.has_multiple_colors && (
            <Badge variant="outline" className="text-xs">
              Доступно в нескольких цветах
            </Badge>
          )}
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center pt-16 pb-64">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </motion.div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <motion.main
          className="container mx-auto px-4 py-8 text-center pt-16 pb-64"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-xl md:text-2xl font-bold mb-4">Товар не найден</h1>
          <Link to="/catalog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в каталог
            </Button>
          </Link>
        </motion.main>
      </div>
    );
  }

  const renderSpecificDetails = () => {
    const productType = product.categories?.product_type;

    switch (productType) {
      case 'tobacco':
        return <TobaccoDisplay specific={specific} />;
      case 'hookah':
        return <HookahDisplay specific={specific} />;
      case 'coal':
        return <CoalDisplay specific={specific} />;
      case 'flask':
        return <FlaskDisplay specific={specific} />; // Используем FlaskDisplay для колб
      case 'bowl':
        return <BowlDisplay specific={specific} />; // Используем BowlDisplay для чаш
      case 'accessory':
        return <AccessoryDisplay specific={specific} />;
      case 'adapter':
        return <AdapterDisplay specific={specific} />;
      case 'charger':
        return <ChargerDisplay specific={specific} />;
      case 'hose':
        return <HoseDisplay specific={specific} />;
      case 'liquid':
        return <LiquidDisplay specific={specific} />;
      case 'mouthpiece':
        return <MouthpieceDisplay specific={specific} />;
      case 'stand':
        return <StandDisplay specific={specific} />;
      case 'tool':
        return <ToolDisplay specific={specific} />;
      case 'vape':
        return <VapeDisplay specific={specific} />;
      case 'electronic':
        return <ElectronicalDisplay specific={specific} />;
      case 'general':
        return <GeneralDisplay specific={specific} />;
      case 'other':
        return <GeneralDisplay specific={specific} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <motion.main
        className="container mx-auto py-8 pt-10 gap-2 pb-10 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs product={product} />

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-2">
          <ProductImages
            images={images || []}
            productName={product.name}
            selectedVariant={selectedVariant}
            productVariants={product?.variants || []} // Передаем варианты продукта
          />

          <ProductInfo
            product={product}
            specific={specific}
            renderColor={renderColor}
            renderSpecificDetails={renderSpecificDetails}
            productVariants={product?.variants || []} // Передаем варианты из продукта
            selectedVariant={selectedVariant}
            onVariantSelect={handleVariantSelect}
          />
        </div>

        <RecentlyViewed currentProductSlug={product.slug} />
      </motion.main>
    </div>
  );
};

export default ProductDetail;
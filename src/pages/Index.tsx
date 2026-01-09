// Index.tsx (исправленный с корректными ссылками для навигации в каталог)
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import AgeVerificationModal from '@/components/AgeVerificationModal';
import PromoCarousel from '@/components/PromoCarousel';
import CategoryGrid from '@/components/CategoryGrid';
import QuickActions from '@/components/QuickActions';
import SearchModal from '@/components/SearchModal';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryCounts } from '@/hooks/useCategoryFilters';
import { useProducts } from '@/hooks/useProducts';
import { useBrands } from '@/hooks/useBrands'; // Добавлено для получения брендов

const Index = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: categories } = useCategories();
  const { data: categoryCounts } = useCategoryCounts(categories);
  const { data: products } = useProducts({});
  const { data: brands } = useBrands(); // Получаем бренды

  const hookahsCategory = categories?.find(cat => cat.slug === 'hookahs');
  const hookahsCount = hookahsCategory ? (categoryCounts?.[hookahsCategory.id] || 0) : 0;

  const tobaccoCount = useMemo(() => {
    if (!products || !categories) return 0;
    return products.filter(product => {
      const cat = categories.find(c => c.id === product.category_id);
      return cat?.product_type === 'tobacco' && product.is_active;
    }).length;
  }, [products, categories]);

  // Фильтрация брендов для кальянов (product_type === 'hookah')
  const hookahBrands = useMemo(() => {
    if (!brands || !categories) return [];
    const hookahCategories = categories.filter(cat => cat.product_type === 'hookah');
    const hookahCategoryIds = hookahCategories.map(cat => cat.id);
    return brands.filter(brand => brand.category_id && hookahCategoryIds.includes(brand.category_id));
  }, [brands, categories]);

  // Фильтрация брендов для табаков (product_type === 'tobacco')
  const tobaccoBrands = useMemo(() => {
    if (!brands || !categories) return [];
    const tobaccoCategories = categories.filter(cat => cat.product_type === 'tobacco');
    const tobaccoCategoryIds = tobaccoCategories.map(cat => cat.id);
    return brands.filter(brand => brand.category_id && tobaccoCategoryIds.includes(brand.category_id));
  }, [brands, categories]);

  return (
    <div className="min-h-screen bg-background container ">
      <AgeVerificationModal />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <motion.main
        className="h-screen overflow-y-auto py-12 space-y-8 scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Остальной код без изменений */}
        <motion.div
          className="bg-muted rounded-xl p-4 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>
            Информация предназначена для покупателей старше 18 лет.
            Дистанционная продажа кальянов, табачной и никотинсодержащей продукции на сайте не осуществляется.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PromoCarousel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="font-display text-2xl font-bold mb-6 uppercase">
            Каталог товаров
          </h2>
          <CategoryGrid />
        </motion.section>

        <motion.section
          className="bg-card rounded-2xl p-6 border border-border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold uppercase">
              Кальяны
            </h2>
            <span className="text-muted-foreground text-sm">({hookahsCount} товаров)</span>
          </div>

          <div className="flex flex-wrap gap-4">
            {hookahBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              >
                <Link
                  to={`/catalog?category=hookahs&brand=${encodeURIComponent(brand.slug)}`}  // Оставлено как есть, поскольку 'hookahs' - это category slug
                  className="px-4 py-2 bg-muted rounded-lg text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {brand.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="bg-card rounded-2xl p-6 border border-border"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold uppercase">
              Табак для кальяна
            </h2>
            <span className="text-muted-foreground text-sm">({tobaccoCount} товаров)</span>
          </div>

          <div className="flex flex-wrap gap-4">
            {tobaccoBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
              >
                <Link
                  to={`/catalog?product_type=tobacco&brand=${encodeURIComponent(brand.slug)}`}  // Исправлено: изменено с category=tobacco на product_type=tobacco для корректного совпадения с логикой CategoryGrid и Catalog.tsx (tobacco - это product_type, а не category slug)
                  className="px-4 py-2 bg-muted rounded-lg text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {brand.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Карта магазина */}
        <motion.section
          className="bg-card rounded-2xl p-2 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="aspect-video bg-muted rounded-xl overflow-hidden">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=31.032922%2C59.945907&mode=poi&poi%5Bpoint%5D=31.032692%2C59.945786&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D226903573250&z=19.59"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта магазина"
            />
          </div>
          <div className="mt-4">
            <div className="p-2 text-center bg-muted rounded-xl">
              <p className="font-semibold">ТЦ "Акватория"</p>
              <p className="text-sm text-muted-foreground">Шлиссельбург, ул. Жука, д. 4</p>
              <p className="text-sm text-muted-foreground">Ежедневно 10:00 - 22:00</p>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Index;
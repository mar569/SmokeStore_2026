// Catalog.tsx (исправленный с добавлением фильтра по productType в filteredProducts)
import { useState, useMemo, useEffect } from 'react'; // Добавлен useEffect
import SearchModal from '@/components/SearchModal';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useCategoryIds, useCategoryCounts } from '@/hooks/useCategoryFilters';
import { useFilters } from '@/hooks/useFilters';
import FiltersSidebar from '@/components/catalog/FiltersSidebar';
import CatalogToolbar from '@/components/catalog/CatalogToolbar';
import ProductGrid from '@/components/catalog/ProductGrid';

type SortOption = 'name' | 'price_asc' | 'price_desc';

const Catalog = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showAllFlavors, setShowAllFlavors] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllWeights, setShowAllWeights] = useState(false);

  // Состояния для гармошки
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isFlavorsOpen, setIsFlavorsOpen] = useState(true);
  const [isColorsOpen, setIsColorsOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const {
    priceRange,
    setPriceRange,
    selectedBrands,
    selectedWeights,
    selectedFlavors,
    selectedColors,
    showAllBrands,
    setShowAllBrands,
    clearFilters,
    handleBrandToggle,
    handleWeightToggle,
    handleFlavorToggle,
    handleColorToggle,
  } = useFilters();

  const categorySlug = searchParams.get('category') || '';
  const brandSlug = searchParams.get('brand') || '';
  const searchQuery = searchParams.get('search') || '';
  const productType = searchParams.get('product_type') || undefined; // Исправлено: добавлено undefined

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const categoryIds = useCategoryIds(categories, categorySlug);
  const { data: categoryCounts } = useCategoryCounts(categories);

  const { data: products, isLoading: productsLoading } = useProducts({
    search: searchQuery,
    categoryIds,
    brandSlug,

  });

  const currentProductType = productType || categories?.find(c => c.slug === categorySlug)?.product_type;

  const filteredBrands = useMemo(() => {
    if (!brands || !categories) return [];
    if (!currentProductType) return brands;
    const relevantCategories = categories.filter(c => c.product_type === currentProductType);
    const relevantCategoryIds = relevantCategories.map(c => c.id);
    return brands.filter(b => b.category_id && relevantCategoryIds.includes(b.category_id));
  }, [brands, categories, currentProductType]);

  const displayedBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 6);

  // Обновлено: уникальные вкусы из specific.flavor_type для табака и электронных сигарет
  // Fix: Добавлена проверка типа для безопасности
  const uniqueFlavors = useMemo(() => {
    const flavors = new Set<string>();
    products?.forEach(product => {
      const cat = categories?.find(c => c.id === product.category_id);
      if ((cat?.product_type === 'tobacco' || cat?.product_type === 'electronic') && product.specific) {
        try {
          const specific = JSON.parse(product.specific);
          if (specific.flavor_type && typeof specific.flavor_type === 'string') {
            flavors.add(specific.flavor_type);
          }
        } catch (error) {
          console.error('Ошибка парсинга specific для вкусов:', error);
        }
      }
    });
    return Array.from(flavors).sort();
  }, [products, categories]);


  const uniqueColors = useMemo(() => {
    const colors = new Set<string>();
    products?.forEach(product => {
      const cat = categories?.find(c => c.id === product.category_id);
      if (cat?.product_type === 'hookah' && product.color && typeof product.color === 'string') {
        colors.add(product.color);
      }
    });
    return Array.from(colors).sort();
  }, [products, categories]);


  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const filtered = products.filter((product) => {
      if (!product.is_active) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand_id || '')) return false;
      // Фильтр по цене: product.price уже минимальная для товаров с вариантами
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      // Добавлено: фильтр по productType для корректной фильтрации товаров по типу (например, tobacco или electronic)
      if (currentProductType) {
        const cat = categories?.find(c => c.id === product.category_id);
        if (cat?.product_type !== currentProductType) return false;
      }
      // Фильтр по вкусам (для табака и электронных сигарет): учитываем варианты (если у них есть specific)
      if ((currentProductType === 'tobacco' || currentProductType === 'electronic') && selectedFlavors.length > 0) {
        let hasMatchingFlavor = false;
        try {
          const productSpecific = product.specific ? JSON.parse(product.specific) : {};
          if (productSpecific.flavor_type && selectedFlavors.includes(productSpecific.flavor_type)) {
            hasMatchingFlavor = true;
          }
          // Проверяем варианты, если они имеют свое specific
          if (!hasMatchingFlavor && product.variants && product.variants.length > 0) {
            hasMatchingFlavor = product.variants.some(v => {
              if (!v.specific) return false;
              const variantSpecific = JSON.parse(v.specific);
              return variantSpecific.flavor_type && selectedFlavors.includes(variantSpecific.flavor_type);
            });
          }
        } catch (error) {
          console.error('Ошибка парсинга specific для фильтра вкусов:', error);
          return false;
        }
        if (!hasMatchingFlavor) return false;
      }
      // Фильтр по цветам для кальяна: учитываем варианты (если у них есть color)
      if (currentProductType === 'hookah' && selectedColors.length > 0) {
        const hasMatchingColor = product.variants && product.variants.length > 0
          ? product.variants.some(v => v.color && selectedColors.includes(v.color))
          : (product.color && selectedColors.includes(product.color));
        if (!hasMatchingColor) return false;
      }
      return true;
    });

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price); // product.price уже минимальная
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price); // product.price уже минимальная
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedBrands, priceRange, sortBy, currentProductType, selectedFlavors, selectedColors, categories]); // Добавлено categories в зависимости

  const mainCategories = categories?.filter(c => !c.parent_id) || [];

  const clearAllFilters = () => {
    setSearchParams({});
    clearFilters();
  };

  const hasFilters = !!(categorySlug || brandSlug || searchQuery || productType || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000 || selectedWeights.length > 0 || selectedFlavors.length > 0 || selectedColors.length > 0);

  const electronicCount = useMemo(() => {
    if (!products || !categories) return 0;
    return products.filter(product => {
      const cat = categories.find(c => c.id === product.category_id);
      return cat?.product_type === 'electronic' && product.is_active;
    }).length;
  }, [products, categories]);

  const tobaccoCount = useMemo(() => {
    if (!products || !categories) return 0;
    return products.filter(product => {
      const cat = categories.find(c => c.id === product.category_id);
      return cat?.product_type === 'tobacco' && product.is_active;
    }).length;
  }, [products, categories]);

  return (
    <div className="min-h-screen bg-background">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display md:text-3xl text-lg font-bold uppercase">
            {categorySlug ? mainCategories.find(c => c.slug === categorySlug)?.name : 'Каталог'}
            {brandSlug && ` - ${brands?.find(b => b.slug === brandSlug)?.name}`}
            {searchQuery && ` - "${searchQuery}"`}
            {productType && ` - ${productType === 'electronic' ? 'Электронные сигареты' : productType === 'tobacco' ? 'Табак для кальяна' : productType}`}
          </h1>
          <p className="text-muted-foreground md:text-lg text-[12px]">
            {filteredProducts.length} товаров
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar
            filtersCollapsed={filtersCollapsed}
            setFiltersCollapsed={setFiltersCollapsed}
            hasFilters={hasFilters}
            clearAllFilters={clearAllFilters}
            categorySlug={categorySlug}
            productType={productType}
            currentProductType={currentProductType}
            categoryCounts={categoryCounts}
            electronicCount={electronicCount}
            tobaccoCount={tobaccoCount}
            filteredBrands={filteredBrands}
            displayedBrands={displayedBrands}
            showAllBrands={showAllBrands}
            setShowAllBrands={setShowAllBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedFlavors={selectedFlavors}
            handleFlavorToggle={handleFlavorToggle}
            selectedColors={selectedColors}
            handleColorToggle={handleColorToggle}
            selectedBrands={selectedBrands}
            handleBrandToggle={handleBrandToggle}
            uniqueFlavors={uniqueFlavors}
            uniqueColors={uniqueColors}
            showAllFlavors={showAllFlavors}
            setShowAllFlavors={setShowAllFlavors}
            showAllColors={showAllColors}
            setShowAllColors={setShowAllColors}
            isCategoriesOpen={isCategoriesOpen}
            setIsCategoriesOpen={setIsCategoriesOpen}
            isFlavorsOpen={isFlavorsOpen}
            setIsFlavorsOpen={setIsFlavorsOpen}
            isColorsOpen={isColorsOpen}
            setIsColorsOpen={setIsColorsOpen}
            isBrandsOpen={isBrandsOpen}
            setIsBrandsOpen={setIsBrandsOpen}
            isPriceOpen={isPriceOpen}
            setIsPriceOpen={setIsPriceOpen}
          />

          <div className="flex-1">
            <CatalogToolbar
              filtersCollapsed={filtersCollapsed}
              setFiltersCollapsed={setFiltersCollapsed}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            <ProductGrid
              productsLoading={productsLoading}
              filteredProducts={filteredProducts}
              hasFilters={hasFilters}
              clearAllFilters={clearAllFilters}
              viewMode={viewMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;
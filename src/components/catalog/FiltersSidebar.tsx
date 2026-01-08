import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useCategoryCounts } from '@/hooks/useCategoryFilters';

// Предполагаемый интерфейс Brand (добавьте его в ваш проект, если нет)
interface Brand {
    id: string;
    name: string;
    slug: string;
    category_id?: string;
}

interface FiltersSidebarProps {
    filtersCollapsed: boolean;
    setFiltersCollapsed: (collapsed: boolean) => void;
    hasFilters: boolean;
    clearAllFilters: () => void;
    categorySlug: string;
    productType: string;
    currentProductType: string | undefined;
    categoryCounts: Record<string, number> | undefined;
    electronicCount: number;
    tobaccoCount: number;
    filteredBrands: Brand[];
    displayedBrands: Brand[];
    showAllBrands: boolean;
    setShowAllBrands: (show: boolean) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    selectedFlavors: string[];
    handleFlavorToggle: (flavor: string) => void;
    selectedColors: string[];
    handleColorToggle: (color: string) => void;
    selectedBrands: string[];
    handleBrandToggle: (brandId: string) => void;
    uniqueFlavors: string[];
    uniqueColors: string[];
    showAllFlavors: boolean;
    setShowAllFlavors: (show: boolean) => void;
    showAllColors: boolean;
    setShowAllColors: (show: boolean) => void;
    // Новые пропсы для гармошки (убрал weights)
    isCategoriesOpen: boolean;
    setIsCategoriesOpen: (open: boolean) => void;
    isFlavorsOpen: boolean;
    setIsFlavorsOpen: (open: boolean) => void;
    isColorsOpen: boolean;
    setIsColorsOpen: (open: boolean) => void;
    isBrandsOpen: boolean;
    setIsBrandsOpen: (open: boolean) => void;
    isPriceOpen: boolean;
    setIsPriceOpen: (open: boolean) => void;
}

export default function FiltersSidebar({
    filtersCollapsed,
    setFiltersCollapsed,
    hasFilters,
    clearAllFilters,
    categorySlug,
    productType,
    currentProductType,
    categoryCounts,
    electronicCount,
    tobaccoCount,
    filteredBrands,
    displayedBrands,
    showAllBrands,
    setShowAllBrands,
    priceRange,
    setPriceRange,
    selectedFlavors,
    handleFlavorToggle,
    selectedColors,
    handleColorToggle,
    selectedBrands,
    handleBrandToggle,
    uniqueFlavors,
    uniqueColors,
    showAllFlavors,
    setShowAllFlavors,
    showAllColors,
    setShowAllColors,
    // Новые пропсы (убрал weights)
    isCategoriesOpen,
    setIsCategoriesOpen,
    isFlavorsOpen,
    setIsFlavorsOpen,
    isColorsOpen,
    setIsColorsOpen,
    isBrandsOpen,
    setIsBrandsOpen,
    isPriceOpen,
    setIsPriceOpen,
}: FiltersSidebarProps) {
    const { data: categories } = useCategories();
    const mainCategories = categories?.filter(c => !c.parent_id) || [];

    // Исправлено: всегда показывать все mainCategories, независимо от productType
    const categoriesToShow = useMemo(() => {
        return mainCategories; // Все главные категории
    }, [mainCategories]);

    const displayedFlavors = showAllFlavors ? uniqueFlavors : uniqueFlavors.slice(0, 6);
    const displayedColors = showAllColors ? uniqueColors : uniqueColors.slice(0, 6);

    return (
        <aside className="lg:w-64 flex-shrink-0 block">
            <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-6 z-10 bg-card border border-border rounded-full shadow-md md:hidden"
                onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            >
                <ChevronLeft className={`h-4 w-4 transition-transform ${filtersCollapsed ? 'rotate-180' : ''}`} />
            </Button>
            <div className={`bg-card rounded-2xl p-6 border border-border sticky top-24 transition-transform duration-300 ${filtersCollapsed ? '-translate-x-56 md:translate-x-0' : ''}`}>
                <h2 className="font-display text-xl font-bold mb-4 uppercase">Фильтры</h2>

                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="mb-4 text-muted-foreground">
                        Сбросить
                    </Button>
                )}

                {/* Категории: теперь всегда показываются все mainCategories */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="w-full justify-between p-1 h-auto font-semibold mb-3"
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                        Категории
                        {isCategoriesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isCategoriesOpen ? 'max-h-96' : 'max-h-0'}`}>
                        {/* Кнопка "Все категории" в начале */}
                        <Link to="/catalog" className={`block py-1 text-sm hover:text-primary transition-colors ${!categorySlug && !productType ? 'text-primary font-semibold' : ''}`}>
                            Все категории
                        </Link>
                        {categoriesToShow.map((cat) => (
                            <Link key={cat.id} to={`/catalog?category=${cat.slug}`} className={`block py-1 text-sm hover:text-primary transition-colors ${categorySlug === cat.slug ? 'text-primary font-semibold' : ''}`}>
                                {cat.name} ({categoryCounts?.[cat.id] || 0})
                            </Link>
                        ))}
                        {/* Убраны manual links, так как все категории теперь в categoriesToShow */}
                    </div>
                </div>

                {/* Вкусы для табака */}
                {currentProductType === 'tobacco' && (
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-between p-1 h-auto font-semibold mb-3"
                            onClick={() => setIsFlavorsOpen(!isFlavorsOpen)}
                        >
                            Вкусы табака
                            {isFlavorsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isFlavorsOpen ? 'max-h-96' : 'max-h-0'}`}>
                            {displayedFlavors.map((flavor) => (
                                <label key={flavor} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <Checkbox checked={selectedFlavors.includes(flavor)} onCheckedChange={() => handleFlavorToggle(flavor)} />
                                    {flavor}
                                </label>
                            ))}
                            {uniqueFlavors.length > 6 && (
                                <Button variant="ghost" size="sm" onClick={() => setShowAllFlavors(!showAllFlavors)} className="mt-2 text-primary">
                                    {showAllFlavors ? 'Меньше ↑' : 'Все вкусы ↓'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Вкусы для электронных сигарет */}
                {currentProductType === 'electronic' && (
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-between p-1 h-auto font-semibold mb-3"
                            onClick={() => setIsFlavorsOpen(!isFlavorsOpen)}
                        >
                            Вкусы жидкостей
                            {isFlavorsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isFlavorsOpen ? 'max-h-96' : 'max-h-0'}`}>
                            {displayedFlavors.map((flavor) => (
                                <label key={flavor} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <Checkbox checked={selectedFlavors.includes(flavor)} onCheckedChange={() => handleFlavorToggle(flavor)} />
                                    {flavor}
                                </label>
                            ))}
                            {uniqueFlavors.length > 6 && (
                                <Button variant="ghost" size="sm" onClick={() => setShowAllFlavors(!showAllFlavors)} className="mt-2 text-primary">
                                    {showAllFlavors ? 'Показать меньше' : 'Показать все'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Цвета для кальяна и чаш */}
                {(currentProductType === 'hookah' || currentProductType === 'bowl') && (
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-between p-1 h-auto font-semibold mb-3"
                            onClick={() => setIsColorsOpen(!isColorsOpen)}
                        >
                            Цвета {currentProductType === 'hookah' ? 'кальяна' : 'чаш'}
                            {isColorsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isColorsOpen ? 'max-h-96' : 'max-h-0'}`}>
                            {displayedColors.map((color) => (
                                <label key={color} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <Checkbox checked={selectedColors.includes(color)} onCheckedChange={() => handleColorToggle(color)} />
                                    {color}
                                </label>
                            ))}
                            {uniqueColors.length > 6 && (
                                <Button variant="ghost" size="sm" onClick={() => setShowAllColors(!showAllColors)} className="mt-2 text-primary">
                                    {showAllColors ? 'Показать меньше' : 'Показать все'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Бренды */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="w-full justify-between p-1 h-auto font-semibold mb-3"
                        onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                    >
                        Бренды
                        {isBrandsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <div className={`space-y-2 overflow-hidden transition-all duration-300 ${isBrandsOpen ? 'max-h-96' : 'max-h-0'}`}>
                        {displayedBrands.map((b) => (
                            <label key={b.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                <Checkbox checked={selectedBrands.includes(b.id)} onCheckedChange={() => handleBrandToggle(b.id)} />
                                {b.name}
                            </label>
                        ))}
                        {filteredBrands.length > 6 && (
                            <Button variant="ghost" size="sm" onClick={() => setShowAllBrands(!showAllBrands)} className="mt-2 text-primary">
                                {showAllBrands ? 'Показать меньше' : 'Показать все'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Цена */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="w-full justify-between p-1 h-auto font-semibold mb-3"
                        onClick={() => setIsPriceOpen(!isPriceOpen)}
                    >
                        Цена
                        {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <div className={`overflow-hidden transition-all duration-300 ${isPriceOpen ? 'max-h-96' : 'max-h-0'}`}>
                        <Slider value={priceRange} onValueChange={setPriceRange} max={50000} step={100} className="mb-4" />
                        <div className="flex items-center gap-2 text-sm">
                            <span>{priceRange[0].toLocaleString()} ₽</span>
                            <span>—</span>
                            <span>{priceRange[1].toLocaleString()} ₽</span>
                        </div>
                    </div>
                </div>

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Применить</Button>
            </div>
        </aside>
    );
}
// CategoryGrid.tsx (исправленный с корректным slug для табака и электронных сигарет)
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryCounts } from '@/hooks/useCategoryFilters';
import { useProducts } from '@/hooks/useProducts'; // Добавлен для подсчета по product_type
import { useMemo } from 'react'; // Добавлен для useMemo
import i_1 from '@/assets/6.jpg';
import i_2 from '@/assets/5.jpg';
import i_3 from '@/assets/2.jpg';
import i_4 from '@/assets/4.jpg';
import i_5 from '@/assets/1.jpg';
import i_6 from '@/assets/3.jpg';

interface Category {
  name: string;
  slug: string;
  image: string;
  count?: number;
  isProductType?: boolean; // Новое поле для указания, что это product_type
}

const CategoryGrid = () => {
  const { data: categories } = useCategories();
  const { data: categoryCounts } = useCategoryCounts(categories);
  const { data: products } = useProducts({}); // Получаем все продукты для подсчета

  // Подсчет количества товаров по product_type
  const productTypeCounts = useMemo(() => {
    if (!products || !categories) return {};
    const counts = {};
    products.forEach(product => {
      const cat = categories.find(c => c.id === product.category_id);
      if (cat?.product_type) {
        counts[cat.product_type] = (counts[cat.product_type] || 0) + (product.is_active ? 1 : 0);
      }
    });
    return counts;
  }, [products, categories]);

  // Фиксированный порядок категорий с соответствующими изображениями
  // Исправлено: для табака и электронных сигарет используем product_type вместо category.slug
  const fixedCategoriesData = [
    { name: 'Табак для кальяна', slug: 'tobacco', image: i_1, isProductType: true },
    { name: 'Кальяны', slug: 'hookahs', image: i_2 },
    { name: 'Аксессуары для кальяна', slug: 'accessories', image: i_3 },
    { name: 'Уголь', slug: 'charcoal', image: i_4 },
    { name: 'Жидкости', slug: 'liquids', image: i_5 },
    { name: 'Одноразовая электронная сигарета', slug: 'electronic', image: i_6, isProductType: true }, // Изменено slug на 'electronic' и добавлено isProductType
  ];

  // Добавляем count для каждой категории
  const categoriesWithCounts: Category[] = fixedCategoriesData.map((cat) => {
    let count = 0;
    if (cat.isProductType) {
      // Для product_type считаем по productTypeCounts
      count = productTypeCounts[cat.slug] || 0;
    } else {
      // Для обычных категорий ищем по slug
      const category = categories?.find(c => c.slug === cat.slug);
      count = category ? (categoryCounts?.[category.id] || 0) : 0;
    }
    return {
      ...cat,
      count,
    };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categoriesWithCounts.map((category) => (
        <Link
          key={category.slug}
          to={category.isProductType ? `/catalog?product_type=${category.slug}` : `/catalog?category=${category.slug}`}
          className="category-card p-14 group relative overflow-hidden min-h-[200px]"
          style={{
            backgroundImage: `url(${category.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>

          <div className="flex flex-col items-center text-center relative z-10">
            <h3 className="font-display text-sm md:text-base font-bold uppercase leading-tight text-white drop-shadow-lg">
              {category.name}
            </h3>
            {category.count > 0 && (
              <span className="text-xs mt-2 opacity-90 text-white drop-shadow">
                {category.count} товаров
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
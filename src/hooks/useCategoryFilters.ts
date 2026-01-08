import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Category } from '@/hooks/useCategories';
import { supabase } from '@/components/integrations/supabase/client';

export function useCategoryIds(
  categories: Category[] | undefined,
  categorySlug: string | undefined
) {
  return useMemo(() => {
    if (!categories || !categorySlug) return undefined;
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return undefined;
    const childIds = categories
      .filter((c) => c.parent_id === category.id)
      .map((c) => c.id);
    return [category.id, ...childIds];
  }, [categories, categorySlug]);
}

export function useCategoryCounts(categories: Category[] | undefined) {
  return useQuery({
    queryKey: ['categoryCounts', categories?.map((c) => c.id).sort()], // Ключ зависит от категорий
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category_id')
        .eq('is_active', true);
      if (error) throw error;

      const counts: Record<string, number> = {};

      data.forEach((product) => {
        counts[product.category_id] = (counts[product.category_id] || 0) + 1;
      });

      categories?.forEach((cat) => {
        if (!cat.parent_id) {
          const childIds = categories
            .filter((c) => c.parent_id === cat.id)
            .map((c) => c.id);
          const total =
            (counts[cat.id] || 0) +
            childIds.reduce((sum, id) => sum + (counts[id] || 0), 0);
          counts[cat.id] = total;
        }
      });

      return counts;
    },
    enabled: !!categories,
  });
}

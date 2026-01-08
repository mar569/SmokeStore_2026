import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/components/integrations/supabase/client';

// Интерфейс для вариантов товара
export interface ProductVariant {
  id: string;
  weight?: number;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  image_file?: File; // Добавьте это
  stock_quantity: number;
  sku?: string;
  specific?: string; // Добавлено для вкусов (JSON-строка, как у продукта)
  color?: string; //
}
// Интерфейс для товара (обновлен с вариантами)
export interface Product {
  id: string;
  name: string;
  slug: string;
  specific?: string;
  color: string | null;
  has_multiple_colors: boolean;
  categorySlug?: string;
  brandSlug?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  brand_id: string | null;
  price: number;
  compare_at_price: number | null;
  weight: number | null;
  weight_unit: 'g' | 'ml' | 'pcs' | null;
  flavor: string | null;
  strength: string | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  country: string | null;
  tobacco_type: string | null;
  heat_resistance: string | null;
  composition: string | null;
  flavor_notes: string[] | null;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
    product_type: string | null;
  } | null;
  brands?: { id: string; name: string; slug: string } | null;
  product_images?: {
    id: string;
    url: string;
    is_primary: boolean;
    alt_text?: string;
  }[];
  variants?: ProductVariant[]; // Добавлено
}

// Интерфейс для формы товара (обновлен с вариантами)
export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  brand_id?: string;
  price: number;
  compare_at_price?: number;
  weight?: number;
  weight_unit?: 'g' | 'ml' | 'pcs';
  flavor?: string;
  strength?: string;
  sku?: string;
  stock_quantity?: number;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  specific?: string;
  images?: File[];
  imagesUrls?: string[];
  imagesSource?: 'upload' | 'url';
  color?: string;
  has_multiple_colors?: boolean;
  variants?: ProductVariant[]; // Добавлено
}

// Хук для получения списка товаров
export function useProducts(
  params: {
    search?: string;
    categorySlug?: string;
    brandSlug?: string;
    categoryIds?: string[];
  } = {}
) {
  const { search, categorySlug, brandSlug, categoryIds } = params;
  return useQuery({
    queryKey: ['products', { search, categorySlug, brandSlug, categoryIds }],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(
          `
          *,
          categories:category_id(id, name, slug, product_type),
          brands:brand_id(id, name, slug),
          product_images(id, url, is_primary, alt_text)
        `
        )
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      if (categoryIds && categoryIds.length > 0) {
        query = query.in('category_id', categoryIds);
      } else if (categorySlug) {
        query = query.eq('categories.slug', categorySlug);
      }
      if (brandSlug) {
        query = query.eq('brands.slug', brandSlug);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Product[];
    },
  });
}

// Хук для получения одного товара с вариантами
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_product_with_variants', {
        _slug: slug,
      });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Product not found');

      // Преобразуем данные: categories и brands из JSONB в объекты, variants из массива JSONB
      const product = data[0];
      return {
        ...product,
        categories: product.categories
          ? {
              id: product.categories.id,
              name: product.categories.name,
              slug: product.categories.slug,
              product_type: product.categories.product_type,
            }
          : null,
        brands: product.brands
          ? {
              id: product.brands.id,
              name: product.brands.name,
              slug: product.brands.slug,
            }
          : null,
        product_images: product.product_images || [],
        variants: product.variants || [],
      } as Product;
    },
    enabled: !!slug,
  });
}

// Хук для создания товара с вариантами
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const { images, variants, ...productData } = data;

      const variantData =
        variants?.map((v) => ({
          weight: v.weight,
          price: v.price,
          compare_at_price: v.compare_at_price,
          image_url: v.image_url,
          stock_quantity: v.stock_quantity,
          sku: v.sku,
        })) || null;

      const uploadedImageUrls: string[] = [];
      if (images && images.length > 0) {
        for (const file of images) {
          const fileName = `${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          uploadedImageUrls.push(publicUrlData.publicUrl);
        }
      }

      const { data: productId, error } = await supabase.rpc(
        'create_product_with_images',
        {
          _name: productData.name,
          _slug: productData.slug,
          _description: productData.description,
          _short_description: productData.short_description,
          _category_id: productData.category_id,
          _brand_id: productData.brand_id,
          _price: productData.price,
          _compare_at_price: productData.compare_at_price,
          _weight: productData.weight,
          _weight_unit: productData.weight_unit,
          _flavor: productData.flavor,
          _strength: productData.strength,
          _sku: productData.sku,
          _stock_quantity: productData.stock_quantity,
          _is_active: productData.is_active,
          _is_featured: productData.is_featured,
          _specific: productData.specific,
          _color: productData.color,
          _has_multiple_colors: productData.has_multiple_colors,
          _variants: variantData,
          _image_urls: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
        }
      );

      if (error) throw error;
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Товар создан',
        description: 'Товар успешно добавлен в каталог',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message,
      });
    },
  });
}

// Хук для обновления товара с вариантами
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductFormData>;
    }) => {
      const { images, variants, ...productData } = data;

      const variantData =
        variants?.map((v) => ({
          weight: v.weight,
          price: v.price,
          compare_at_price: v.compare_at_price,
          image_url: v.image_url,
          stock_quantity: v.stock_quantity,
          sku: v.sku,
        })) || null;

      const uploadedImageUrls: string[] = [];
      if (images && images.length > 0) {
        for (const file of images) {
          const fileName = `${id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          uploadedImageUrls.push(publicUrlData.publicUrl);
        }
      }

      const { error } = await supabase.rpc('update_product_with_images', {
        _product_id: id,
        _name: productData.name,
        _slug: productData.slug,
        _description: productData.description,
        _short_description: productData.short_description,
        _category_id: productData.category_id,
        _brand_id: productData.brand_id,
        _price: productData.price,
        _compare_at_price: productData.compare_at_price,
        _weight: productData.weight,
        _weight_unit: productData.weight_unit,
        _flavor: productData.flavor,
        _strength: productData.strength,
        _sku: productData.sku,
        _stock_quantity: productData.stock_quantity,
        _is_active: productData.is_active,
        _is_featured: productData.is_featured,
        _specific: productData.specific,
        _color: productData.color,
        _has_multiple_colors: productData.has_multiple_colors,
        _variants: variantData,
        _image_urls: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
      });

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Товар обновлён',
        description: 'Изменения сохранены',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message,
      });
    },
  });
}

// Хук для удаления товара
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Товар удалён',
        description: 'Товар удалён из каталога',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message,
      });
    },
  });
}

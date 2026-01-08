import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/components/integrations/supabase/client';

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export function useProductImages(productId: string) {
  return useQuery({
    queryKey: ['product-images', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as ProductImage[];
    },
    enabled: !!productId,
  });
}

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      productId,
      file,
      isPrimary = false,
    }: {
      productId: string;
      file: File;
      isPrimary?: boolean;
    }) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      // If this is primary, unset other primary images
      if (isPrimary) {
        await supabase
          .from('product_images')
          .update({ is_primary: false })
          .eq('product_id', productId);
      }

      // Insert image record
      const { data, error } = await supabase
        .from('product_images')
        .insert([
          {
            product_id: productId,
            url: urlData.publicUrl,
            is_primary: isPrimary,
            sort_order: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['product-images', variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Изображение загружено',
        description: 'Изображение успешно добавлено к товару',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки',
        description: error.message,
      });
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      productId,
      url,
    }: {
      id: string;
      productId: string;
      url: string;
    }) => {
      // Extract file path from URL
      const urlParts = url.split('/products/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('products').remove([filePath]);
      }

      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { productId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['product-images', data.productId],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Изображение удалено',
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

export function useSetPrimaryImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      productId,
    }: {
      id: string;
      productId: string;
    }) => {
      // Unset all primary
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      // Set new primary
      const { error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', id);

      if (error) throw error;
      return { productId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['product-images', data.productId],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Главное изображение установлено',
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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/components/integrations/supabase/client';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category_id?: string | null;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandFormData {
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  is_active?: boolean;
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Brand[];
    },
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Brand;
    },
    enabled: !!id,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: BrandFormData) => {
      const { data: brand, error } = await supabase
        .from('brands')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return brand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Бренд создан',
        description: 'Бренд успешно добавлен',
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

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<BrandFormData>;
    }) => {
      const { data: brand, error } = await supabase
        .from('brands')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return brand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Бренд обновлён',
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

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('brands').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Бренд удалён',
        description: 'Бренд удалён из каталога',
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

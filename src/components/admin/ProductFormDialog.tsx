import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import { Product, ProductFormData } from '@/hooks/useProducts';
import { Category } from '@/hooks/useCategories';
import { Brand } from '@/hooks/useBrands';

import { ProductPreviewCard } from './ProductPreviewCard';
import { Switch } from '../ui/switch';
import { useProductImages } from '@/hooks/useProductImages';

import { createClient } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query'; // Добавлено для инвалидации кэша

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImageToSupabase(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('products') // название бакета/папки
    .upload(`${path}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const publicUrlResponse = supabase.storage
    .from('products')
    .getPublicUrl(`${path}/${file.name}`);

  return publicUrlResponse.data.publicUrl;
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  brands: Brand[];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[а-яё]/gi, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      };
      return map[char.toLowerCase()] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProductFormDialog({
  open,
  onClose,
  product,
  categories,
  brands,
}: ProductFormDialogProps) {
  const queryClient = useQueryClient(); // Для инвалидации кэша

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    category_id: '',
    brand_id: '',
    price: 0,
    compare_at_price: undefined,
    weight: undefined,
    weight_unit: 'g',
    flavor: '',
    strength: '',
    sku: '',
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
  });

  // Для изображений
  const [images, setImages] = useState<(File | string)[]>([]);
  const [imagesSource, setImagesSource] = useState<'upload' | 'url'>('upload');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: existingImages } = useProductImages(product?.id || '');
  const primaryImage = existingImages?.find((img) => img.is_primary) || existingImages?.[0];

  const [isLoading, setIsLoading] = useState(false);
  const [slugError, setSlugError] = useState<string>('');

  const selectedCategory = categories.find((c) => c.id === formData.category_id);
  const selectedBrand = brands.find((b) => b.id === formData.brand_id);

  // Инициализация формы при открытии
  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          short_description: product.short_description || '',
          category_id: product.category_id || '',
          brand_id: product.brand_id || '',
          price: product.price,
          compare_at_price: product.compare_at_price || undefined,
          weight: product.weight || undefined,
          weight_unit: product.weight_unit || 'g',
          flavor: product.flavor || '',
          strength: product.strength || '',
          sku: product.sku || '',
          stock_quantity: product.stock_quantity,
          is_active: product.is_active,
          is_featured: product.is_featured,
        });
        // Инициализируем изображения существующими
        const existingUrls = product.product_images?.map((img) => img.url) || [];
        setImages(existingUrls);
        setImageUrls(existingUrls);
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          short_description: '',
          category_id: '',
          brand_id: '',
          price: 0,
          compare_at_price: undefined,
          weight: undefined,
          weight_unit: 'g',
          flavor: '',
          strength: '',
          sku: '',
          stock_quantity: 0,
          is_active: true,
          is_featured: false,
        });
        setImages([]);
        setImageUrls([]);
      }
      setSlugError('');
    }
  }, [product, open]);

  // Проверка уникальности slug
  useEffect(() => {
    if (formData.slug && formData.slug !== product?.slug) {
      const checkSlug = async () => {
        const { data, error } = await supabase
          .from('products')
          .select('id')
          .eq('slug', formData.slug)
          .neq('id', product?.id || '')
          .single();
        if (data) {
          setSlugError('Этот URL-адрес уже используется');
        } else {
          setSlugError('');
        }
      };
      checkSlug();
    } else {
      setSlugError('');
    }
  }, [formData.slug, product?.id, product?.slug]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !product ? generateSlug(name) : prev.slug,
    }));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugError) {
      alert('Исправьте ошибки перед сохранением');
      return;
    }
    setIsLoading(true);

    // Загружаем новые файлы в Supabase и получаем публичные URL
    const uploadedImageUrls: string[] = [];
    try {
      for (const img of images) {
        if (img instanceof File) {
          const url = await uploadImageToSupabase(img, 'products');
          uploadedImageUrls.push(url);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      alert('Ошибка при загрузке изображений');
      setIsLoading(false);
      return;
    }

    // Собираем финальные URL изображений (новые + существующие)
    const finalImageUrls = [
      ...images.filter((img) => typeof img === 'string') as string[],
      ...uploadedImageUrls,
    ];

    try {
      if (product) {
        // Обновление продукта
        const { error } = await supabase.rpc('update_product_with_images', {
          _product_id: product.id,
          _name: formData.name,
          _slug: formData.slug,
          _description: formData.description,
          _short_description: formData.short_description,
          _category_id: formData.category_id || null,
          _brand_id: formData.brand_id || null,
          _price: formData.price,
          _compare_at_price: formData.compare_at_price,
          _weight: formData.weight,
          _weight_unit: formData.weight_unit,
          _flavor: formData.flavor,
          _strength: formData.strength,
          _sku: formData.sku,
          _stock_quantity: formData.stock_quantity,
          _is_active: formData.is_active,
          _is_featured: formData.is_featured,
          _image_urls: finalImageUrls.length > 0 ? finalImageUrls : null,
        });
        if (error) throw error;
        alert('Товар обновлен!');
      } else {
        // Создание продукта
        const { data, error } = await supabase.rpc('create_product_with_images', {
          _name: formData.name,
          _slug: formData.slug,
          _description: formData.description,
          _short_description: formData.short_description,
          _category_id: formData.category_id || null,
          _brand_id: formData.brand_id || null,
          _price: formData.price,
          _compare_at_price: formData.compare_at_price,
          _weight: formData.weight,
          _weight_unit: formData.weight_unit,
          _flavor: formData.flavor,
          _strength: formData.strength,
          _sku: formData.sku,
          _stock_quantity: formData.stock_quantity,
          _is_active: formData.is_active,
          _is_featured: formData.is_featured,
          _image_urls: finalImageUrls.length > 0 ? finalImageUrls : null,
        });
        if (error) throw error;
        alert('Товар создан!');
      }
      // Инвалидируем кэш для продуктов, чтобы данные обновились в Catalog и ProductDetail
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', formData.slug] });
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения товара:', error);
      alert('Ошибка при сохранении товара');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная часть */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Основное</TabsTrigger>
                <TabsTrigger value="details">Характеристики</TabsTrigger>
                <TabsTrigger value="images">Изображения</TabsTrigger>
              </TabsList>

              <div className="h-[55vh] overflow-y-auto mt-4 pr-4">
                <form id="product-form" onSubmit={handleSubmit}>
                  {/* Основные вкладки */}
                  <TabsContent value="basic" className="space-y-4">
                    {/* Название и URL */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="name">Название *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="slug">URL-адрес *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          required
                        />
                        {slugError && <p className="text-red-500 text-sm">{slugError}</p>}
                      </div>

                      {/* Категория и бренд */}
                      <div className="space-y-2">
                        <Label htmlFor="category">Категория</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Бренд</Label>
                        <Select
                          value={formData.brand_id}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, brand_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите бренд" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Описание */}
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="short_description">Краткое описание</Label>
                        <Input
                          id="short_description"
                          value={formData.short_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Полное описание</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Цена и наличие */}
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Цена и наличие</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Цена (₽)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="compare_at_price">Старая цена (₽)</Label>
                          <Input
                            id="compare_at_price"
                            type="number"
                            value={formData.compare_at_price || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, compare_at_price: e.target.value ? parseFloat(e.target.value) : undefined }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock_quantity">Количество</Label>
                          <Input
                            id="stock_quantity"
                            type="number"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="sku">Артикул</Label>
                          <Input
                            id="sku"
                            value={formData.sku}
                            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Статус */}
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Статус</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Активен</Label>
                          <p className="text-sm text-muted-foreground">Отображать на сайте</p>
                        </div>
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Рекомендуемый</Label>
                          <p className="text-sm text-muted-foreground">Показывать в рекомендациях</p>
                        </div>
                        <Switch
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  {/* Характеристики */}
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Вес/Объем</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : undefined }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight_unit">Единица измерения</Label>
                        <Select
                          value={formData.weight_unit}
                          onValueChange={(value: 'g' | 'ml' | 'pcs') => setFormData((prev) => ({ ...prev, weight_unit: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">граммы (г)</SelectItem>
                            <SelectItem value="ml">миллилитры (мл)</SelectItem>
                            <SelectItem value="pcs">штуки (шт)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="flavor">Вкус/Аромат</Label>
                        <Input
                          id="flavor"
                          value={formData.flavor}
                          onChange={(e) => setFormData((prev) => ({ ...prev, flavor: e.target.value }))}
                          placeholder="Манго, Ледяной"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="strength">Крепость</Label>
                        <Input
                          id="strength"
                          value={formData.strength}
                          onChange={(e) => setFormData((prev) => ({ ...prev, strength: e.target.value }))}
                          placeholder="Средняя"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pt-4 border-t">
                      Дополнительные параметры добавятся через настройки категории.
                    </p>
                  </TabsContent>

                  {/* Вкладка "Изображения" */}
                  <TabsContent value="images" className="mt-4">
                    {/* Выбор источника изображений */}
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Добавить изображения</label>
                      <select
                        value={imagesSource}
                        onChange={(e) => setImagesSource(e.target.value as 'upload' | 'url')}
                        className="border p-2 rounded"
                      >
                        <option value="upload">Загрузить файлы</option>
                        <option value="url">Ввести URL изображений</option>
                      </select>
                    </div>

                    {/* Загрузка файлов */}
                    {imagesSource === 'upload' && (
                      <div className="mb-4">
                        <button
                          type="button"
                          className="bg-primary text-primary-foreground px-4 py-2 rounded"
                          onClick={handleFileSelect}
                        >
                          Выбрать файлы
                        </button>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                      </div>
                    )}

                    {/* Ввод URL */}
                    {imagesSource === 'url' && (
                      <div className="mb-4">
                        <Input
                          placeholder="Введите URL изображений через запятую"
                          value={imageUrls.join(', ')}
                          onChange={(e) => {
                            const urls = e.target.value
                              .split(',')
                              .map((url) => url.trim())
                              .filter(Boolean);
                            setImageUrls(urls);
                            setImages((prev) => [
                              ...prev.filter((img) => typeof img === 'object'),
                              ...urls,
                            ]);
                          }}
                        />
                      </div>
                    )}

                    {/* Отображение выбранных изображений */}
                    <div className="flex gap-2 flex-wrap mb-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative w-16 h-16 flex-shrink-0">
                          {typeof img === 'string' ? (
                            <img src={img} className="w-full h-full object-cover rounded" alt="Изображение" />
                          ) : (
                            <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded" alt="Загруженное" />
                          )}
                          <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </form>
              </div>
            </Tabs>

            {/* Действия */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
              <Button type="submit" form="product-form" disabled={isLoading || !!slugError}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {product ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </div>

          {/* Предпросмотр */}
          <div className="hidden lg:block">
            <ProductPreviewCard
              formData={formData}
              category={selectedCategory}
              brand={selectedBrand}
              imageUrl={primaryImage?.url}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
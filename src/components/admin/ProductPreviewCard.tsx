import { ProductFormData } from '@/hooks/useProducts';
import { Category } from '@/hooks/useCategories';
import { Brand } from '@/hooks/useBrands';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ImageIcon } from 'lucide-react';

interface ProductPreviewCardProps {
  formData: ProductFormData;
  category?: Category;
  brand?: Brand;
  imageUrl?: string;
}

export function ProductPreviewCard({ formData, category, brand, imageUrl }: ProductPreviewCardProps) {
  const hasDiscount = formData.compare_at_price && formData.compare_at_price > formData.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - formData.price / formData.compare_at_price!) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Превью карточки товара</h3>
      
      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-[280px]">
        {/* Image */}
        <div className="relative aspect-square bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={formData.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
              -{discountPercent}%
            </Badge>
          )}
          
          {/* Featured Badge */}
          {formData.is_featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              Хит
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Brand */}
          {brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {brand.name}
            </p>
          )}

          {/* Name */}
          <h4 className="font-serif font-semibold text-foreground line-clamp-2">
            {formData.name || 'Название товара'}
          </h4>

          {/* Short Description */}
          {formData.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {formData.short_description}
            </p>
          )}

          {/* Weight */}
          {formData.weight && (
            <p className="text-sm text-muted-foreground">
              {formData.weight} {formData.weight_unit === 'g' ? 'г' : formData.weight_unit === 'ml' ? 'мл' : 'шт'}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formData.price} ₽
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formData.compare_at_price} ₽
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <Badge
              variant={formData.stock_quantity && formData.stock_quantity > 0 ? 'default' : 'secondary'}
              className="font-normal"
            >
              {formData.stock_quantity && formData.stock_quantity > 0 ? 'В наличии' : 'Нет в наличии'}
            </Badge>
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full gap-2" size="sm" disabled={!formData.stock_quantity}>
            <ShoppingCart className="h-4 w-4" />
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
}

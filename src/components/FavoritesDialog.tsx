// components/FavoritesDialog.tsx (новый компонент для диалога избранных)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, X, ImageIcon } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useProduct } from '@/hooks/useProducts';

interface FavoritesDialogProps {
    open: boolean;
    onClose: () => void;
}

const FavoritesDialog = ({ open, onClose }: FavoritesDialogProps) => {
    const { favorites, removeFromFavorites } = useFavorites();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] w-full h-full md:h-auto md:max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl">Избранные товары ({favorites.length})</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[70vh]">
                    {favorites.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">У вас нет избранных товаров</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.map((slug) => (
                                <FavoriteItem key={slug} slug={slug} onRemove={removeFromFavorites} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button onClick={onClose}>Закрыть</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const FavoriteItem = ({ slug, onRemove }: { slug: string; onRemove: (slug: string) => void }) => {
    const { data: product, isLoading } = useProduct(slug);

    if (isLoading || !product) return null;

    const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];

    return (
        <div className="bg-card rounded-lg p-4 border border-border relative group">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(slug)}
            >
                <X className="h-4 w-4" />
            </Button>
            <Link to={`/product/${product.slug}`} onClick={() => { }}>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                    {primaryImage ? (
                        <img
                            src={primaryImage.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
                <h4 className="text-sm font-medium truncate mb-1">{product.name}</h4>
                {product.weight && (
                    <p className="text-xs text-muted-foreground mb-1">
                        {product.weight} {product.weight_unit === 'g' ? 'г' : product.weight_unit === 'ml' ? 'мл' : 'шт'}
                    </p>
                )}
                <p className="text-sm font-bold text-primary">{product.price.toLocaleString()} ₽</p>
            </Link>
        </div>
    );
};

export default FavoritesDialog;
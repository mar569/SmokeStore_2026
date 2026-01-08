import { useRef, useState } from 'react';
import { useProductImages, useUploadProductImage, useDeleteProductImage, useSetPrimaryImage, ProductImage } from '@/hooks/useProductImages';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, Star, Loader2, ImageIcon } from 'lucide-react';

interface ProductImageUploadProps {
  productId: string;
}

export function ProductImageUpload({ productId }: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { data: images, isLoading } = useProductImages(productId);
  const uploadImage = useUploadProductImage();
  const deleteImage = useDeleteProductImage();
  const setPrimary = useSetPrimaryImage();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    
    const file = files[0];
    if (!file) return;

    const isPrimary = !images || images.length === 0;
    await uploadImage.mutateAsync({ productId, file, isPrimary });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Изображения товара</h3>
      
      {/* Upload Zone */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer',
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          uploadImage.isPending && 'opacity-50 pointer-events-none'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        {uploadImage.isPending ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Перетащите изображение или нажмите для загрузки
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WebP до 5MB
            </p>
          </>
        )}
      </div>

      {/* Image Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={() => deleteImage.mutate({ id: image.id, productId, url: image.url })}
              onSetPrimary={() => setPrimary.mutate({ id: image.id, productId })}
              isDeleting={deleteImage.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
          <p className="text-sm">Нет загруженных изображений</p>
        </div>
      )}
    </div>
  );
}

function ImageCard({ 
  image, 
  onDelete, 
  onSetPrimary,
  isDeleting 
}: { 
  image: ProductImage; 
  onDelete: () => void; 
  onSetPrimary: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
      <img
        src={image.url}
        alt={image.alt_text || 'Product image'}
        className="h-full w-full object-cover"
      />
      
      {/* Primary Badge */}
      {image.is_primary && (
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          <Star className="h-3 w-3" />
          Главное
        </div>
      )}

      {/* Actions Overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
        {!image.is_primary && (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onSetPrimary();
            }}
          >
            <Star className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={isDeleting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

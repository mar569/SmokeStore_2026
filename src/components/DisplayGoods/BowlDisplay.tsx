// BowlDisplay.tsx (новый компонент для отображения характеристик чаш)
import React from 'react';

interface BowlDisplayProps {
    specific: any;
}

export const BowlDisplay: React.FC<BowlDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.brand && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.brand}</span>
                </div>
            )}
            {specific.country && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Страна:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.country}</span>
                </div>
            )}
            {specific.bowl_shape && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Вид чашки:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.bowl_shape}</span>
                </div>
            )}
            {specific.bowl_material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал чашки:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.bowl_material}</span>
                </div>
            )}
            {specific.bowl_type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип чашки:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.bowl_type}</span>
                </div>
            )}
        </div>
    );
};
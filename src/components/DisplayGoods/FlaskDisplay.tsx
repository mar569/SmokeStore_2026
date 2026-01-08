// FlaskDisplay.tsx (новый компонент для отображения характеристик колб)
import React from 'react';

interface FlaskDisplayProps {
    specific: any;
}

export const FlaskDisplay: React.FC<FlaskDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.brand && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.brand}</span>
                </div>
            )}
            {specific.capacity && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Объем:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.capacity}</span>
                </div>
            )}
            {specific.material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.material}</span>
                </div>
            )}
            {specific.country && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Страна:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.country}</span>
                </div>
            )}
            {specific.connection_type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип соединения:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.connection_type}</span>
                </div>
            )}
            {specific.height && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Высота:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.height} см</span>
                </div>
            )}
        </div>
    );
};
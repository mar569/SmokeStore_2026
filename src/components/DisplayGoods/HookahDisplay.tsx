import React from 'react';

interface HookahDisplayProps {
    specific: any;
}

export const HookahDisplay: React.FC<HookahDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.hookah_brand && (
                <div className="flex items-center pb-2 mb-2" >
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.hookah_brand}</span>
                </div>
            )}
            {specific.country && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Страна:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.country}</span>
                </div>
            )}
            {specific.draft && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тяга:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.draft}</span>
                </div>
            )}
            {specific.shaft_material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал шахты:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.shaft_material}</span>
                </div>
            )}
            {specific.flask_material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал колбы:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.flask_material}</span>
                </div>
            )}
            {specific.internal_diameter && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Внутренний диаметр:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.internal_diameter} {specific.diameter_unit || 'мм'}</span>
                </div>
            )}
            {specific.hose_material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал шланга:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.hose_material}</span>
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
            {specific.hookah_height && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Высота кальяна:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.hookah_height}</span>
                </div>
            )}
        </div>
    );
};
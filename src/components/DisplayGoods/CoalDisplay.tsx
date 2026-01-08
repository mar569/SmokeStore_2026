import React from 'react';

interface CoalDisplayProps {
    specific: any;
}

export const CoalDisplay: React.FC<CoalDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.coal_brand && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="ml-2 font-medium">{specific.coal_brand}</span>
                </div>
            )}
            {specific.coal_size && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Размер угля:</span>
                    <span className="ml-2 font-medium">{specific.coal_size}</span>
                </div>
            )}
            {specific.country && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Страна:</span>
                    <span className="ml-2 font-medium">{specific.country}</span>
                </div>
            )}
            {specific.coal_type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип угля:</span>
                    <span className="ml-2 font-medium">
                        {specific.coal_type === 'coconut' ? 'Кокосовый уголь' : specific.coal_type === 'wood' ? 'Древесный уголь' : 'Другой'}
                    </span>
                </div>
            )}
        </div>
    );
};
import React from 'react';

interface TobaccoDisplayProps {
    specific: any;
}

export const TobaccoDisplay: React.FC<TobaccoDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.tobacco_brand && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground ">Бренд:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.tobacco_brand}</span>
                </div>
            )}
            {specific.flavor_type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип вкуса:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.flavor_type}</span>
                </div>
            )}
            {specific.country && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Страна:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.country}</span>
                </div>
            )}
            {specific.line && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Линейка:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.line}</span>
                </div>
            )}
            {specific.strength && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Крепость:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">
                        {specific.strength === 'low' ? 'Легкий' : specific.strength === 'medium' ? 'Средний' : 'Крепкий'}
                    </span>
                </div>
            )}
            {specific.taste_notes && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Вкусовые ноты:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.taste_notes}</span>
                </div>
            )}

            {specific.tobacco_type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип табака:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.tobacco_type}</span>
                </div>
            )}

            {specific.heat_resistance && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Жаростойкость:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">
                        {specific.heat_resistance === 'low' ? 'Низкая' : specific.heat_resistance === 'medium' ? 'Средняя' : 'Высокая'}
                    </span>
                </div>
            )}
            {specific.smoke_density && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Дымность табака:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">
                        {specific.smoke_density === 'low' ? 'Низкая' : specific.smoke_density === 'medium' ? 'Средняя' : 'Высокая'}
                    </span>
                </div>
            )}
            {specific.composition && (
                <div className="flex items-center pb-2 mb-2 text-right">
                    <span className="text-muted-foreground">Состав:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.composition}</span>
                </div>
            )}
        </div>
    );
};
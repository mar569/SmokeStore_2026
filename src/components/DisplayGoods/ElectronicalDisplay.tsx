// ElectronicalDisplay.tsx
import React from 'react';

interface ElectronicalDisplayProps {
    specific: any;
}

export const ElectronicalDisplay: React.FC<ElectronicalDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.electronic_brand && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Бренд</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="font-medium">{specific.electronic_brand}</span>
                </div>
            )}

            {specific.accessory_type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип аксессуара</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="font-medium">
                        {specific.accessory_type === 'custom' ? specific.custom_accessory_type : specific.accessory_type}
                    </span>
                </div>
            )}

            {specific.flavor_type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип вкуса</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="font-medium">{specific.flavor_type}</span>
                </div>
            )}

            {specific.taste_notes && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Вкусовые ноты</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="font-medium">{specific.taste_notes}</span>
                </div>
            )}

            {specific.puff_count && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Количество затяжек</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="font-medium">{specific.puff_count}</span>
                </div>
            )}
        </div>
    );
};
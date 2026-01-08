import React from 'react';

interface LiquidDisplayProps {
    specific: any;
}

export const LiquidDisplay: React.FC<LiquidDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.nicotine && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Наличие никотина:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.nicotine}</span>
                </div>
            )}
            {specific.aroma && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Аромат/Вкус:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.aroma}</span>
                </div>
            )}
            {specific.nicotine_level && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Уровень никотина:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.nicotine_level}</span>
                </div>
            )}
            {specific.strength && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Крепость (VG/PG):</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.strength}</span>
                </div>
            )}
        </div>
    );
};
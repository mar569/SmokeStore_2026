import React from 'react';

interface VapeDisplayProps {
    specific: any;
}

export const VapeDisplay: React.FC<VapeDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.brand && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.brand}</span>
                </div>
            )}
            {specific.type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.type}</span>
                </div>
            )}
            {specific.battery && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Батарея:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.battery}</span>
                </div>
            )}

            {specific.volume && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Объём катриджа:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.volume}</span>
                </div>
            )}
        </div>
    );
};
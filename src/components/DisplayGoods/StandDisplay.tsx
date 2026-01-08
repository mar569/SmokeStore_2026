import React from 'react';

interface StandDisplayProps {
    specific: any;
}

export const StandDisplay: React.FC<StandDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.type}</span>
                </div>
            )}
            {specific.material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.material}</span>
                </div>
            )}
        </div>
    );
};
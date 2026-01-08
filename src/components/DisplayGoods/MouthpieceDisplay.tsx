import React from 'react';

interface MouthpieceDisplayProps {
    specific: any;
}

export const MouthpieceDisplay: React.FC<MouthpieceDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.material}</span>
                </div>
            )}
            {specific.design && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Дизайн:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.design}</span>
                </div>
            )}
        </div>
    );
};
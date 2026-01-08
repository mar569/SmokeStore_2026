import React from 'react';

interface LighterDisplayProps {
    specific: any;
}

export const LighterDisplay: React.FC<LighterDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.type}</span>
                </div>
            )}
            {specific.fuel && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.fuel}</span>
                </div>
            )}

        </div>
    );
};
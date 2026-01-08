import React from 'react';

interface HoseDisplayProps {
    specific: any;
}

export const HoseDisplay: React.FC<HoseDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.material && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Материал:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.material}</span>
                </div>
            )}
            {specific.length && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.length}</span>
                </div>
            )}
        </div>
    );
};
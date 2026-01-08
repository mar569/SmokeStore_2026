import React from 'react';

interface AdapterDisplayProps {
    specific: any;
}

export const AdapterDisplay: React.FC<AdapterDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Тип:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.type}</span>
                </div>
            )}
            {specific.compatibility && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Совместимость:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.compatibility}</span>
                </div>
            )}
        </div>
    );
};
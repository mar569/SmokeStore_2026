import React from 'react';

interface ToolDisplayProps {
    specific: any;
}

export const ToolDisplay: React.FC<ToolDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.type && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.type}</span>
                </div>
            )}
            {specific.purpose && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Назначение:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.purpose}</span>
                </div>
            )}
        </div>
    );
};
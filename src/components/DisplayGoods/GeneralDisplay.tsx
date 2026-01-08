import React from 'react';

interface GeneralDisplayProps {
    specific: any;
}

export const GeneralDisplay: React.FC<GeneralDisplayProps> = ({ specific }) => {
    return (
        <div className="grid grid-cols-1 gap-0 text-sm">
            {specific.custom_field1 && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Поле 1:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.custom_field1}</span>
                </div>
            )}
            {specific.custom_field2 && (
                <div className="flex items-center pb-2 mb-2">
                    <span className="text-muted-foreground">Поле 2:</span>
                    <span className="flex-1 border-b border-dotted border-muted-foreground mx-2"></span>
                    <span className="ml-2 font-medium">{specific.custom_field2}</span>
                </div>
            )}
        </div>
    );
};
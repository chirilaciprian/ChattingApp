import React from 'react';

export default function Loading({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`flex flex-col items-center justify-center p-4 gap-3 ${className}`} {...props}>
            <span className="loading loading-spinner loading-lg text-primary"></span>
            {children && (
                <span className="text-sm font-semibold tracking-widest opacity-50 uppercase animate-pulse">
                    {children}
                </span>
            )}
        </div>
    );
}
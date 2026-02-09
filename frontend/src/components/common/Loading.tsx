import React from 'react';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

const Loading = ({ children, className = "", ...props }: LoadingProps) => {
    return (
        <div
            className={`flex flex-col items-center justify-center h-screen w-screen p-4 gap-3 ${className}`}
            {...props}
        >
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-sm font-semibold tracking-widest opacity-60 uppercase animate-pulse">
                {children || "Loading..."}
            </span>
        </div>
    );
};

export default Loading;
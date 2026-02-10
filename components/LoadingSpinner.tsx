import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin animation-delay-200"></div>
        <div className="absolute inset-4 rounded-full border-l-2 border-blue-400 animate-spin animation-delay-500"></div>
      </div>
      <p className="mt-4 text-muted-foreground animate-pulse">Analyzing symptoms and calculating dosages...</p>
    </div>
  );
};

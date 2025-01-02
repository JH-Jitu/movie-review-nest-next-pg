import React from "react";

const LoadingScreen: React.FC<{ size?: number }> = ({ size = 30 }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <LoadingComponent size={size} />
    </div>
  );
};

export default LoadingScreen;

export const LoadingComponent = ({ size = 30 }: { size?: number }) => {
  return (
    <>
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 8px solid rgba(0, 0, 0, 0.1);
          border-left-color: #4f46e5;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

import React, { FC } from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingProps {
  message?: string;
}

const Loading: FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <FiLoader className="w-12 h-12 text-primary animate-spin" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;

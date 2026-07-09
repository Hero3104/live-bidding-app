import React, { FC } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

const Error: FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4">
      <FiAlertCircle className="w-6 h-6 text-red-500" />
      <div className="flex-1">
        <p className="text-red-800">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline text-sm">
          Retry
        </button>
      )}
    </div>
  );
};

export default Error;

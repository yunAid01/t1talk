interface NotFoundProps {
  message?: string;
  description?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

export default function NotFound({
  message = 'Not Found',
  description,
  iconSize = 'md',
}: NotFoundProps) {
  const sizeClasses = {
    sm: { container: 'w-12 h-12', icon: 'w-6 h-6' },
    md: { container: 'w-20 h-20', icon: 'w-10 h-10' },
    lg: { container: 'w-28 h-28', icon: 'w-14 h-14' },
  };

  const size = sizeClasses[iconSize];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${size.container} bg-red-900/20 rounded-full flex items-center justify-center mb-4`}
      >
        <svg
          className={`${size.icon} text-red-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-400 text-lg font-semibold mb-2">{message}</p>
      {description && (
        <p className="text-gray-500 text-sm text-center max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}

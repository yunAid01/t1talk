import { AlertCircle } from 'lucide-react';

interface NotFoundProps {
  message?: string;
  description?: string;
  icon?: React.ReactElement;
}
export default function NotFound({
  message = 'Not Found',
  description,
  icon = <AlertCircle className="text-white" />,
}: NotFoundProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6`}>
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-full blur-xl"></div>

        {/* 아이콘 배경 */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-red-900/30">
          {icon}
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
          {message}
        </h3>
        {description && (
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}

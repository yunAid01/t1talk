import { 
  MessageCircle, 
  UserPlus, 
  UserMinus, 
  Shield, 
  ShieldOff, 
  Star,
  StarOff 
} from 'lucide-react';

interface UserDetailActionButtonProps {
  text: string;
  onClick: () => void;
  className: string;
  variant?: 'message' | 'add' | 'remove' | 'block' | 'unblock' | 'favorite' | 'unfavorite';
}

export default function UserDetailActionButton({
  text,
  onClick,
  className,
  variant = 'add',
}: UserDetailActionButtonProps) {
  const getIcon = () => {
    const iconProps = { size: 18, strokeWidth: 2.5 };
    
    switch (variant) {
      case 'message':
        return <MessageCircle {...iconProps} />;
      case 'add':
        return <UserPlus {...iconProps} />;
      case 'remove':
        return <UserMinus {...iconProps} />;
      case 'block':
        return <Shield {...iconProps} />;
      case 'unblock':
        return <ShieldOff {...iconProps} />;
      case 'favorite':
        return <Star {...iconProps} />;
      case 'unfavorite':
        return <StarOff {...iconProps} />;
      default:
        return <UserPlus {...iconProps} />;
    }
  };

  return (
    <button 
      onClick={onClick} 
      className={`${className} group relative overflow-hidden`}
    >
      {/* 호버 효과 배경 */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* 버튼 내용 */}
      <div className="relative flex items-center justify-center gap-2">
        {getIcon()}
        <span className="font-semibold tracking-wide">{text}</span>
      </div>
    </button>
  );
}

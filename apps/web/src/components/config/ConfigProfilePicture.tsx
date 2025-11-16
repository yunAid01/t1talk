import Image from 'next/image';
import { Camera } from 'lucide-react';

interface ConfigProfilePictureProps {
  profileImageUrl: string;
  nickname: string;
  email: string;
}
export default function ConfigProfilePicture({
  profileImageUrl,
  nickname,
  email,
}: ConfigProfilePictureProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800">
          <Image
            src={profileImageUrl || '/images/default-profileImage-v2.jpg'}
            alt={nickname || 'User'}
            fill
            className="object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg">
          <Camera size={16} className="text-white" />
        </button>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">{nickname}</h3>
        <p className="text-gray-400 text-sm">{email}</p>
      </div>
    </div>
  );
}

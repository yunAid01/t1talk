interface ConfigNotificationsProps {
  checked: boolean;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  onToggle: () => void;
}
export default function ConfigNotifications({
  checked,
  label,
  desc,
  icon,
  onToggle,
}: ConfigNotificationsProps) {
  const IconComponent = icon; // 컴포넌트 변수명은 대문자로 시작해야 함

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
      <div className="flex items-center gap-3">
        <IconComponent className="text-red-500" size={20} />
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="text-sm text-gray-400">{desc}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          onChange={onToggle}
          className="sr-only peer"
          checked={checked}
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
      </label>
    </div>
  );
}

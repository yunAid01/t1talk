export default function ConfigAppearance() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>

      <div className="space-y-4">
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <h3 className="font-medium text-white mb-3">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="p-4 bg-gradient-to-br from-red-600 to-red-900 rounded-lg border-2 border-red-500 hover:scale-105 transition-transform">
              <div className="text-white font-semibold">T1 Red</div>
              <div className="text-xs text-red-200 mt-1">Current</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-gray-600 to-gray-900 rounded-lg border-2 border-gray-700 hover:scale-105 transition-transform opacity-50 cursor-not-allowed">
              <div className="text-white font-semibold">Dark</div>
              <div className="text-xs text-gray-400 mt-1">Coming Soon</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg border-2 border-blue-700 hover:scale-105 transition-transform opacity-50 cursor-not-allowed">
              <div className="text-white font-semibold">Blue</div>
              <div className="text-xs text-blue-200 mt-1">Coming Soon</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

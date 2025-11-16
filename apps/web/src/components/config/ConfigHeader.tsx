export default function ConfigHeader() {
  return (
    <div className="bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>
    </div>
  );
}

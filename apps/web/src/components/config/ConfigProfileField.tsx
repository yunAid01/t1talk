interface ConfigProfileFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder: string;
  labelText: string;
  inputType: string;
}

export default function ConfigProfileField({
  name,
  value,
  onChange,
  placeholder,
  labelText,
  inputType,
}: ConfigProfileFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {labelText}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={inputType}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
      />
    </div>
  );
}

type Props = {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export const Input = ({ id, label, placeholder, value, onChange }: Props) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={id}
          id={id}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

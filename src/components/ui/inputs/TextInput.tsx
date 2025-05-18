import React from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  Icon: React.ElementType;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  Icon,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-dozeblue font-medium">{label}</label>
      <div className="flex items-center gap-2 border border-dozegray/30 bg-white rounded-xl px-4 py-2 shadow-sm">
        <Icon className="text-dozeblue w-5 h-5" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-dozeblue placeholder-dozegray text-sm bg-transparent"
        />
      </div>
    </div>
  );
};

export default TextInput;

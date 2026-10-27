import { motion } from "framer-motion";

type InputProps = {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ label, icon, name, value, onChange, disabled }: InputProps) {
  return (
    <motion.div whileFocus={{ scale: 1.01 }}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border bg-gray-50 px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
        <div className="mr-3 text-orange-600">{icon}</div>

        <input
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className="h-14 w-full bg-transparent outline-none disabled:cursor-not-allowed disabled:text-gray-400"
        />
      </div>
    </motion.div>
  );
}

export default Input;

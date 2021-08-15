import React, { FC } from "react";
interface Iprops {
  error?: string;
  touched?: boolean | string;
  disabled?: boolean;
  validation?: boolean;
  optionsForSelect?: any[];
}
const InputSelect: FC<Iprops> = ({ ...props }: Iprops) => {
  const { touched, error, disabled, validation, optionsForSelect, ...rest } = {
    ...props,
  };
  return (
    <select
      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs pr-10 ${
        (error && touched) || (validation && error)
          ? " border-red-300"
          : " border-gray-300"
      } ${disabled ? "bg-gray-100" : ""}`}
      {...rest}
      disabled={disabled}
    >
      {optionsForSelect?.map((options) => (
        <option key={options.id} value={options.id}>
          {options.name}
        </option>
      ))}
    </select>
  );
};

export default InputSelect;

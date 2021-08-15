import React from "react";

const InputCheckbox = ({ ...props }) => {
  const { touched, error, validation, ...rest } = { ...props };
  return (
    <input
      className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
        (error && touched) || (validation && error)
          ? " border-red-300"
          : " border-gray-300"
      }`}
      {...rest}
    />
  );
};

export default InputCheckbox;

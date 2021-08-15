import React from "react";
import { useField, ErrorMessage } from "formik";
import InputField from "./InputField";
import InputCheckbox from "./InputCheckbox";
import InputTextArea from "./InputTextArea";
import InputSelect from "./InputSelect";
import InputSearchableSelect from "./InputSearchableSelect";
import InputDateField from "./InputDateField";

interface IProps {
  name: string;
  type?: string;
  placeholder?: string;
  label: string;
  disabled?: boolean;
  validation?: boolean;
  optionsForSelect?: any[];
  valueOfLabel?: string;
}
export const FormikInput = ({ ...props }: IProps) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = { ...meta };
  return (
    <React.Fragment>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="mt-1 relative">
        <InputField
          touched={touched}
          error={error}
          {...field}
          {...props}
          validation={props.validation}
        />
      </div>
      {props.validation && error ? (
        <span className="text-red-600 mt-2 text-sm">{error}</span>
      ) : (
        <ErrorMessage
          name={props.name}
          component="span"
          className="text-red-600 mt-2 text-sm"
        />
      )}
    </React.Fragment>
  );
};

export const FormikCheckbox = ({ ...props }: IProps) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = { ...meta };

  return (
    <React.Fragment>
      <div className="flex items-center">
        <InputCheckbox touched={touched} error={error} {...field} {...props} />
        {/* dangerouslySetInnerHTML used if the label is of htmltype*/}
        <label
          htmlFor={props.name}
          className="ml-2 block text-sm text-gray-900"
          dangerouslySetInnerHTML={{ __html: props.label }}
        ></label>
      </div>
      {props.validation && error ? (
        <span className="text-red-600 mt-2 text-sm">{error}</span>
      ) : (
        <ErrorMessage
          name={props.name}
          component="span"
          className="text-red-600 mt-2 text-sm"
        />
      )}
    </React.Fragment>
  );
};

export const FormikTextArea = ({ ...props }: IProps) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = { ...meta };
  return (
    <React.Fragment>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="mt-1 relative">
        <InputTextArea touched={touched} error={error} {...field} {...props} />
      </div>

      {props.validation && error ? (
        <span className="text-red-600 mt-2 text-sm">{error}</span>
      ) : (
        <ErrorMessage
          name={props.name}
          component="span"
          className="text-red-600 mt-2 text-sm"
        />
      )}
    </React.Fragment>
  );
};

export const FormikSelect = ({ ...props }: IProps) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = { ...meta };
  return (
    <React.Fragment>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="mt-1 relative">
        <InputSelect touched={touched} error={error} {...field} {...props} />
      </div>

      {props.validation && error ? (
        <span className="text-red-600 mt-2 text-sm">{error}</span>
      ) : (
        <ErrorMessage
          name={props.name}
          component="span"
          className="text-red-600 mt-2 text-sm"
        />
      )}
    </React.Fragment>
  );
};

// Input Search

export const FormikInputSearch = ({ ...props }: IProps) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = { ...meta };
  return (
    <React.Fragment>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="mt-1 relative">
        <InputSearchableSelect
          touched={touched}
          error={error}
          {...field}
          {...props}
          validation={props.validation}
          valueOfLabel={props.valueOfLabel}
        />
      </div>
      {props.validation && error ? (
        <span className="text-red-600 mt-2 text-sm">{error}</span>
      ) : (
        <ErrorMessage
          name={props.name}
          component="span"
          className="text-red-600 mt-2 text-sm"
        />
      )}
    </React.Fragment>
  );
};

interface FormikInputDateFieldProps {
  name: string;
  type?: string;
  placeholder?: string;
  label: string;
  disabled?: boolean;
  validation?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const FormikInputDateField = ({
  ...props
}: FormikInputDateFieldProps) => {
  const [field, meta] = useField(props.name);
  const { touched, error } = { ...meta };
  return (
    <React.Fragment>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="mt-1 relative">
        <InputDateField
          touched={touched}
          error={error}
          {...field}
          {...props}
          validation={props.validation}
        />
      </div>
      {props.validation && error ? (
        <span className="text-red-600 mt-2 text-sm">{error}</span>
      ) : (
        <ErrorMessage
          name={props.name}
          component="span"
          className="text-red-600 mt-2 text-sm"
        />
      )}
    </React.Fragment>
  );
};

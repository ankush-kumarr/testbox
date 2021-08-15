import React from "react";
import CancelButton from "../../Button/cancelButton";
import Button from "../../Button";
interface IProps {
  submitTitle: string;
  onCancel?: () => void;
  loading?: boolean | undefined;
  validateFunc?: () => void;
  validSubmit?: boolean;
  toched?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  idForSubmit?: string;
}
export const FormSubmitPanel = ({
  submitTitle,
  validSubmit,
  onCancel,
  loading,
  validateFunc,
  idForSubmit,
  onClick,
  type,
}: IProps) => {
  return (
    <div className="flex justify-end pt-0.5 pb-20 flex-shrink-0">
      {onCancel && (
        <CancelButton onMouseDown={onCancel} type="button" className={`  `}>
          Cancel
        </CancelButton>
      )}
      <Button
        onClick={onClick && onClick}
        id={idForSubmit}
        disabled={validSubmit}
        onMouseDown={validateFunc && validateFunc}
        loading={loading}
        type={type || "submit"}
        className={`ml-4  border border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${
          validSubmit ? "cursor-not-allowed" : ""
        }`}
      >
        {submitTitle}
      </Button>
    </div>
  );
};

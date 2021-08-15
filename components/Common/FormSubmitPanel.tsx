import React from "react";
import CancelButton from "../Button/cancelButton";
import Button from "../Button";

interface IProps {
  submitTitle: string;
  onCancel?: () => void;
  loading?: boolean | undefined;
  validateFunc?: () => void;
  validSubmit?: boolean;
  toched?: boolean;
  idForSubmit: string;
}

export const FormSubmitPanel = ({
  submitTitle,
  validSubmit,
  onCancel,
  loading,
  validateFunc,
  idForSubmit,
}: IProps) => {
  return (
    <div className="flex justify-end pt-0.5 pb-20 pl-40">
      {onCancel && (
        <CancelButton onMouseDown={onCancel} type="button" className={`  `}>
          Cancel
        </CancelButton>
      )}
      <Button
        id={idForSubmit}
        disabled={validSubmit}
        onMouseDown={validateFunc && validateFunc}
        loading={loading}
        type="submit"
        className={`ml-4  border border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${validSubmit ? "cursor-not-allowed" : ""
          }`}
      >
        {submitTitle}
      </Button>

    </div>
  );
};

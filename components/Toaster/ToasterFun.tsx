import { toast } from "react-toastify";
import Toast from "../Toast/Toast";

export const showError = (message: string) => {
  if (message) {
    toast(<Toast message={message} type="error" />);
  }
};
export const showSuccess = (message: string) => {
  if (message) {
    toast(<Toast message={message} type="success" />);
  }
};

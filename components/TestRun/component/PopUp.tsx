import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form } from "formik";
import { FormikTextArea } from "../../Common/FormikInput";
import Button from "../../Button";
import CancelButton from "../../Button/cancelButton";

interface Props {
  open: boolean;
  setOpen?: (val: boolean) => void | any;
  submitData: (comment: string, doNotUpdate?: boolean) => void | any;
}
export default function PopUp({ open, submitData }: Props) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={() => submitData("", true)}
      >
        <div className="flex items-end justify-center min-h-screen pt-1 px-1 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-2 pt-2 pb-2 text-left overflow-hidden shadow-xl transform transition-all sm:my-2 sm:align-middle sm:max-w-sm sm:w-full sm:p-2">
              <div className="max-w-lg mx-auto pt-2 pb-2 px-4 lg:pb-4 ">
                <div className="w-full ">
                  <Formik
                    initialValues={{ comment: "" }}
                    onSubmit={({ comment }) => submitData(comment)}
                  >
                    {(formik) => {
                      const { isValid, dirty } = formik;
                      return (
                        <Form className="space-y-6">
                          <div>
                            <FormikTextArea
                              type="text"
                              name="comment"
                              label="Comment (Optional)"
                            />
                          </div>
                          <div className="flex justify-end pt-0.5">
                            <CancelButton
                              onMouseDown={() => submitData("")}
                              type="button"
                              className={`mr-2 `}
                            >
                              Skip & Submit
                            </CancelButton>
                            <Button
                              id="submit-inside-popup"
                              type="submit"
                              className={` ${
                                !(dirty && isValid) ? "cursor-not-allowed" : ""
                              }`}
                              disabled={!(dirty && isValid)}
                            >
                              Add
                            </Button>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useRef, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FormikInput, FormikTextArea } from "../Common/FormikInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../Button";
import CancelButton from "../Button/cancelButton";
import { useRouter } from "next/router";
import axiosService from "../Utils/axios";
import { showError } from "../../components/Toaster/ToasterFun";
import { AppContext } from "../Context/mainContext";

interface Iprops {
  popup: boolean;
  hidePopUp: () => void;
  editValue: any;
  getSection: () => void;
}
export default function Example({ ...props }: Iprops) {
  const router = useRouter();
  const { dispatch } = useContext(AppContext);
  const AddSectionSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(32, "Name should be maximum 32 characters")
      .required("Name is required"),
    description: Yup.string()
      .trim()
      .max(500, "Description should be maximun 500 characters"),
  });
  interface InitVal {
    name: string | string[] | undefined;
    description?: string | string[] | undefined;
  }
  const initialValues: InitVal = {
    name: "",
    description: "",
  };
  const [initValues, setInitValues] = useState(initialValues);
  const [apiloading, setApiLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const submitFormAddProject = async (values: InitVal) => {
    try {
      setApiLoading(true);
      const newValue = { ...values };
      if (newValue.name === initValues.name) {
        delete newValue.name;
      }
      if (props?.editValue?.id) {
        await axiosService.put(
          "/projects/" + router.query.pid + "/sections/" + props.editValue.id,
          { ...newValue }
        );
      } else {
        if (!newValue.description) {
          delete newValue.description;
        }
        await axiosService.post("/projects/" + router.query.pid + "/sections", {
          ...newValue,
        });
      }
      dispatch({ type: "UPDATE_SECTION_CREATED", data: true });
      props.getSection();
      props.hidePopUp();
      setApiLoading(false);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Something went wrong");
      }
      setApiLoading(false);
    }
  };
  useEffect(() => {
    if (props.editValue) {
      setInitValues({
        name: props?.editValue?.name,
        description: props?.editValue?.description || "",
      });
    }
  }, [props?.editValue]);
  const labelref = useRef<HTMLLabelElement>(null);
  return (
    <Transition.Root show={props.popup} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={props.popup}
        onClose={() => props.hidePopUp()}
        initialFocus={labelref}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className="w-full ">
                <Formik
                  initialValues={initValues}
                  validationSchema={AddSectionSchema}
                  onSubmit={submitFormAddProject}
                  enableReinitialize
                >
                  {(formik) => {
                    const { dirty } = formik;
                    return (
                      <Form className="space-y-6" noValidate>
                        <div>
                          <label
                            ref={labelref}
                            className="block text-lg font-medium text-gray-900"
                          >
                            {props?.editValue?.id
                              ? "Edit Section Details"
                              : "Create New Section"}
                          </label>
                          <p className="block text-sm font-normal text-gray-500">
                            {props?.editValue?.id
                              ? "Please edit details of your section"
                              : "Please fill in details of your new section"}
                          </p>
                        </div>
                        <div>
                          <FormikInput
                            type="text"
                            name="name"
                            label="Name"
                            validation={validation}
                          />
                        </div>
                        <div>
                          <FormikTextArea
                            type="text"
                            name="description"
                            label="Description"
                            validation={validation}
                          />
                        </div>
                        <div className="flex justify-end">
                          <CancelButton
                            onMouseDown={() => props.hidePopUp()}
                            type="button"
                            className={``}
                          >
                            Cancel
                          </CancelButton>
                          <Button
                            onMouseDown={() => setValidation(true)}
                            loading={apiloading}
                            type="submit"
                            className={`ml-4  border border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              props?.editValue?.id && !dirty
                                ? "cursor-not-allowed"
                                : ""
                            }`}
                            disabled={
                              props?.editValue?.id && !dirty ? true : false
                            }
                            id="section-pop-up-button"
                          >
                            Save
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

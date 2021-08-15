import React, { useState } from "react";
import { FormikInput } from "../Common/FormikInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axiosService from "../Utils/axios";
import { showError } from "../Toaster/ToasterFun";
import Button from "../Button";
import { useRouter } from "next/router";
import { FormikTextArea } from "../Common/FormikInput";

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}
const initialValue: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  message: "",
};
export default function UpdateProfile() {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const [apiloading, setApiLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const router = useRouter();
  const Schema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .max(16, "First Name should be maximum 16 characters")
      .required("First Name is required"),
    lastName: Yup.string()
      .trim()
      .max(16, "Last Name should be maximum 16 characters")
      .required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    phoneNumber: Yup.string()
      .min(10, "Phone number is required")
      .max(10, "Phone number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    message: Yup.string().required("Message is required"),
  });
  const onSubmitHandler = async (value: typeof initialValue) => {
    setApiLoading(true);
    try {
      const url = `/contact`;
      const method = "post";
      await axiosService[method](url, value);
      router.push(`/response`);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
        }
      } else showError("Something went wrong");
      setApiLoading(false);
    }
  };
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={Schema}
      onSubmit={onSubmitHandler}>
      {() => {
        return (
          <Form className="space-y-6">
            <div>
              <FormikInput
                type="text"
                name="firstName"
                label="First name"
                validation={validation}
              />
            </div>
            <div>
              <FormikInput
                type="text"
                name="lastName"
                label="Last name"
                validation={validation}
              />
            </div>
            <div>
              <FormikInput
                type="email"
                name="email"
                label="Email"
                validation={validation}
              />
            </div>
            <div>
              <FormikInput
                type="phoneNumber"
                name="phoneNumber"
                label="Phone number"
                validation={validation}
              />
            </div>
            <div>
              <FormikTextArea
                type="message"
                name="message"
                label="Message"
                validation={validation}
              />
            </div>
            <div className="flex justify-end">
              <Button
                id="change-password"
                onMouseDown={() => setValidation(true)}
                loading={apiloading === true ? "true" : undefined}
                type="submit"
                className={`sm:w-20 inline-flex items-center py-1.5 px-2.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 ml-4`}>
                Submit
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

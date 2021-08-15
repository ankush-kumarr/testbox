import React, { useState } from "react";
import { FormikInput } from "../Common/FormikInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axiosService from "../Utils/axios";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import Button from "../Button";
import { useRouter } from "next/router";

const initialValue = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function UpdateProfile() {
  // To show loader in submit button if once clicked
  const [apiloading, setApiLoading] = useState(false);

  const [validation, setValidation] = useState(false);

  const router = useRouter();

  const Schema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, "Password is too short - should be 8 chars minimum")
      .required("Old Password is required"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Password is too short - should be 8 chars minimum")
      .when("oldPassword", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().notOneOf(
          [Yup.ref("oldPassword")],
          "Old and new password cannot be same"
        ),
      }),
    confirmPassword: Yup.string()
      .when("newPassword", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("newPassword")],
          "Both passwords need to be the same"
        ),
      })
      .required("Confirm Password is required"),
  });

  const UpdatePassword = async (
    value: typeof initialValue,
    { resetForm }: any
  ) => {
    setApiLoading(true);
    try {
      const { oldPassword, newPassword } = value;
      const userData = { oldPassword, newPassword };
      const response = await axiosService.put(
        "/users/update-password",
        userData
      );
      // console.log("response from change password", response);
      showSuccess(response.data.message);
      resetForm({ ...initialValue });
      setApiLoading(false);
    } catch (err) {
      // console.log("err from change password", err);
      //
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
      onSubmit={UpdatePassword}
    >
      {() => {
        return (
          <Form className="space-y-6">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">
                Change Password
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Please fill in details to change your password.
              </p>
            </div>
            <div>
              <FormikInput
                type="password"
                name="oldPassword"
                label="Old Password"
                validation={validation}
              />
            </div>
            <div>
              <FormikInput
                type="password"
                name="newPassword"
                label="New Password"
                validation={validation}
              />
            </div>
            <div>
              <FormikInput
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                validation={validation}
              />
            </div>
            <div className="flex justify-end">
              <button
                onMouseDown={() => router.push("/")}
                onClick={() => router.push("/")}
                type="button"
                className={` bg-white py-1.5 px-2.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500 `}
              >
                Cancel
              </button>
              <Button
                id="change-password"
                onMouseDown={() => setValidation(true)}
                loading={apiloading === true ? "true" : undefined}
                type="submit"
                className={`sm:w-20 inline-flex items-center py-1.5 px-2.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 ml-4`}
              >
                Update
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

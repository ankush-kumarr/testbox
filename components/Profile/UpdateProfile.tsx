import React, { useState, useEffect } from "react";
import { FormikInput } from "../Common/FormikInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axiosService from "../Utils/axios";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import Button from "../Button";
import {
  validateRequiredFirstName,
  validateRequiredLastName,
  validateRequiredOrg,
} from "../Utils/validators";
// validateRequiredEmail,

const initialValue = {
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  id: "",
};

export default function UpdateProfile() {
  const [data, setData] = useState({ ...initialValue });

  const router = useRouter();

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(true);

  const [apiloading, setApiLoading] = useState(false);

  const [validation, setValidation] = useState(false);

  const Schema = Yup.object().shape({
    firstName: validateRequiredFirstName(),
    lastName: validateRequiredLastName(),
    organization: validateRequiredOrg(),
    // email: validateRequiredEmail(),
  });

  const getProfileData = async () => {
    try {
      const response = await axiosService.get("/auth/me");
      // console.log("response from getProfileData", response);
      setData({
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        email: response.data.data.email,
        organization: response.data.data.organization,
        id: response.data.data.id,
      });
      setShowLoader(false);
    } catch (err) {
      // console.log("error from getProfileData", err);
      setShowLoader(false);
      if (err.response && err.response.data) {
        showError(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
        }
      } else showError("Something went wrong");
    }
  };

  const updateProfileData = async (value: typeof data) => {
    // console.log("value on submit", value);
    setApiLoading(true);
    try {
      const userData = {
        user: {
          firstName: value.firstName.trim(),
          lastName: value.lastName.trim(),
        },
        organization: value.organization.trim(),
      };
      const response = await axiosService.put(`/users/${value.id}`, userData);
      // console.log("response from put profile", response);
      showSuccess(response.data.message);
      setApiLoading(false);
      getProfileData();
    } catch (err) {
      // console.log("err from put profile", err);
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

  useEffect(() => {
    getProfileData();
  }, []);

  return showLoader ? (
    <div className="flex justify-center items-center my-32">
      <Loader />
    </div>
  ) : (
    <Formik
      initialValues={data}
      validationSchema={Schema}
      onSubmit={updateProfileData}
      enableReinitialize
    >
      {(formik) => {
        const { dirty } = formik;
        return (
          <Form className="space-y-6">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">
                Profile Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Please fill in your personal information.
              </p>
            </div>
            <div className="flex">
              <div className="w-full mr-4">
                <FormikInput
                  type="name"
                  name="firstName"
                  label="First Name"
                  validation={validation}
                />
              </div>
              <div className="w-full">
                <FormikInput
                  type="name"
                  name="lastName"
                  label="Last Name"
                  validation={validation}
                />
              </div>
            </div>
            <div>
              <FormikInput
                type="email"
                name="email"
                label="Work Email"
                disabled
              />
            </div>
            <div>
              <FormikInput
                type="text"
                name="organization"
                label="Organization"
                validation={validation}
              />
            </div>
            <div className="flex justify-end">
              <button
                onMouseDown={() => router.push("/")}
                onClick={() => router.push("/")}
                type="button"
                className={` mt-1 bg-white py-1.5 text-xs px-2.5 border border-gray-300 rounded-md shadow-sm  font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500 `}
              >
                Cancel
              </button>
              <Button
                id="update-profile"
                onMouseDown={() => setValidation(true)}
                loading={apiloading === true ? "true" : undefined}
                type="submit"
                className={`sm:w-20 text-xs mt-1 inline-flex items-center py-1.5 px-2.5 border border-transparent rounded-md shadow-sm  font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 ml-4 ${
                  !dirty ? "cursor-not-allowed" : ""
                }`}
                disabled={!dirty}
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

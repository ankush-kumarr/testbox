import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Button from "../Button";
import { useFormSubmitWithLoading } from "../Utils/hooks/useFormSubmitWithLoading";

import { FormikInput, FormikCheckbox } from "../Common/FormikInput";
import axiosService from "../Utils/axios";
import { useRouter } from "next/router";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import {
  validateRequiredEmail,
  validateRequiredFirstName,
  validateRequiredLastName,
  validateRequiredOrg,
} from "../Utils/validators";
import { useEffect, useState } from "react";

export default function SignUp() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      showSuccess("Already logged In");
      router.push("/");
    }
  }, []);

  //here below we have validation schema for the signup page
  const SignUpSchema = Yup.object().shape({
    firstName: validateRequiredFirstName(),
    lastName: validateRequiredLastName(),
    email: validateRequiredEmail(),
    org: validateRequiredOrg(),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum"),
    cnfpassword: Yup.string()
      .when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both passwords needs to be same"
        ),
      })
      .required("Confirm Password is required"),
    termAndCondition: Yup.bool().oneOf(
      [true],
      "Please accept Terms of Use & Privacy Policy"
    ),
  });

  const signUp = async (userObj: any) => {
    try {
      const resp = await axiosService.post("/auth/register", userObj);
      if (resp && resp.status === 201) {
        router.push("/signin");
      }
    } catch (err) {
      showError(err.response.data.message);
    }
  };

  const submitForm = async (values: typeof initialValues) => {
    const userObj = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };
    await signUp({ user: userObj, organization: values.org });
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    org: "",
    email: "",
    password: "",
    cnfpassword: "",
    termAndCondition: false,
  };

  const { onSubmitHandler, loading } = useFormSubmitWithLoading(submitForm);
  const [validation, setValidation] = useState(false);
  return (
    <>
      <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Get started with TestBox
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={initialValues}
              validationSchema={SignUpSchema}
              onSubmit={onSubmitHandler}>
              {() => {
                return (
                  <Form
                    className="space-y-6"
                    action="#"
                    method="POST"
                    noValidate>
                    <div>
                      <FormikInput
                        type="firstName"
                        name="firstName"
                        label="First Name"
                        validation={validation}
                      />
                    </div>
                    <div>
                      <FormikInput
                        type="lastName"
                        name="lastName"
                        label="Last Name"
                        validation={validation}
                      />
                    </div>
                    <div>
                      <FormikInput
                        type="email"
                        name="email"
                        label="Work Email"
                        validation={validation}
                      />
                    </div>
                    <div>
                      <FormikInput
                        type="text"
                        name="org"
                        label="Organization"
                        validation={validation}
                      />
                    </div>
                    <div>
                      <FormikInput
                        type="password"
                        name="password"
                        label="Password"
                        validation={validation}
                      />
                    </div>
                    <div>
                      <FormikInput
                        type="password"
                        name="cnfpassword"
                        label="Confirm Password"
                        validation={validation}
                      />
                    </div>
                    <FormikCheckbox
                      name="termAndCondition"
                      type="checkbox"
                      label="I agree to <strong>Terms of Use & Privacy Policy</strong>"
                      validation={validation}
                    />
                    <div>
                      <Button
                        id="sign-up"
                        onMouseDown={() => setValidation(true)}
                        type="submit"
                        loading={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                        Sign Up
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?{" "}
                    <Link href="/signin">
                      <a className="font-medium text-indigo-600 hover:text-indigo-500">
                        Login
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikInput } from "../Common/FormikInput";
import axiosService from "../Utils/axios";
import { useEffect, useState } from "react";
import Button from "../Button";
import { useFormSubmitWithLoading } from "../Utils/hooks/useFormSubmitWithLoading";

import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import { showError, showSuccess } from "../Toaster/ToasterFun";

export default function ResetPasswordForm() {
  const [showLoader, setShowLoader] = useState(true);
  const [token, setToken] = useState("");
  const router = useRouter();
  const SignInSchema = Yup.object().shape({
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
  });

  const getToken = (url: string) => {
    if (url.includes("token")) {
      return url.split("?")[1].split("=")[1];
    }
  };

  useEffect(() => {
    const token = getToken(router.asPath);
    setToken(token || "");
    localStorage.setItem("resetPasswordToken", token || "");
    if (token) {
      setShowLoader(false);
    }
  }, [showLoader]);

  const initialValues = {
    password: "",
    cnfpassword: "",
  };
  const submitForm = async (values: typeof initialValues) => {
    try {
      const resp = await axiosService.post("/auth/reset-password", {
        password: values.password,
        token: token,
      });
      if (resp && resp.status === 200) {
        const channel = new BroadcastChannel("app-data");
        channel.postMessage("doLogout");
        showSuccess("Password reset successfully");
        localStorage.clear();
        sessionStorage.clear();
        router.push("/signin");
      }
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const { onSubmitHandler, loading } = useFormSubmitWithLoading(submitForm);

  return (
    <>
      {showLoader ? (
        <div className=" flex justify-center items-center content-center m-56">
          <Loader />
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Setup your new password
              </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <Formik
                  initialValues={initialValues}
                  validationSchema={SignInSchema}
                  onSubmit={onSubmitHandler}
                >
                  {(formik) => {
                    const { errors, isValid, dirty } = formik;
                    return (
                      <Form className="space-y-6">
                        <div>
                          <FormikInput
                            type="password"
                            name="password"
                            label="New Password"
                          />
                        </div>
                        <div>
                          <FormikInput
                            type="password"
                            name="cnfpassword"
                            label="Confirm Password"
                          />
                        </div>
                        <div>
                          {typeof errors === "string" && (
                            <div className="text-red-600 mb-2 text-sm">
                              {errors}
                            </div>
                          )}
                          <Button
                            id="set-password"
                            type="submit"
                            loading={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!(dirty && isValid) ? "cursor-not-allowed" : ""
                              }`}
                          >
                            Set Password
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

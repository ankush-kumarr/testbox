import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Button from "../Button";
import { useFormSubmitWithLoading } from "../Utils/hooks/useFormSubmitWithLoading";

import { FormikInput, FormikCheckbox } from "../Common/FormikInput";
import axiosService from "../Utils/axios";
// import { AppContext } from "../Context/mainContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { showError, showSuccess } from "../Toaster/ToasterFun";

const SignIn = () => {
  // const userContext = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      showSuccess("Already logged In");
      router.push("/");
    }
  }, []);

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required")
      .matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "Email is not valid"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum"),
  });
  const initialValues = {
    email: "",
    password: "",
    remember_me: false,
  };

  async function doLogin(loginDetail: any) {
    const { remember_me = false } = loginDetail;
    delete loginDetail.remember_me;
    try {
      const userData = await axiosService.post("/auth/login", loginDetail);
      localStorage.setItem("role", userData.data.data.user.role);
      // userContext.userDetails = { ...userData.data.data.user };
      // userContext.token = { ...userData.data.data.token.accessToken };
      if (remember_me === true) {
        localStorage.setItem("token", userData.data.data.token.accessToken);
      } else {
        sessionStorage.setItem("token", userData.data.data.token.accessToken);
      }
      // showSuccess("Logged in successfully");
      router.push("/");
    } catch (error) {
      showError(error.response?.data?.message);
    }
  }

  const submitForm = async (values: typeof initialValues) => {
    const newValue: {
      email: string;
      password: string;
      remember_me?: boolean;
    } = { ...values };
    await doLogin(newValue);
  };

  const { onSubmitHandler, loading } = useFormSubmitWithLoading(submitForm);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={initialValues}
              validationSchema={SignInSchema}
              onSubmit={onSubmitHandler}
            >
              {() => {
                return (
                  <Form className="space-y-6" noValidate>
                    <div>
                      <FormikInput
                        type="email"
                        name="email"
                        label="Email Address"
                      />
                    </div>
                    <div>
                      <FormikInput
                        type="password"
                        name="password"
                        label="Password"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FormikCheckbox
                          type="checkbox"
                          name="remember_me"
                          label="Remember Me"
                        />
                      </div>
                      <div className="text-sm">
                        <Link href="/forgotpassword">
                          <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                            Forgot your password?
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Button
                        id="login-submit"
                        type="submit"
                        loading={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        Sign in
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
                    Don{"'"}t have an account?{" "}
                    <Link href="/signup">
                      <a className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
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
};

export default SignIn;

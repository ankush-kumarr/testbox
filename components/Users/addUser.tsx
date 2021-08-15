import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form, FormikValues } from "formik";
import { showError } from "../Toaster/ToasterFun";
import * as Yup from "yup";
import { FormikInput } from "../Common/FormikInput";
import Button from "../Button";
import Notification from "../Common/Notification";
import axiosService from "../Utils/axios";
import Loader from "../Loader/Loader";
interface InitVal {
  firstName: string;
  lastName: string;
  email: string | undefined;
  title: string;
}
const AddUser = () => {
  const initialValues: InitVal = {
    firstName: "",
    lastName: "",
    email: "",
    title: "",
  };
  const router = useRouter();
  const [loading, setLoading] = useState(
    router.pathname === "/users/add" ? false : true
  );
  const [initValues, setInitValues] = useState(initialValues);
  const [apiloading, setApiLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [fname, setFName] = useState("");
  const [lname, setLname] = useState("");
  const [validation, setValidation] = useState(false);
  const AddProjectSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .max(32, "First Name should be maximum 32 characters")
      .min(2, "First Name should be minimum 2 characters")
      .matches(
        /^(?=)[a-zA-Z æøåÆØÅ]+(?:[-' ][a-zA-Z æøåÆØÅ]+)*$/,
        "First Name is not valid"
      ),
    lastName: Yup.string()
      .trim()
      .required("Last Name is required")
      .max(32, "Last Name should be maximum 32 characters")
      .min(2, "Last Name should be minimum 2 characters")
      .matches(
        /^(?=)[a-zA-Z æøåÆØÅ]+(?:[-' ][a-zA-Z æøåÆØÅ]+)*$/,
        "Last Name is not valid"
      ),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required")
      .matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "Email is not valid"),
    title: Yup.string()
      .trim()
      .max(32, "First Name should be maximum 32 characters")
      .required("Title is required")
      .matches(
        /^(?=)[a-zA-Z0-9]+(?:[-' ][a-zA-Z0-9]+)*$/,
        "Title is not valid"
      ),
  });
  useEffect(() => {
    if (router?.query?.id) {
      getMemberData(router.query.id);
    }
  }, [router?.query]);

  const getMemberData = async (id: string | string[] | undefined) => {
    try {
      const userData = await axiosService.get("/users/" + id);
      setInitValues({
        firstName: userData.data.data.firstName,
        lastName: userData.data.data.lastName || "",
        email: userData.data.data.email,
        title: userData.data.data.title,
      });
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Something went wrong");
      }
      setLoading(false);
    }
  };
  //Function to add users
  const submitFormAddUser = async (values: InitVal, action: FormikValues) => {
    setApiLoading(true);
    try {
      if (router?.query?.id) {
        const newValues = { ...values };
        if (initValues.email === values.email) {
          delete newValues.email;
        }
        await axiosService.put(`/organizations/members/${router.query.id}`, {
          ...newValues,
        });
        // showSuccess("Successfully saved");
        router.push("/settings/users");
      } else {
        await axiosService.post("/organizations/members", values);
        // action.resetForm({ ...initialValues });
        setFName(
          values.firstName.charAt(0).toUpperCase() +
          values.firstName.slice(1, values.firstName.length)
        );
        setLname(
          values.lastName.charAt(0).toUpperCase() +
          values.lastName.slice(1, values.lastName.length)
        );
        router.push("/settings/users");
        // setShowNotification(true);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Something went wrong");
      }
    } finally {
      action.setSubmitting(false);
      setApiLoading(false);
    }
  };
  const renderNameLetter = () => {
    const firstLetter = fname.slice(0, 1).toUpperCase();
    const secondLetter = lname.slice(0, 1).toUpperCase();
    return firstLetter + secondLetter;
  };
  const cancelNotification = () => {
    setShowNotification(false);
  };

  const renderName = () => {
    let arr: string[] = [];
    arr = [...arr, ...fname.split(" ")];
    arr = [...arr, ...lname.split(" ")];
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1, arr[i].length);
    }
    return arr.join(" ");
  };
  if (loading) {
    return <Loader withoverlay={true} />;
  }
  return (
    <div className="flex items-center justify-center mt-12 sm:mx-4 md:mx-20 lg:mx-4  xl:mx-24  ">
      <div className="sm:w-2/3 w-2/3 md:w-2/3 lg:w-2/4 xl:w-1/3 ">
        <Formik
          initialValues={initValues}
          validationSchema={AddProjectSchema}
          onSubmit={submitFormAddUser}
          enableReinitialize
        >
          {(formik) => {
            const { dirty } = formik;
            return (
              <Form className="space-y-6" noValidate>
                <div>
                  <label className="block text-lg font-medium text-gray-900">
                    {router?.query?.id ? "Edit User Details " : "Add New User"}
                  </label>
                  <p className="block text-sm font-normal text-gray-500">
                    {router?.query?.id
                      ? "Please update the details of user"
                      : "Please fill in details for new user."}
                  </p>
                </div>
                <div>
                  <FormikInput
                    type="text"
                    name="firstName"
                    label="First Name"
                    validation={validation}
                  />
                </div>
                <div>
                  <FormikInput
                    type="text"
                    name="lastName"
                    label="Last Name"
                    validation={validation}
                  />
                </div>
                <div>
                  <FormikInput
                    type="text"
                    name="email"
                    label="Email"
                    disabled={router?.query?.id ? true : false}
                    validation={validation}
                  />
                </div>
                <div>
                  <FormikInput
                    type="text"
                    name="title"
                    label="Title"
                    validation={validation}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onMouseDown={() => router.back()}
                    type="button"
                    className={` bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500 `}
                  >
                    Cancel
                  </button>
                  <Button
                    id="add-user-submit"
                    onMouseDown={() => setValidation(true)}
                    loading={apiloading}
                    type="submit"
                    className={`ml-4  border border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${router?.query?.id && !dirty ? "cursor-not-allowed" : ""
                      }`}
                    disabled={router?.query?.id && !dirty ? true : false}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
        {showNotification && (
          <Notification
            setShowNotification={setShowNotification}
            heading={renderName()}
            subheading="has been added as new member"
            imgToShow={renderNameLetter()}
            primaryButtonText="Add Another"
            secondaryButtonText="Go Back"
            cancelFunction={() =>
              setTimeout(() => {
                cancelNotification();
              }, 300)
            }
            primaryButtonFunction={() =>
              setTimeout(() => {
                setShowNotification(false);
              }, 300)
            }
            secondaryButtonFunction={() => router.push("/settings/users")}
          />
        )}
      </div>
    </div>
  );
};

export default AddUser;

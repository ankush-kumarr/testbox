import { Formik, Form, FormikValues } from "formik";

import * as Yup from "yup";
import { FormikInput, FormikTextArea } from "../Common/FormikInput";
import axiosService from "../Utils/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { showError } from "../Toaster/ToasterFun";
import Loader from "../Loader/Loader";
import { FormSubmitPanel } from "../Common/FormSubmitPanel";

const AddProject = ({ onSubmit, mockRouter, setApiEndPoint }: any) => {
  const router = useRouter();
  const AddProjectSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(32, "Name should be maximum 32 characters")
      .required("Project Name is required"),
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
  const [loading, setLoading] = useState(
    router?.pathname === "/createproject" ? false : true
  );
  const [apiloading, setApiLoading] = useState(false);
  //Function to add project
  const submitFormAddProject = async (
    values: InitVal,
    action: FormikValues
  ) => {
    setApiLoading(true);
    if (onSubmit) {
      onSubmit(values);
    }
    if (mockRouter) {
      mockRouter.push("/");
    }
    // api implementation comes here
    try {
      if (router?.query?.pid) {
        if (setApiEndPoint) {
          setApiEndPoint(`/projects/${router.query.pid}`, values);
        }
        const newValues = { ...values };
        if (initValues.name === values.name) {
          delete newValues.name;
        }
        const data = { project: { ...newValues } };
        await axiosService.put(`/projects/${router.query.pid}`, data);
        // showSuccess("Successfully saved");
      } else {
        if (!values.description) {
          delete values.description;
        }
        if (setApiEndPoint) {
          setApiEndPoint(`/projects`, values);
        }
        await axiosService.post("/projects", values);
      }
      await axiosService.get(`/organizations/projects`)
        .then((response) => router.push(`projects/${response?.data.data[0].id}/overview`))
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
  useEffect(() => {
    if (router?.query?.pid) {
      getProjectData(router.query.pid);
    }
  }, [router?.query]);
  const returnToMainPage = () => {
    router.push("/");
    if (mockRouter) {
      mockRouter.push("/");
    }
  };

  const getProjectData = async (id: string | string[]) => {
    try {
      if (setApiEndPoint) {
        setApiEndPoint(`/projects/${id}`);
      }
      const projectData = await axiosService.get(`/projects/${id}`);
      setInitValues({
        name: projectData.data.data.name,
        description: projectData.data.data.description,
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
  return (
    <>
      {loading ? (
        <Loader withoverlay={true} />
      ) : (
        <div className="flex items-center justify-center mt-12 sm:mx-4 md:mx-20 lg:mx-4  xl:mx-24 ">
          <div className="sm:w-2/3 w-2/3 md:w-2/3 lg:w-2/4 xl:w-1/3 ">
            <Formik
              initialValues={initValues}
              validationSchema={AddProjectSchema}
              onSubmit={submitFormAddProject}
              enableReinitialize
            >
              {(formik) => {
                const { dirty } = formik;
                return (
                  <Form className="space-y-6" noValidate>
                    <div>
                      <label className="block text-base font-medium text-gray-900">
                        {router?.query?.pid
                          ? "Edit Project Details "
                          : "Create New Project"}
                      </label>
                      <p className="block text-sm font-normal text-gray-500">
                        {router?.query?.pid
                          ? "Please edit details of your project"
                          : "Please fill in details of your new project."}
                      </p>
                    </div>
                    <div>
                      <FormikInput
                        type="text"
                        name="name"
                        // placeholder="Enter Project Name"
                        label="Project Name"
                        datatest-id="manner-input"
                      />
                    </div>
                    <div>
                      <FormikTextArea
                        type="text"
                        name="description"
                        // placeholder="Enter Description"
                        label="Description"
                      />
                    </div>
                    <FormSubmitPanel
                      idForSubmit="project-create-edit"
                      onCancel={returnToMainPage}
                      loading={apiloading}
                      validSubmit={router?.query?.pid && !dirty ? true : false}
                      submitTitle={
                        router?.query?.pid ? "Edit Project" : "Create Project"
                      }
                    />
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProject;

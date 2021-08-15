import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FormikInput,
  FormikTextArea,
  FormikInputDateField,
} from "../Common/FormikInput";
import axiosService from "../Utils/axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { showError } from "../Toaster/ToasterFun";
import { FormSubmitPanel } from "../Common/FormSubmitPanel";
import Loader from "../Loader/Loader";
// import moment from "moment";

interface PropsType {
  editMilestone?: boolean;
  // viewMilestone?: boolean;
}

const AddEditMilestone = ({ editMilestone }: PropsType) => {
  const router = useRouter();

  // Schema for form validation
  const AddMilestoneSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(32, "Name should be maximum 32 characters")
      .required("Name is required"),
    description: Yup.string().trim().required("Description is required"),
    startDate: Yup.string()
      .trim()
      // .nullable()
      .required("Start Date is required"),
    endDate: Yup.string().trim().required("End Date is required"),
  });

  const [apiloading, setApiLoading] = useState(false); // loader for submit button while data is being saved
  const [validation, setValidation] = useState(false); // for form validation

  //
  const [showLoader, setShowLoader] = useState(editMilestone ? true : false); //show loader initially while data is being fetched

  // initial values for form
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const getMilestoneDetais = async () => {
    try {
      const response = await axiosService.get(
        `/milestones/${router?.query?.id}`
      );

      setInitialValues({
        ...response.data.data,
        endDate: new Date(response.data.data.endDate),
        startDate: new Date(response.data.data.startDate),
      });

      setShowLoader(false);
    } catch (err) {
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

  useEffect(() => {
    if (editMilestone && router?.query?.id) {
      getMilestoneDetais();
    }
  }, [router?.query?.pid, router?.query?.id]);

  const returnToMainPage = () =>
    router.push(`/projects/${router.query.pid}/milestones`);

  const submitFormAddMilestone = async (value: typeof initialValues) => {
    setApiLoading(true);
    try {
      const url = editMilestone
        ? `/milestones/${router?.query?.id}`
        : `/projects/${router?.query?.pid}/milestone`;

      const method = editMilestone ? "put" : "post";

      await axiosService[method](url, value);

      // To redirect to milestones listing page
      router.push(`/projects/${router.query.pid}/milestones`);
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

  return showLoader ? (
    <Loader withoverlay={true} />
  ) : (
    <>
      <div className="flex items-center justify-center mt-12 sm:mx-4 md:mx-20 lg:mx-4  xl:mx-24 ">
        <div className="sm:w-2/3 w-2/3 md:w-2/3 lg:w-2/4 xl:w-1/3">
          <Formik
            initialValues={initialValues}
            validationSchema={AddMilestoneSchema}
            onSubmit={submitFormAddMilestone}
            enableReinitialize
          >
            {(formik) => {
              const { dirty, values } = formik;
              return (
                <Form className="space-y-6">
                  <div>
                    <h1 className="text-lg leading-6 font-medium text-gray-900">
                      {editMilestone
                        ? "Edit Milestone"
                        : "Create New Milestone"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      {editMilestone
                        ? "Please update details of your milestone."
                        : "Please fill in details of your new milestone."}
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

                  {!editMilestone ? (
                    <>
                      <div>
                        <FormikInputDateField
                          type="date"
                          name="startDate"
                          label="Start Date"
                          validation={validation}
                          minDate={new Date()}
                          maxDate={
                            values.endDate
                              ? new Date(values.endDate)
                              : undefined
                          }
                        />
                      </div>

                      <div>
                        <FormikInputDateField
                          type="date"
                          name="endDate"
                          label="End Date"
                          validation={validation}
                          minDate={
                            values.startDate
                              ? new Date(values.startDate)
                              : new Date()
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <FormikInputDateField
                          type="date"
                          name="startDate"
                          label="Start Date"
                          validation={validation}
                          minDate={new Date(initialValues.startDate)}
                          maxDate={
                            values.endDate
                              ? new Date(values.endDate)
                              : undefined
                          }
                        />
                      </div>

                      <div>
                        <FormikInputDateField
                          type="date"
                          name="endDate"
                          label="End Date"
                          validation={validation}
                          minDate={
                            values.startDate
                              ? new Date(values.startDate)
                              : new Date(initialValues.startDate)
                          }
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <FormikTextArea
                      type="text"
                      name="description"
                      label="Description"
                      validation={validation}
                    />
                  </div>

                  <FormSubmitPanel
                    idForSubmit={
                      editMilestone ? "edit-milestone" : "add-milestone"
                    }
                    validateFunc={() => setValidation(true)}
                    onCancel={returnToMainPage}
                    loading={apiloading}
                    validSubmit={router?.query?.id && !dirty ? true : false}
                    submitTitle={editMilestone ? "Update" : "Create"}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddEditMilestone;

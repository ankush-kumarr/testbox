import { FormikHelpers, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import {
  FormikInput,
  FormikSelect,
  FormikTextArea,
} from "../Common/FormikInput";
import { useRouter } from "next/router";
import { useFormSubmitWithLoading } from "../Utils/hooks/useFormSubmitWithLoading";
import { FormSubmitPanel } from "./component/FormSubmitPanel";

const AddProjectSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  preconditions: Yup.string().trim().required("Preconditions are required"),
  steps: Yup.string().trim().required("Steps are required"),
  expectedresult: Yup.string().trim().required("Expected Results are required"),
});

interface InitVal {
  title: string | string[] | undefined;
  expectedresult: string | string[] | undefined;
  preconditions: string | string[] | undefined;
  steps: string | string[] | undefined;
  executionPriority: string | string[] | undefined;
  sectionId: string | string[] | undefined;
}

export type TestFormProps = {
  onSubmit: (values: InitVal, formikHelpers?: FormikHelpers<InitVal>) => void;
  onCancel: () => void;
  initialValues: InitVal;
  heading?: string;
  subheading?: string;
  optionsForSelect?: any[];
  EditMany?: boolean;
  onSubmitNext?: boolean;
};

const TestForm = ({
  onCancel,
  onSubmit,
  initialValues,
  heading,
  subheading,
  optionsForSelect,
  EditMany,
  onSubmitNext,
}: TestFormProps) => {
  const router = useRouter();
  const { onSubmitHandler, loading } = useFormSubmitWithLoading(onSubmit);
  const [validation, setValidation] = useState(false);
  return (
    <div className="flex items-center justify-center mt-12 sm:mx-4 md:mx-20 lg:mx-4  xl:mx-16 ">
      <div className="sm:w-2/3 w-2/3 md:w-2/3 lg:w-2/4 xl:w-1/3 ">
        <div className="mb-6 ">
          <p className="text-lg leading-6 font-medium text-gray-900">
            {heading}
          </p>
          <p className="text-sm mt-1 text-gray-500">{subheading}</p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={EditMany ? null : AddProjectSchema}
          onSubmit={onSubmitHandler}
          enableReinitialize>
          {(formik) => {
            const { dirty } = formik;
            return (
              <Form className="space-y-6" noValidate>
                {!EditMany && (
                  <div>
                    <FormikInput
                      type="text"
                      name="title"
                      // placeholder="Enter Title"
                      label="Title"
                      validation={validation}
                    />
                  </div>
                )}
                <div>
                  <FormikSelect
                    type="text"
                    name="sectionId"
                    // placeholder="Enter Title"
                    label="Section"
                    validation={validation}
                    optionsForSelect={
                      EditMany && optionsForSelect
                        ? [
                            { name: "Not selected", id: "" },
                            ...optionsForSelect,
                          ]
                        : optionsForSelect
                    }
                  />
                </div>
                <div>
                  <FormikSelect
                    type="text"
                    name="executionPriority"
                    // placeholder="Enter Title"
                    label="Priority"
                    validation={validation}
                    optionsForSelect={
                      EditMany
                        ? [
                            { name: "Not selected", id: "" },
                            { name: "Low", id: "LOW" },
                            { name: "High", id: "HIGH" },
                            { name: "Medium", id: "MEDIUM" },
                            { name: "Critical", id: "CRITICAL" },
                          ]
                        : [
                            { name: "Low", id: "LOW" },
                            { name: "High", id: "HIGH" },
                            { name: "Medium", id: "MEDIUM" },
                            { name: "Critical", id: "CRITICAL" },
                          ]
                    }
                  />
                </div>
                <div>
                  <FormikTextArea
                    type="text"
                    name="preconditions"
                    // placeholder="Enter Pre-conditions"
                    label="Preconditions"
                    validation={validation}
                  />
                </div>
                <div>
                  <FormikTextArea
                    type="text"
                    name="steps"
                    // placeholder="Enter Steps"
                    label="Steps"
                    validation={validation}
                  />
                </div>
                <div>
                  <FormikTextArea
                    type="text"
                    name="expectedresult"
                    // placeholder="Enter Expected Result"
                    label="Expected Result"
                    validation={validation}
                  />
                </div>
                {!onSubmitNext ? (
                  <FormSubmitPanel
                    idForSubmit="test-case-create-edit"
                    validateFunc={() => setValidation(true)}
                    onCancel={onCancel}
                    loading={loading}
                    // validSubmit={router?.query?.id && !dirty ? true : false}
                    validSubmit={
                      EditMany
                        ? false
                        : router?.query?.id && !dirty
                        ? true
                        : false
                    }
                    submitTitle={
                      EditMany
                        ? "Edit Test Cases"
                        : router.query.id
                        ? "Edit Test Case"
                        : "Add & Next"
                    }
                  />
                ) : (
                  <div className="flex flex-row justify-end">
                    <FormSubmitPanel
                      onClick={() => {
                        // @ts-ignore
                        delete formik.values["next"];
                        formik.submitForm();
                      }}
                      type="button"
                      idForSubmit="test-case-create-edit-1"
                      validateFunc={() => setValidation(true)}
                      onCancel={onCancel}
                      loading={loading}
                      // validSubmit={router?.query?.id && !dirty ? true : false}
                      validSubmit={
                        EditMany
                          ? false
                          : router?.query?.id && !dirty
                          ? true
                          : false
                      }
                      submitTitle={
                        EditMany
                          ? "Edit Test Cases"
                          : router.query.id
                          ? "Edit Test Case"
                          : "Add Test Case"
                      }
                    />
                    <FormSubmitPanel
                      onClick={() => {
                        // @ts-ignore
                        formik.values.next = true;
                        formik.submitForm();
                      }}
                      type="button"
                      idForSubmit="test-case-create-edit-2"
                      validateFunc={() => setValidation(true)}
                      loading={loading}
                      // validSubmit={router?.query?.id && !dirty ? true : false}
                      validSubmit={
                        EditMany
                          ? false
                          : router?.query?.id && !dirty
                          ? true
                          : false
                      }
                      submitTitle={
                        EditMany
                          ? "Edit Test Cases"
                          : router.query.id
                          ? "Edit Test Case"
                          : "Add & Next"
                      }
                    />
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
export default TestForm;

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosService from "../Utils/axios";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import TestForm from "./TestForm";
import Loader from "../Loader/Loader";

interface InitVal {
  title: string | string[] | undefined;
  expectedresult: string | string[] | undefined;
  preconditions: string | string[] | undefined;
  steps: string | string[] | undefined;
  sectionId: string | string[] | undefined;
  executionPriority: string | string[] | undefined;
}

const AddTestCase = () => {
  const router = useRouter();

  const createTestCases = async (testCaseObj: any) => {
    const resp = await axiosService.post(
      `/projects/${testCaseObj?.projectId}/test-cases`,
      { testcase: testCaseObj?.testcase, sectionId: testCaseObj?.sectionId }
    );
    return resp;
  };

  const submitFormAddProject = async (values: typeof initialValues, { resetForm }: any) => {
    const testCaseObj = {
      title: values.title,
      preconditions: values.preconditions,
      steps: values.steps,
      expectedResults: values.expectedresult,
      executionPriority: values.executionPriority,
    };
    try {
      const resp = await createTestCases({
        testcase: testCaseObj,
        projectId: router.query.pid,
        sectionId: values.sectionId,
      });
      if (resp && resp.status === 201) {
        showSuccess("Test case added successfully");
        // @ts-ignore
        values.next ? resetForm() : returnToPage();

      }
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const returnToPage = () => {
    router.push(`/projects/${router.query.pid}/testcases`);
  };

  const [initialValues, setInitialValue] = useState<InitVal>({
    title: "",
    preconditions: "",
    steps: "",
    expectedresult: "",
    sectionId: router?.query?.sectionId || "",
    executionPriority: "MEDIUM",
  });
  const [loadingPage, setLoadingPage] = useState(true);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    getSelectOptions();
  }, [router?.query]);
  const getSelectOptions = async () => {
    try {
      if (router?.query?.pid) {
        const response = await axiosService.get(
          "/projects/" + router?.query?.pid + "/sections"
        );
        setOptions(response.data.data.data);
        if (!router?.query?.sectionId) {
          setInitialValue({
            title: "",
            preconditions: "",
            steps: "",
            expectedresult: "",
            executionPriority: "MEDIUM",
            sectionId: response.data.data.data[0].id,
          });
        }
        setLoadingPage(false);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Something went wrong");
      }
      setLoadingPage(false);
    }
  };
  if (loadingPage) {
    return (
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-8">
        <div className="w-full sm:w-2/3 justify-center flex mx-auto  my-32">
          <Loader />
        </div>
      </div>
    );
  }
  return (
    <>
      <TestForm
        onCancel={returnToPage}
        onSubmit={submitFormAddProject}
        onSubmitNext={true}
        initialValues={initialValues}
        heading="Add New Test Case"
        subheading="Please fill in details of your new test case."
        optionsForSelect={options}
      />
    </>
  );
};

export default AddTestCase;

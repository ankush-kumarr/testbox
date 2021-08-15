import { useRouter } from "next/router";
import axiosService from "../Utils/axios";
import { showError } from "../Toaster/ToasterFun";
import TestForm from "./TestForm";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";

const EditTestCase = () => {
  const router = useRouter();
  const [data, setData] = useState<any>({
    title: "",
    preconditions: "",
    steps: "",
    expectedresult: "",
    executionPriority: "",
    sectionId: "",
  });
  const [options, setOptions] = useState([]);
  const createTestCases = async (testCaseObj: any) => {
    const resp = await axiosService.put(
      `/projects/${testCaseObj?.projectId}/test-cases/${router?.query?.id}`,
      testCaseObj?.testcase
    );
    return resp;
  };

  const GetTestCaseDetail = async (projectId: any, id: any) => {
    try {
      const response = await axiosService.get(
        `/projects/${projectId}/test-cases/${id}`
      );
      const optionsresponse = await axiosService.get(
        "/projects/" + projectId + "/sections"
      );
      setOptions(optionsresponse.data.data.data);
      // console.log("response GetTestCaseDetail ", response.data.data);
      setData(response.data.data);
    } catch (err) {
      showError(err.response?.data?.message);
    }
  };

  useEffect(() => {
    if (router?.query?.id && router?.query?.pid) {
      GetTestCaseDetail(router?.query?.pid, router?.query?.id);
    }
  }, [router]);

  const submitFormEditProject = async (values: typeof initialValues) => {
    const testCaseObj = {
      title: values.title,
      preconditions: values.preconditions,
      steps: values.steps,
      expectedResults: values.expectedresult,
      executionPriority: values.executionPriority,
      sectionId: values.sectionId,
    };

    if (data?.title === values?.title) {
      delete testCaseObj.title;
    }
    try {
      const resp = await createTestCases({
        testcase: testCaseObj,
        projectId: router.query.pid,
      });
      if (resp && resp.status === 200) {
        // showSuccess("Successfully saved");
        returnToPage();
      }
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const returnToPage = () => {
    router.push(`/projects/${router.query.pid}/testcases`);
  };

  const initialValues = {
    title: data?.title,
    preconditions: data?.preconditions,
    steps: data?.steps,
    expectedresult: data?.expectedResults,
    executionPriority: data?.executionPriority,
    sectionId: data?.section?.id,
  };
  if (initialValues?.title) {
    return (
      <TestForm
        onCancel={returnToPage}
        onSubmit={submitFormEditProject}
        initialValues={initialValues}
        heading="Edit Test Case"
        subheading="Please update details of your test case."
        optionsForSelect={options}
      />
    );
  }
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-8">
      <div className="w-full sm:w-2/3 justify-center flex mx-auto  my-32">
        <Loader />
      </div>
    </div>
  );
};

export default EditTestCase;

import axiosService from "../Utils/axios";
import { showError } from "../Toaster/ToasterFun";
import moment from "moment";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import Button from "../Button";
import TestViewCard, { ExpectedResultCard } from "./TestViewCard";
// import TestCaseProjectNameHeader from "./component/TestCaseProjectNameHeader";
const TestView = () => {
  const router = useRouter();
  const [data, setData] = useState<any>({
    title: "",
    preconditions: "",
    steps: "",
    expectedresult: "",
    sectionName: "",
    priority: "",
  });
  const [loading, setLoading] = useState(true);
  const GetTestCaseDetail = async (projectId: any, id: any) => {
    try {
      const response = await axiosService.get(
        `/projects/${projectId}/test-cases/${id}`
      );
      // console.log("response in project details", response);
      setData(response?.data?.data);
      setLoading(false);
    } catch (err) {
      if (err?.response?.data?.message) {
        showError(err.response?.data?.message);
      } else {
        showError("Something went wrong");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (router?.query?.id && router?.query?.pid) {
      GetTestCaseDetail(router?.query?.pid, router?.query?.id);
    }
  }, [router]);
  const returnToPage = () => {
    router.push(`/projects/${router.query.pid}/testcases`);
  };
  return (
    <>
      {loading && <Loader withoverlay={true} />}
      <div className=" max-w-full mx-40 sm:mx-48 md:mx-60 lg:mx-96 pt-10  px-4   ">
        {/* <TestCaseProjectNameHeader projectName={data?.project?.name} /> */}
        <div className="w-full mx-auto">
          <div className="mb-6 ">
            <p className="text-base leading-6 font-medium text-gray-800">
              Test Case Details
            </p>
            <p className="text-sm mt-1 text-gray-500">
              {/* Please fill in details of your testcase */}
              View the details of the test case
            </p>
          </div>
          <div className="flex justify-between  px-4 py-3  bg-gray-50 border border-gray-200 shadow ">
            <TestViewCard text={data?.testcaseId} label="ID" />
            <TestViewCard text={data?.section?.name} label="Section" />
            <TestViewCard text={data?.executionPriority} label="Priority" />
            <TestViewCard
              text={moment(data?.createdAt).format("MMMM DD, YYYY")}
              label="Created On"
            />
          </div>
          <div className="mt-4">
            <ExpectedResultCard text={data?.title} label="Title" />
            <ExpectedResultCard
              text={data?.preconditions}
              label="Preconditions"
            />
            <ExpectedResultCard text={data?.steps} label="Steps" />
            <ExpectedResultCard
              text={data?.expectedResults}
              label="Expected Result"
            />

          </div>
          <div className="flex justify-end pt-0.5 pb-10">
            <Button
              id="back-test-view"
              onMouseDown={returnToPage}
              type="button"
              className={`ml-4 border border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default TestView;

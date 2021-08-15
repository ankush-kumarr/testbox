import { useRouter } from "next/router";
import axiosService from "../Utils/axios";
import { showError } from "../Toaster/ToasterFun";
import TestForm from "./TestForm";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { XCircleIcon } from "@heroicons/react/solid";

const EditManyTestCase = () => {
  const router = useRouter();

  const initialValues = {
    title: "",
    preconditions: "",
    steps: "",
    expectedresult: "",
    executionPriority: "",
    sectionId: "",
  };

  const [options, setOptions] = useState([]);

  const Edit_Many_TestCase = async (testCaseObj: any) => {
    const resp = await axiosService.put(
      `/projects/${testCaseObj?.projectId}/test-cases`,
      testCaseObj?.testcase
    );
    return resp;
  };

  // To store filtered data for Table component
  const [Row, setRowData] = useState<any[]>([]);

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(true);

  const GetDetails = async (projectId: any) => {
    try {
      const optionsresponse = await axiosService.get(
        "/projects/" + projectId + "/sections"
      );

      const response = await axiosService.get(
        `/projects/${projectId}/test-cases`
      );

      let ids = localStorage.getItem("testCaseIds");
      ids = ids && JSON.parse(ids);

      let newData: any[] = [];
      for (const item of response?.data?.data) {
        // @ts-ignore
        const res = item.testcases.filter((val) => ids.indexOf(val.id) > -1);
        newData = [...newData, ...res];
      }

      setRowData(newData);
      setShowLoader(false);
      setOptions(optionsresponse.data.data.data);
    } catch (err) {
      showError(err.response?.data?.message);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (router?.query?.pid) {
      GetDetails(router?.query?.pid);
    }
  }, [router]);

  const submitFormEditProject = async (values: typeof initialValues) => {
    if (Row.length === 0)
      return showError(
        "No test case selected. Please refresh the page or go back and select again."
      );
    let value = {};

    for (const val in values) {
      // @ts-ignore
      if (values[val]) {
        value =
          val === "expectedresult"
            ? { ...value, expectedResults: values[val] }
            : // @ts-ignore
            { ...value, [val]: values[val] };
      }
    }

    if (Object.keys(value).length === 0 && value.constructor === Object) {
      showError("You need to update at least one field.");
      return;
    }

    const ids = Row.map((val) => val.id);

    const testCaseObj = {
      value,
      sectionId: values.sectionId,
      testCaseIds: ids,
    };

    try {
      const resp = await Edit_Many_TestCase({
        testcase: testCaseObj,
        projectId: router.query.pid,
      });
      if (resp && resp.status === 200) {
        // showSuccess("Successfully saved");
        localStorage.removeItem("testCaseIds");
        returnToPage();
      }
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const returnToPage = () => {
    router.push(`/projects/${router.query.pid}/testcases`);
  };

  const viewTestCase = (id: string) => {
    router.push(`/projects/${router.query.pid}/testcase/${id}`);
  };

  return showLoader ? (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-8">
      <div className="w-full sm:w-2/3 justify-center flex mx-auto  my-32">
        <Loader />
      </div>
    </div>
  ) : (
    <div>
      <div className="customScroll max-w-lg mx-auto border-4 border-double rounded-lg max-h-72 overflow-auto p-2 mt-12">
        <table className="w-full pt-10 px-4 divide-y divide-gray-200 ">
          <thead className="bg-blue-50">
            <tr>
              <th
                scope="col"
                className="pr-6 pl-2 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider w-8/12"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider"
                id="action-header"
              >
                {/* Action */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Row.map((val, i) => (
              <tr key={i} className="bg-white  rounded">
                <td className="pr-6 pl-2 py-4 whitespace-nowrap text-xs font-medium text-gray-900 ">
                  <a
                    onClick={() => viewTestCase(val.id)}
                    className="truncate hover:text-gray-600 hover:underline cursor-pointer"
                  >
                    <span>{val.testcaseId}</span>
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500  ">
                  <a
                    onClick={() => viewTestCase(val.id)}
                    className="truncate hover:text-blue-600 hover:underline cursor-pointer"
                  >
                    <span>
                      {val.title.length > 60
                        ? val.title.slice(0, 55) + "..."
                        : val.title}
                    </span>
                  </a>
                </td>
                <td
                  id="action-value"
                  className=" px-6 py-4 whitespace-nowrap text-right "
                >
                  <div className="flex justify-end">
                    <XCircleIcon
                      onClick={() => {
                        setRowData(Row.filter((item) => item.id !== val.id));
                      }}
                      className="text-red-400 h-6 w-5 cursor-pointer mr-1"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TestForm
        onCancel={returnToPage}
        initialValues={initialValues}
        // @ts-ignore
        onSubmit={submitFormEditProject}
        heading="Edit Selected Test Cases"
        subheading="Please update details of selected test cases."
        EditMany={true}
        optionsForSelect={options}
      />
    </div>
  );
};

export default EditManyTestCase;

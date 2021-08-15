import axiosService from "../Utils/axios";
import { showError } from "../Toaster/ToasterFun";
import Pagination from "../TestRun/component/Pagination";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment } from "react";
import Loader from "../Loader/Loader";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import PopUp from "./component/PopUp";
import TestCaseCard, { ExpectedResultCard } from "./TestCaseCard";
import moment from "moment";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// const Card = ({
//   label,
//   text,
//   comment,
// }: {
//   label: string;
//   text?: string;
//   comment?: string;
// }) => {
//   return (
//     <div className="my-7">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>

//       <div
//         style={{
//           height: "80px",
//         }}
//       >
//         {comment ? (
//           <div
//             className="text-sm text-gray-400 italic border p-2 mt-1 min-h-78 rounded-md overflow-auto h-full whitespace-pre-wrap"
//             dangerouslySetInnerHTML={{
//               __html: marked(comment),
//             }}
//           />
//         ) : text ? (
//           <div
//             className="text-sm font-medium border p-2 mt-1 min-h-78 rounded-md overflow-auto h-full whitespace-pre-wrap"
//             dangerouslySetInnerHTML={{
//               __html: marked(text),
//             }}
//           />
//         ) : null}
//       </div>
//     </div>
//   );
// };

const TestCaseDetail = ({ page, submitStatus }: any) => {
  const router = useRouter();

  //for popUp
  const [openPopUp, setOpenPopUp] = useState(false);

  // for storing status and id
  const [statusData, setStatusData] = useState({
    status: "",
    id: "",
  });

  // for catching comment from popUp component and to update status and comment and to close popUP component
  const submitData = async (text: string, doNotUpdate?: boolean) => {
    if (doNotUpdate) return setOpenPopUp(false);
    setOpenPopUp(false);

    const res: boolean = text
      ? await submitStatus(statusData.id, {
        status: statusData.status,
        comment: text,
      })
      : await submitStatus(statusData.id, { status: statusData.status });

    res && getTestRunResult();
  };

  // pagination props
  const [paginationData, setPaginationData] = useState({
    itemCount: 0,
    page: 0,
    pageCount: 0,
    take: 0,
  });

  interface DataType {
    comment: null | string;
    id: string;
    sectionDescription: string;
    sectionName: string;
    status: string;
    testCaseExpectedResults: string;
    testCaseId: number | string;
    testCasePreconditions: string;
    testCaseSteps: string;
    testCaseTitle: string;
    createdAt: string;
    testCaseExecutionPriority: string;
  }

  // To store data
  const [data, setData] = useState<DataType>({
    comment: "",
    id: "",
    sectionDescription: "",
    sectionName: "",
    status: "",
    testCaseExpectedResults: "",
    testCaseId: "",
    testCasePreconditions: "",
    testCaseSteps: "",
    testCaseTitle: "",
    createdAt: "",
    testCaseExecutionPriority: "",
  });

  // for pagination
  const [PageNum, setPageNum] = useState(page);

  // To show loader while data is being fetched
  const [loading, setLoading] = useState(true);

  // fetching data from api
  const getTestRunResult = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get(
        `/test-suites/${router.query.id}/test-results?order=ASC&page=${PageNum}&take=1`
      );
      setData(response?.data?.data?.data?.[0]);
      setPaginationData(response.data.data.meta);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
          return;
        }
        showError(err.response.data.message);
      } else showError("Something went wrong");
    }
  };

  useEffect(() => {
    getTestRunResult();
  }, [PageNum]);

  // console.log(data)

  return (
    <>
      <PopUp open={openPopUp} submitData={submitData} />

      {loading && <Loader withoverlay={true} />}

      <div className="  max-w-full mx-40 sm:mx-48 md:mx-60 lg:mx-96 mt-4  px-4">
        <div className="w-full ">
          <div className="flex justify-between  items-center">
            <div className="pb-1">
              <p className="text-base font-medium text-gray-800">
                Test Case Details
              </p>
              <p className="text-sm text-gray-500">
                {/* Please fill in details of your testcase */}
                View the details of the test case
              </p>
            </div>
            <div className="flex">
              <Pagination
                setPageNum={setPageNum}
                paginationData={paginationData}
              />
              {data?.status && (
                <div className="w-24">
                  <div className={`inline-flex justify-between rounded-md  `}>
                    <span
                      className={`mr-2 capitalize flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${data?.status === "PASSED"
                        ? "bg-green-100 text-green-800"
                        : data?.status === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-200 text-gray-00"
                        }`}>
                      {data?.status.toLowerCase()}
                    </span>

                    <Menu as="span" className="relative flex items-center">
                      {({ open }) => (
                        <>
                          <Menu.Button
                            className={`w-8 h-8 bg-white flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none ${open && "ring-2 ring-offset-2 ring-purple-500"
                              }`}>
                            <span className="sr-only">Open options</span>
                            <DotsVerticalIcon
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">
                            <Menu.Items
                              // static
                              style={{
                                transform: "translateX(120%)",
                              }}
                              className="mx-3 cursor-pointer origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      onClick={() => {
                                        setStatusData({
                                          ...statusData,
                                          status: "FAILED",
                                          id: data.id,
                                        });
                                        setOpenPopUp(true);
                                      }}
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "group flex items-center px-4 py-2 text-sm"
                                      )}>
                                      Failed
                                    </a>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      onClick={() => {
                                        setStatusData({
                                          ...statusData,
                                          status: "PASSED",
                                          id: data.id,
                                        });
                                        setOpenPopUp(true);
                                      }}
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "group flex items-center px-4 py-2 text-sm"
                                      )}>
                                      Passed
                                    </a>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      onClick={() => {
                                        setStatusData({
                                          ...statusData,
                                          status: "UNTESTED",
                                          id: data.id,
                                        });
                                        setOpenPopUp(true);
                                      }}
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "group flex items-center px-4 py-2 text-sm"
                                      )}>
                                      Untested
                                    </a>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* {data?.comment && <Card text={data?.comment} label="Comment" />} */}

          <div className="flex justify-between  px-4 py-3  bg-gray-50 border border-gray-200 shadow ">
            <TestCaseCard text={data?.testCaseId} label="ID" />

            <TestCaseCard text={data?.sectionName} label="Section" />

            <TestCaseCard
              text={data?.testCaseExecutionPriority}
              label="Priority"
            />

            <TestCaseCard
              text={moment(data?.createdAt).format("MMMM DD, YYYY")}
              label="Created On"
            />
          </div>

          <ExpectedResultCard text={data?.testCaseTitle} label="Title" />
          <ExpectedResultCard
            text={data?.testCasePreconditions}
            label="Preconditions"
          />
          <ExpectedResultCard text={data?.testCaseSteps} label="Steps" />
          <ExpectedResultCard
            text={data?.testCaseExpectedResults}
            label="Expected Result"
          />

          {data?.comment ? (
            <ExpectedResultCard text={data.comment} label="Comment" />
          ) : (
            <ExpectedResultCard text={"No comment added."} label="Comment" />
          )}
        </div>
      </div>
    </>
  );
};

export default TestCaseDetail;

import axiosService from "../Utils/axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import { showError } from "../Toaster/ToasterFun";
import Table from "./Component/Table";
import Button from "../Button";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/solid";

type RowDataType = {
  createdAt: string;
  description: string;
  endDate: string;
  id: string;
  name: string;
  startDate: string;
  status: string;
  updatedAt: string;
  testsuites: any[];
}[];

interface RowData {
  OPEN: RowDataType;
  COMPLETED: RowDataType;
}

export default function TestRunList() {
  const router = useRouter();

  const [state, setstate] = useState({ showOpen: true, showCompleted: true });

  // To store data for Table component
  const [Row, setRowData] = useState<RowData>();
  // const [Row, setRowData] = useState({open:RowData[]});

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(true);

  // To show loader in button while data is being saved
  const [buttonLoader, setButtonLoader] = useState(false);

  // To get milestones data
  const GetData = async () => {
    try {
      const response = await axiosService.get(
        `projects/${router.query.pid}/milestones`
      );

      const data = response?.data?.data;

      // console.log("data from mile ", data);

      setRowData({
        OPEN: data?.filter((val: any) => val.status === "OPEN"),
        COMPLETED: data?.filter((val: any) => val.status === "COMPLETED"),
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
          return;
        }
      } else showError("Something went wrong");
    }
  };

  const editMilestone = (id: string) => {
    router.push(`/projects/${router.query.pid}/editMilestone/${id}`);
  };

  const viewMilestone = (id: string) => {
    router.push(`/projects/${router.query.pid}/milestone/${id}/`);
  };

  useEffect(() => {
    if (router?.query?.pid) GetData();
  }, [router?.query?.pid]);

  return (
    <div>
      {showLoader ? (
        <div className="flex justify-center items-center content-center my-32">
          <Loader />
        </div>
      ) : (
        <>
          <main className="pb-14">
            <div className="px-2 sm:px-2 ">
              <h1 className="sr-only">Page title</h1>
              {/* Main 3 column grid */}
              <div className="grid items-start  grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-2">
                {/* Left column */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-2 mt-3 ml-2 mr-6 ">
                  <section aria-labelledby="participants_section">
                    <div className="overflow-hidden bg-white">
                      <div className="px-4 pt-4">
                        <div
                          onClick={() =>
                            setstate({ ...state, showOpen: !state.showOpen })
                          }
                          className="cursor-pointer flex items-center justify-between bg-gray-200 mb-4 lg:mx-2 rounded">
                          <div className=" px-4 py-2 bg-gray-200 mr-4 rounded text-sm ">
                            Open ({Row?.OPEN?.length ? Row?.OPEN?.length : 0})
                          </div>

                          {state.showOpen ? (
                            <ChevronDownIcon className="text-gray-600 h-5 w-5 cursor-pointer mr-3" />
                          ) : (
                            <ChevronRightIcon className="text-gray-600 h-5 w-5 cursor-pointer mr-3" />
                          )}
                        </div>
                        {state.showOpen &&
                          (Row?.OPEN && Row?.OPEN?.length > 0 ? (
                            <Table
                              RowData={Row?.OPEN}
                              getMilestones={GetData}
                              editMilestone={editMilestone}
                              viewMilestone={viewMilestone}
                            />
                          ) : (
                            <div className="flex justify-center items-center content-center mb-1 text-gray-500 text-xs font-medium italic">
                              No active open milestone.
                            </div>
                          ))}
                      </div>

                      <div className="px-4 pt-2">
                        <div
                          onClick={() =>
                            setstate({
                              ...state,
                              showCompleted: !state.showCompleted,
                            })
                          }
                          className="cursor-pointer flex items-center justify-between bg-gray-200 mb-4 lg:mx-2 rounded">
                          <div className=" px-4 py-2 bg-gray-200 mr-4 rounded text-sm ">
                            Completed (
                            {Row?.COMPLETED?.length
                              ? Row?.COMPLETED?.length
                              : 0}
                            )
                          </div>

                          {state.showCompleted ? (
                            <ChevronDownIcon className="text-gray-600 h-5 w-5 cursor-pointer mr-3" />
                          ) : (
                            <ChevronRightIcon className="text-gray-600 h-5 w-5 cursor-pointer mr-3" />
                          )}
                        </div>

                        {state.showCompleted &&
                          (Row?.COMPLETED && Row?.COMPLETED?.length > 0 ? (
                            <Table
                              RowData={Row?.COMPLETED}
                              getMilestones={GetData}
                              editMilestone={editMilestone}
                              viewMilestone={viewMilestone}
                            />
                          ) : (
                            <div className="flex justify-center items-center content-center text-gray-500 text-xs font-medium italic">
                              No active completed milestone.
                            </div>
                          ))}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right column */}
                <div className="grid grid-cols-1 gap-4 h-full xl:border-l xl:border-gray-200">
                  <section aria-labelledby="add-participant-section">
                    <div className="overflow-hidden bg-white">
                      <div className="px-4">
                        <div className="bg-white">
                          <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base  leading-6 font-medium text-gray-900">
                              Add New Milestone
                            </h3>
                            <div className="mt-2 max-w-xl  text-gray-500 text-sm font-medium italic">
                              <p>
                                Create a new milestone by giving it a name,
                                start date, end date and description.
                              </p>
                            </div>
                            <div className="mt-5">
                              <Button
                                id="new-test-run"
                                onClick={() => {
                                  setButtonLoader(true);
                                  router.push(
                                    `/projects/${router.query.pid}/addmilestone`
                                  );
                                }}
                                loading={buttonLoader}
                                type="button"
                                className="order-0 inline-flex items-center sm:order-1">
                                Add Milestone
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

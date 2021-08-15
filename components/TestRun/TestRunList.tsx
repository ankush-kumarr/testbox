import axiosService from "../Utils/axios";
import { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import { showError } from "../Toaster/ToasterFun";
import Table from "./component/Table";
import { PrinterIcon } from "@heroicons/react/solid";
import downloadPdf from "../Common/DownloadPdf";
import Button from "../Button";

import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";

export default function TestRunList({ projectName }: any) {
  const router = useRouter();

  // To store filtered data for Table component
  const [Row, setRowData] = useState([]);

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(true);

  const [buttonLoader, setButtonLoader] = useState(false);

  // for pagination
  const [PageNum, setPageNum] = useState(1);

  // pagination props
  const [paginationData, setPaginationData] = useState({
    itemCount: 0,
    page: 0,
    pageCount: 0,
    take: 0,
  });

  // To get test-suites data
  const GetData = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/test-suites?order=DESC&page=${PageNum}&take=5`
      );

      const data = response.data.data.data;
      // console.log("response from suites", response);
      setRowData(data);
      setPaginationData(response.data.data.meta);
      setShowLoader(false);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.status === 401) {
          showError(err.response.data.message);
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
          return;
        } else showError(err.response.data.message);
      } else showError("Something went wrong");
      setShowLoader(false);
    }
  };

  const editTestRun = (id: string) => {
    router.push(`/projects/${router.query.pid}/editTestrun/${id}`);
  };

  const viewTestRun = (id: string) => {
    router.push(`/projects/${router.query.pid}/testrun/${id}/test-results`);
  };

  // To export test runs in pdf
  const printDocument = async () => {
    setShowLoader(true);
    await downloadPdf("test-run-report");
    setShowLoader(false);
  };

  useEffect(() => {
    if (router?.query?.pid) GetData();
  }, [PageNum, router?.query?.pid]);

  return (
    <div>
      {showLoader ? (
        <div className="flex justify-center items-center content-center my-32">
          <Loader />
        </div>
      ) : (
        <>
          <main className="pb-8">
            <div className="px-1 ">
              <h1 className="sr-only">Page title</h1>
              {/* Main 3 column grid */}
              <div className="grid items-start grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-2">
                {/* Left column */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-2 ml-3 mr-7 pt-1">
                  <section aria-labelledby="participants_section">
                    <div className="overflow-hidden bg-white">
                      <div className="p-4">
                        <div className="cursor-pointer mt-2  flex items-center justify-between bg-gray-200 mb-4 lg:mx-2 rounded">
                          <p className="pb-2 mt-2  text-gray-900 truncate pl-4 text-sm ">
                            Test Runs ({paginationData.itemCount})
                          </p>
                          <Tippy content="Export test run report to pdf">
                            <div className="mr-7">
                              <PrinterIcon
                                className=" h-5 w-6 cursor-pointer text-indigo-600"
                                onClick={printDocument}
                              />
                            </div>
                          </Tippy>
                        </div>
                        <Table
                          RowData={Row}
                          editTestRun={editTestRun}
                          viewTestRun={viewTestRun}
                          projectName={projectName}
                          getTestRun={GetData}
                        />
                        <Pagination
                          setPageNum={setPageNum}
                          paginationData={paginationData}
                        />
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
                              Add New Test Run
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500 font-medium italic">
                              <p>
                                Create a new test run by giving it a name and
                                assign it to somebody.
                              </p>
                            </div>
                            <div className="mt-5">
                              <Button
                                id="new-test-run"
                                onClick={() => {
                                  setButtonLoader(true);
                                  router.push(
                                    `/projects/${router.query.pid}/createtestrun`
                                  );
                                }}
                                loading={buttonLoader}
                                type="button"
                                className="order-0 inline-flex items-center sm:order-1"
                              >
                                New Test Run
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

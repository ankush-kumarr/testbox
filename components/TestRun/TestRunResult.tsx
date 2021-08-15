import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosService from "../Utils/axios";
import Table from "./component/TestResultTable";
import Loader from "../Loader/Loader";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import Pagination from "../Pagination/Pagination";
import TestCaseDetail from "./TestCaseDetail";
import { ChevronRightIcon } from "@heroicons/react/solid";

// To show Breadcrumbs if user go on Test Case Details
const Breadcrumbs = ({ handleClick }: any) => (
  <div className="mt-6 ml-8">
    <nav className="flex">
      <ol className="flex items-center space-x-4">
        <li
          onClick={handleClick}
          className="flex items-center cursor-pointer ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Listing
          <ChevronRightIcon
            className="flex-shrink-0  h-6 w-6 text-gray-400 ml-3"
            aria-hidden="true"
          />
        </li>
        <li className="cursor-pointer text-sm font-medium text-indigo-500 hover:text-indigo-700">
          Test Case Details
        </li>
      </ol>
    </nav>
  </div>
);

export default function TestRunResult({ getTestRunDetais, title }: any) {
  const router = useRouter();

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(true);

  // state for table or a single test case details
  const [testCaseNum, seTestCaseNum] = useState(0);

  // To store filtered data for Table component
  const [Row, setRowData] = useState([]);

  // for pagination
  const [PageNum, setPageNum] = useState(1);

  // pagination props
  const [paginationData, setPaginationData] = useState({
    itemCount: 0,
    page: 0,
    pageCount: 0,
    take: 0,
  });

  interface statusData {
    status: string;
    comment?: string;
  }

  const submitStatus = async (id: string, Data: statusData) => {
    try {
      const response = await axiosService.put(
        `/test-suites/test-results/${id}`,
        Data
      );
      showSuccess(response?.data?.message);
      getTestRunResults();
      getTestRunDetais();
      return true;
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
        }
      } else showError("Something went wrong");
      return false;
    }
  };

  const getTestRunResults = async () => {
    try {
      const response = await axiosService.get(
        `/test-suites/${router.query.id}/test-results?order=ASC&page=${PageNum}&take=5`
      );
      const data = response.data.data.data;
      setRowData(data);
      setPaginationData(response.data.data.meta);
      setShowLoader(false);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
          return;
        }
        showError(err.response.data.message);
      } else showError("Something went wrong");
      setShowLoader(false);
    }
  };

  useEffect(() => {
    router?.query?.id && getTestRunResults();
  }, [PageNum, router?.query?.id]);

  return (
    <div>
      {showLoader ? (
        <div className="flex justify-center items-center content-center my-32">
          <Loader />
        </div>
      ) : testCaseNum > 0 ? (
        <>
          <Breadcrumbs handleClick={() => seTestCaseNum(0)} />
          <TestCaseDetail page={testCaseNum} submitStatus={submitStatus} />
        </>
      ) : (
        <>
          <Table
            RowData={Row}
            submitStatus={submitStatus}
            name={title}
            seTestCaseNum={(num) =>
              seTestCaseNum(
                num +
                (paginationData.page * paginationData.take -
                  paginationData.take)
              )
            }
          />
          <Pagination setPageNum={setPageNum} paginationData={paginationData} />
        </>
      )}
    </div>
  );
}

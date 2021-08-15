import React, { Fragment, useEffect, useState } from "react";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";
import Chart from "./Chart";
import { useRouter } from "next/router";
import axiosService from "../Utils/axios";
import { showError } from "../Toaster/ToasterFun";
import Loader from "../Loader/Loader";
import Pagination from "../Pagination/Pagination";
const Todo = () => {
  const router = useRouter();
  const [testRunList, setTestRunList] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [PageNum, setPageNum] = useState(1);
  const [dataForChart, setDataForChart] = useState<{
    labels: any[];
    datasets: any[];
  }>({
    labels: [],
    datasets: [],
  });
  const [paginationData, setPaginationData] = useState({
    itemCount: 0,
    page: 0,
    pageCount: 0,
    take: 0,
  });
  useEffect(() => {
    if (router?.query?.pid) getData();
  }, [PageNum, router?.query?.pid]);
  const getData = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/test-suites?order=DESC&page=${PageNum}&take=5`
      );
      if (dataForChart.labels.length === 0) {
        const tableData = await axiosService.get(
          "/projects/" + router?.query?.pid + "/todo"
        );
        const newTableData = tableData.data.data.users;
        const labelArray: any[] = [];
        const dataSet1: any[] = [];
        const dataSet2: any[] = [];
        for (let i = 0; i < newTableData.length; i++) {
          labelArray.push(
            newTableData[i].firstName + " " + newTableData[i].lastName
          );
          dataSet1.push(newTableData[i].totalActiveTestCases);
          dataSet2.push(newTableData[i].totalCompletedTestCases);
        }
        const labels = [...labelArray];
        const datasets = [
          {
            label: "Active",
            data: [...dataSet2],
            backgroundColor: "rgb(124,181,236)",
            barThickness: 20,
          },
          {
            label: "Completion pending",
            data: [...dataSet1],
            backgroundColor: "rgb(171,213,254)",
            barThickness: 20,
          },
        ];
        setDataForChart({
          labels: [...labels],
          datasets: [...datasets],
        });
      }
      const data = response.data.data.data;
      setTestRunList(data);
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
  const renderGraph = (passed: number, failed: number, untested: number) => {
    const total = passed + failed + untested;
    const width1 = (passed / total) * 100 + "%";
    const width2 = (failed / total) * 100 + "%";
    const width3 = (untested / total) * 100 + "%";
    const span1 = (
      <Tippy
        content={`${width1.toString().split(/[.,%]+/)[0]
          }% passed (${passed}/${total} tests)`}>
        <span
          className="inline-block h-4 cursor-pointer mt-1"
          style={{ width: width1, backgroundColor: "#3cb850" }}></span>
      </Tippy>
    );
    const span2 = (
      <Tippy
        content={`${width2.toString().split(/[.,%]+/)[0]
          }% failed (${failed}/${total} tests)`}
        placement="bottom">
        <span
          className="inline-block h-4 cursor-pointer mt-1"
          style={{ width: width2, backgroundColor: "#e40046" }}></span>
      </Tippy>
    );
    const span3 = (
      <Tippy
        content={`${width3.toString().split(/[.,%]+/)[0]
          }% untested (${untested}/${total} tests)`}>
        <span
          className="inline-block h-4 cursor-pointer mt-1"
          style={{ width: width3, backgroundColor: "#979797" }}></span>
      </Tippy>
    );
    return (
      <span className="w-20 inline-block mx-4">
        {span1}
        {span3}
        {span2}
      </span>
    );
  };
  if (showLoader) {
    return (
      <div className="flex justify-center items-center content-center my-32">
        <Loader />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="mx-8 px-2 mt-5 pb-14">
        {dataForChart.labels.length !== 0 ? (
          <Chart dataForChart={dataForChart} />
        ) : (
          <div className="flex justify-center items-center content-center text-gray-500 text-xs font-medium italic mt-5">
            <Chart dataForChart={dataForChart} />
          </div>
        )}
        <div className="bg-gray-200  px-4 py-2 mt-5 rounded text-sm ">
          Todo Test Runs
        </div>
        <div className="align-middle inline-block min-w-full px-4">
          <table className="min-w-full border-b border-gray-200 ">
            <tbody className="bg-white divide-y divide-gray-200">
              {testRunList.map((testrun: any, i) => (
                <tr key={i} className="">
                  <td className=" max-w-0 w-full whitespace-nowrap font-medium text-gray-900">
                    <div className="flex items-center space-x-3 lg:pl-2">
                      <a className="truncate hover:text-gray-600 hover:underline cursor-pointer text-sm">
                        <span
                          onClick={() =>
                            router.push(
                              "/projects/" +
                              router?.query?.pid +
                              "/testrun/" +
                              testrun?.id +
                              "/test-results"
                            )
                          }>
                          {testrun.name} ( {testrun?.testreport?.total} )
                        </span>
                      </a>
                    </div>
                  </td>
                  <td className=" py-2 whitespace-nowrap text-xs text-gray-500 text-right flex justify-center items-center">
                    <span style={{ display: "inline-block" }}>
                      {"Passed:" + testrun?.testreport?.passed}{" "}
                      {"Failed:" + testrun?.testreport?.failed}{" "}
                      {"Untested:" + testrun?.testreport?.untested}{" "}
                    </span>
                    <span style={{ display: "inline-block" }}>
                      {renderGraph(
                        testrun?.testreport?.passed,
                        testrun?.testreport?.failed,
                        testrun?.testreport?.untested
                      )}
                    </span>
                    <span className="font-bold inline-block w-10 text-center">
                      {" "}
                      {
                        (
                          (testrun.testreport?.passed /
                            testrun?.testreport?.total) *
                          100
                        )
                          .toString()
                          .split(".")[0]
                      }{" "}
                      %
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {testRunList.length === 0 && (
            <div className="flex justify-center items-center content-center text-gray-500 text-xs font-medium italic">
              No test runs added yet.
            </div>
          )}
          <Pagination setPageNum={setPageNum} paginationData={paginationData} />
        </div>
      </div>
    </Fragment>
  );
};

export default Todo;

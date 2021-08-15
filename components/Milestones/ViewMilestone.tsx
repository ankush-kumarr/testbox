import React, { useMemo } from "react";
import axiosService from "../Utils/axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { showError } from "../Toaster/ToasterFun";
import Loader from "../Loader/Loader";
import TestRunTable from "./Component/TestRunTable";
import marked from "marked";
import moment from "moment";
import "tippy.js/dist/tippy.css";
import Header from "../ProjectDetails/component/Header";

// for description component
const Card = ({ label, text }: { label: string; text: string }) => {
  return (
    <div className="">
      <p className="  px-4 py-2 bg-gray-200 mr-4 ml-2 rounded mb-4">
        {label}
      </p>
      <div
      >
        {text && (
          <div
            className="text-sm bg-white pl-8 text-gray-900 font-medium  overflow-auto h-full whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: marked(text),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default function ViewMilestone() {
  const router = useRouter();

  const [state] = useState(true); //to toggle ChevronDownIcon and ChevronRightIcon

  // for storing api data
  const [RowData, setRowData] = useState({
    description: "",
    endDate: "",
    id: "",
    name: "",
    startDate: "",
    status: "",
    testsuites: [],
  });

  // to show loader while api is fetching data
  const [showLoader, setShowLoader] = useState(true);

  // to fetch the data from api
  useEffect(() => {
    if (router?.query?.id) {
      getMilestoneDetais();
    }
  }, [router?.query?.pid, router?.query?.id]);

  // function for fetching api data
  const getMilestoneDetais = async () => {
    try {
      const response = await axiosService.get(
        `/milestones/${router?.query?.id}`
      );
      // console.log("response from getMilestoneDetais", response.data.data);
      setRowData({
        ...response.data.data,
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
        }
      } else showError("Something went wrong");
    }
  };
  // for redirection to testrun's results page
  const viewTestRun = (id: string) => {
    router.push(`/projects/${router.query.pid}/testrun/${id}/test-results`);
  };
  // description jsx - start and end date of milestone
  const description = useMemo(
    () => (
      <>
        <div className="flex items-center">
          <span className="text-xs">
            <span className="italic font-medium pr-2">Start Date:</span>
            {moment(RowData.startDate).format("MMMM DD, YYYY")}
          </span>
          <span className="text-xs mx-2">
            <span className="italic font-medium px-2 border-l-2 border-gray-500">
              End Date:
            </span>
            {moment(RowData.endDate).format("MMMM DD, YYYY")}
          </span>
        </div>
      </>
    ),
    [RowData, state]
  );
  return showLoader ? (
    <Loader withoverlay={true} />
  ) : (
    <>
      <Header
        title={RowData.name}
        description={description}
        redirectToBack={`/projects/${router?.query?.pid}/milestones`}
      />

      <div className="m-2 mb-6 p-6 py-2 ">
        {state && <Card label="Description" text={RowData.description} />}

        <p className="  px-4 py-2 bg-gray-200 mr-4 ml-2 rounded mb-4">
          Test Runs ({RowData.testsuites.length})
        </p>

        <TestRunTable RowData={RowData.testsuites} viewTestRun={viewTestRun} />
      </div>
    </>
  );
}

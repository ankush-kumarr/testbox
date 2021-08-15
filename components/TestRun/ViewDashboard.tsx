import React, { useEffect, useState } from "react";
import { showError } from "../Toaster/ToasterFun";
import moment from "moment";
import Heading from "../ProjectDetails/component/Header";
import NavTab from "../ProjectDetails/component/NavTab";
import { useRouter } from "next/router";
import axiosService from "../Utils/axios";
import TestRunResult from "./TestRunResult";
import Loader from "../Loader/Loader";
import downloadPdf from "../Common/DownloadPdf";

export default function Dashboard() {
  const router = useRouter();

  const [showLoader, setShowLoader] = useState(false);

  const [userData, setuserData] = useState({
    title: "",
    description: "",
    status: "",
  });
  // To get user name and test run details data
  const getTestRunDetais = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/test-suite-detail/${router.query.id}`
      );
      setuserData({
        title: response.data.data.name,

        status:
          response.data.data.status === "INPROGRESS"
            ? "In Progress"
            : response.data.data.status.toLowerCase(),

        description: `Created by ${
          response.data.data.user.firstName +
          " " +
          response.data.data.user.lastName
        } on ${moment(new Date(response.data.data.createdAt)).format(
          "MMMM DD, YYYY"
        )}`,
      });
    } catch (err) {
      // console.log("error from getTestRunDetais", err);
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

  // to dowload test case results in pdf format
  const printDocument = async () => {
    setShowLoader(true);
    try {
      await downloadPdf("test-run-list");
      // eslint-disable-next-line no-useless-catch
    } catch (e) {
      // showError(e.message);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (router?.query?.pid) {
      getTestRunDetais();
    }
  }, [router?.query]);

  // Props for NavTab
  const NavProps = [
    {
      redirect: `/projects/${router.query.pid}/testrun/${router.query.id}/test-results`,
      text: "Test Results",
    },
  ];
  return (
    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
      {/* Header and navigation based on url */}
      <div>
        {/* Heading props can be send based on changing url */}
        {router?.query?.subURL === "test-results" ? (
          <Heading
            {...userData}
            redirectToBack={`/projects/${router?.query?.pid}/testruns`}
            ShowPrinter={{
              HandleClick: printDocument,
              tooltip: "Export test cases to pdf",
            }}
          />
        ) : (
          <Heading
            redirectToBack={`/projects/${router?.query?.pid}/testruns`}
            title={userData.title}
            description={userData.description}
          />
        )}
        <NavTab navData={NavProps} />
      </div>

      {/* component based on url */}
      <div>
        {router?.query?.subURL === "test-results" &&
          (showLoader ? (
            <Loader />
          ) : (
            <TestRunResult
              getTestRunDetais={getTestRunDetais}
              title={userData.title}
            />
          ))}
      </div>
    </main>
  );
}

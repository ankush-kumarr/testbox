import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import NavTab from "./component/NavTab";
import Header from "./component/Header";
import TestCaseList from "../TestCase/TestCaseList";
import TestRunList from "../TestRun/TestRunList";
import Milestones from "../Milestones/Listing";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import axiosService from "../Utils/axios";
import Loader from "../Loader/Loader";
import Todo from "../Todo/index";
import Overview from "./component/Overview";
import downloadPdf from "../Common/DownloadPdf";
import DeleteConfirmationModal from "../Common/DeleteModal";

// For csv file header
const headers = [
  { label: "ID", key: "testcaseId" },
  { label: "Section", key: "SectionName" },
  { label: "Title", key: "title" },
  { label: "Preconditions", key: "preconditions" },
  { label: "Steps", key: "steps" },
  { label: "Expected Result", key: "expectedResults" },
];

export default function Dashboard() {
  const router = useRouter();

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(false);

  // To store project name
  const [projectDetail, setProjectDetail] = useState({ name: "" });

  // To store selected test cases data for csv file
  const [DocumentData, setDocumentData] = useState<any[]>([]);

  // to dowload test cases in pdf format
  const printDocument = async () => {
    setShowLoader(true);
    try {
      await downloadPdf("test-case-report");
      // eslint-disable-next-line no-useless-catch
    } catch (e) {
      // showError(e.message);
    } finally {
      setShowLoader(false);
    }
  };

  // To get project name
  const GetProjectDetail = async () => {
    try {
      const response = await axiosService.get(`/projects/${router.query.pid}`);
      setProjectDetail(response?.data?.data);
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
    }
  };

  // to edit multiple test cases
  const HandleEditClick = useCallback(() => {
    const data = DocumentData.map((val) => val.id);
    // console.log("collected ids for Edit ", data);

    if (DocumentData.length > 0) {
      localStorage.setItem("testCaseIds", JSON.stringify(data));
      router.push(`/projects/${router.query.pid}/edit_many_testCases`);
      return;
    } else showError("No test case is selected");
  }, [DocumentData]);

  // for delete modal
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);

  // for deleting test cases
  const deleteTestCases = async () => {
    setOpenDeleteModal(false);
    setShowLoader(true);
    setDocumentData([]);
    try {
      const data = {
        testCaseIds: DocumentData.map((val) => val.id),
      };
      const response = await axiosService.delete(`/test-cases`, data);
      if (response?.data?.success) {
        showSuccess(response.data.message);
      }
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    } finally {
      setShowLoader(false);
    }
  };

  // to delete multiple test cases
  const HandleDeleteClick = useCallback(() => {
    DocumentData.length === 0
      ? showError("No test case is selected")
      : setOpenDeleteModal(true);
  }, [DocumentData]);

  // Function to store selected data
  const selectedData = useCallback(
    (newData: any[], sectionName: string) => {
      const freshData = DocumentData.filter(
        (val) => val.SectionName !== sectionName
      );
      setDocumentData([...freshData, ...newData]);
    },
    [DocumentData]
  );

  useEffect(() => {
    if (router?.query?.pid) {
      GetProjectDetail();
    }
  }, [router?.query?.pid]);

  useEffect(() => {
    setDocumentData([]);
  }, [router?.query?.subURL]);

  // Props for NavTab
  const NavProps = [
    {
      redirect: `/projects/${router?.query?.pid}/overview`,
      text: "Overview",
    },
    { redirect: `/projects/${router?.query?.pid}/todo`, text: "Todo" },
    {
      redirect: `/projects/${router?.query?.pid}/milestones`,
      text: "Milestones",
    },
    {
      redirect: `/projects/${router?.query?.pid}/testcases`,
      text: "Test Cases",
    },
    { redirect: `/projects/${router?.query?.pid}/testruns`, text: "Test Runs" },
  ];

  return (
    <>
      <main className="flex-1 flex flex-col relative z-0 overflow-y-auto focus:outline-none h-full">
        <DeleteConfirmationModal
          msg="Are you sure you want to delete selected test cases ?"
          open={OpenDeleteModal}
          toogleModal={setOpenDeleteModal}
          delete={deleteTestCases}
        />

        {/* Header and navigation based on url */}
        <div>
          {router?.query?.subURL === "testcases" ? (
            <Header
              redirectToBack={"/"}
              title={projectDetail?.name + " Project"}
              ShowPrinter={{
                HandleClick: printDocument,
                tooltip: "Export test cases to pdf",
              }}
              ShowEdit={{
                HandleClick: HandleEditClick,
                tooltip: "Edit multiple test cases",
                ColorEnable: Boolean(DocumentData.length),
              }}
              ShowDelete={{
                HandleClick: HandleDeleteClick,
                tooltip: "Delete multiple test cases",
                ColorEnable: Boolean(DocumentData.length),
              }}
              redirectToPage={{
                url: `/projects/${router?.query?.pid}/createtest`,
                text: "New Test Case",
              }}
              ShowCSV={{
                tooltip: "Export test cases to csv",
                headers: headers,
                data: DocumentData,
                fileName: "testCases.csv",
                ColorEnable: Boolean(DocumentData.length),
                errorMessage:
                  "Please select test cases or individual section to export test cases.",
              }}
            />
          ) : (
            <Header
              title={projectDetail?.name + " Project"}
              redirectToBack={"/"}
            />
          )}

          <NavTab navData={NavProps} />
        </div>

        {/* component based on url */}
        <div className="flex-grow">
          {router?.query?.subURL === "overview" && <Overview />}

          {router?.query?.subURL === "testcases" &&
            (showLoader ? (
              <div className="flex justify-center items-center content-center my-32">
                <Loader />
              </div>
            ) : (
              <TestCaseList
                projectName={projectDetail?.name}
                selectedData={selectedData}
              />
            ))}

          {router?.query?.subURL === "testruns" && (
            <TestRunList projectName={projectDetail?.name} />
          )}

          {router?.query?.subURL === "milestones" && <Milestones />}

          {router?.query?.subURL === "todo" && <Todo />}
        </div>
      </main>
    </>
  );
}

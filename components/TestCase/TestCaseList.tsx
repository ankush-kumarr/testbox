// import Table from "../Common/Table";
import axiosService from "../Utils/axios";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import DeleteConfirmationModal from "../Common/DeleteModal";
import SectionMain from "../Sections/SectionMain";
import { AppContext } from "../Context/mainContext";
import TestCaseListTable from "./component/TestCaseListTable";
import TestCaseToolbar from "./component/TestCaseToolbar";

export default function TestCaseList({ projectName, selectedData }: any) {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  // To store filtered data for Table component
  const [Row, setRowData] = useState<any[]>([]);
  const [memberList, setMemberList] = useState<any[]>([]);

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(true);
  const [initialRowData, setInitialRowData] = useState<any[]>([]);

  const GetData = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/test-cases`
      );

      const data = response.data.data;
      // console.log("Response", data);
      setRowData(data);
      setInitialRowData(data);

      // Fetch list of users created and updated testcases
      const memberListResponse = await axiosService.get(
        `/projects/${router.query.pid}/filterUsers`
      );
      const memberListData = memberListResponse.data.data;
      setMemberList(memberListData);

      setShowLoader(false);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
          showError(err.response.data.message);
          return;
        } else showError(err.response.data.message);
      } else showError("Something went wrong");
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (router.query.pid) GetData();
  }, [router.query.pid]);

  const [showModal, toogleModal] = useState(false);
  const [modalMsg, setMsg] = useState(<></>);
  const [selectedId, setSelectedId] = useState("");
  const [showDragIcon, setShowDragIcon] = useState(true);

  const openDeleteModal = (value: any) => {
    const msg = (
      <>
        Are you sure want to delete the test case{" "}
        <span className="font-semibold text-red-500">{`"${value?.title}"`}</span>
        ?
      </>
    );
    setMsg(msg);
    setSelectedId(value.id);
    toogleModal(true);
  };

  const deleteTestCase = async () => {
    // Api call will be here to delete the test run
    toogleModal(false);
    setShowLoader(true);
    try {
      const response = await axiosService.delete(
        `/test-cases/${selectedId}`,
        {}
      );
      if (response?.data?.success) {
        showSuccess(response.data.message);
      }
      GetData();
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    } finally {
      setShowLoader(false);
    }
  };
  useEffect(() => {
    if (state.sectionCreated === true) {
      GetData();
      dispatch({
        type: "UPDATE_SECTION_RESET",
        data: false,
      });
    }
  }, [state.sectionCreated]);
  const goToCreateTestCase = (sectionId: string) => {
    router.push({
      pathname: "/projects/" + router?.query?.pid + "/createtest",
      query: { sectionId: sectionId },
    });
  };

  return (
    <div>
      {showModal && (
        <DeleteConfirmationModal
          msg={modalMsg}
          open={showModal}
          toogleModal={toogleModal}
          delete={deleteTestCase}
        />
      )}
      <div className="w-full">
        <>
          {showLoader ? (
            <div className="flex justify-center items-center content-center my-32">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid items-start grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-2 overflow-hidden pb-14">
                {/* Search header */}
                <div className=" overflow-x-auto mx-6 sm:mx-0  col-span-1 lg:col-span-2 height-threshold">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-10 ">
                    {/* Sort-Filter bar */}
                    <TestCaseToolbar
                      Row={Row}
                      setRowData={setRowData}
                      setShowDragIcon={setShowDragIcon}
                      initialRowData={initialRowData}
                      memberList={memberList}
                    />
                    <div
                      className="overflow-hidden border-gray-200 sm:rounded-lg"
                      id="test-case-report">
                      <div
                        id="pdf-header"
                        className="flex item-center justify-center font-medium text-gray-900 py-3 hidden">
                        {projectName}&nbsp;Project Test Case Report
                      </div>
                      {Row?.map(
                        (
                          section: {
                            name: string;
                            id: string;
                            testcases: any[];
                          },
                          index
                        ) => (
                          <React.Fragment key={index}>
                            <div className="pl-6 py-4 whitespace-nowrap  border-t border-b  flex flex-col items-start">
                              <span className=" text-md font-semibold text-gray-900">
                                {section.name}
                              </span>{" "}
                              {showDragIcon && (
                                <span
                                  onClick={() => goToCreateTestCase(section.id)}
                                  className="text-gray-900 underline cursor-pointer  text-sm">
                                  Add Case
                                </span>
                              )}
                            </div>

                            {section?.testcases?.length > 0 && (
                              <TestCaseListTable
                                testcases={section?.testcases}
                                SectionName={section?.name}
                                openDeleteModal={openDeleteModal}
                                selectedData={selectedData}
                                sectionId={section?.id}
                                showDragIcon={showDragIcon}
                              />
                            )}
                          </React.Fragment>
                        )
                      )}
                    </div>
                  </div>
                  {Row?.length === 0 && (
                    <div className="flex justify-center items-center content-center text-gray-500 text-xs font-medium italic my-2">
                      No test cases found
                    </div>
                  )}
                </div>
                <SectionMain getTestCases={GetData} />
              </div>
            </>
          )}
        </>
      </div>
      {/* </main> */}
    </div>
  );
}

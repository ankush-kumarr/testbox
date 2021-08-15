import OverviewCharts from "./OverviewChart";
import Button from "../../Button/index";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import axiosService from "../../Utils/axios";
import { showError } from "../../Toaster/ToasterFun";
import moment from "moment";

export default function Overview() {
  const router = useRouter();
  const [milestoneList, setMilestoneList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [testRunList, setTestRunList] = useState([]);
  const [graphDataset, setGraphDataSet] = useState({});
  const [defaultActivity, setDefaultActivity] = useState("history");
  const [testChangeList, setTestChangeList] = useState<any[]>([]);
  const testChangeRef = useRef<HTMLDivElement>(null);
  const [pageForTest, setPageForTest] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [isIntersecting, setIntersecting] = useState(false);
  const [loadingTestChange, setLoadingTestChange] = useState(false);

  useEffect(() => {
    if (router?.query?.pid) {
      getMilestoneList();
      getActivityList();
      getTestRunList();
      getGraphDetails();
      getTestChanges();
    }
  }, [router?.query?.pid]);

  const goToMilestoneDetails = (id: string) => {
    router.push(`/projects/${router.query.pid}/milestone/${id}`);
  };

  const goToTestRunDetails = (id: string) => {
    router.push(`/projects/${router.query.pid}/testrun/${id}/test-results`);
  };

  const getGraphDetails = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/activities/test-results?days=14`
      );
      if (response?.data?.data?.data) {
        const graphData = response.data.data.data;
        const gL: any[] = [];
        const passedGL: number[] = [];
        const failedGL: number[] = [];
        const untestedGL: number[] = [];
        graphData.forEach((ele: any) => {
          gL.push(moment(ele.date).format("MMM DD"));
          let psCount = 0;
          let flCount = 0;
          let utCount = 0;

          ele.activities.forEach((item: any) => {
            if (item.status === "PASSED") {
              psCount++;
            } else if (item.status === "FAILED") {
              flCount++;
            } else if (item.status === "UNTESTED") {
              utCount++;
            }
          });
          passedGL.push(psCount);
          failedGL.push(flCount);
          untestedGL.push(utCount);
        });
        const iterateData: any[] = [];
        iterateData.push({
          label: "Failed",
          data: [...failedGL],
          backgroundColor: "rgb(228, 0, 70)",
        });
        iterateData.push({
          label: "Untested",
          data: [...untestedGL],
          backgroundColor: "rgb(151, 151, 151)",
        });
        iterateData.push({
          label: "Passed",
          data: [...passedGL],
          backgroundColor: "rgb(60, 184, 80)",
        });

        const additionalData: any[] = [];
        const loopLength = 14 - gL.length;
        if (gL.length < 7) {
          for (let i = 0; i < loopLength; i++) {
            gL.unshift(moment(gL[0]).subtract(1, "days").format("MMM DD"));
            additionalData.push(0);
          }
        }

        iterateData.map((ele: any) => {
          ele.data = [...additionalData, ...ele.data];
        });

        // console.log("gl", gL, iterateData);

        const dataset = {
          labels: gL,
          datasets: iterateData,
        };
        setGraphDataSet(dataset);
      }
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
      // setShowLoader(false);
    }
  };

  const getTestRunList = async () => {
    try {
      const resp = await axiosService.get(
        `projects/${router.query.pid}/activity/test-suites?order=DESC`
      );
      if (resp?.data?.data) {
        setTestRunList(resp.data.data);
      }
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
    }
  };

  useEffect(() => {
    if (router?.query?.pid) getData();
  }, [router?.query?.pid]);
  const getData = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/test-suites?order=DESC`
      );

      const data = response.data.data.data;
      const todos = data.filter((ele: any) => ele.status !== "COMPLETED");
      setTodoList(todos);
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
    }
  };

  const getActivityList = async () => {
    try {
      const resp = await axiosService.get(
        `/projects/${router.query.pid}/activities?days=7`,
        {
          projectId: router.query.pid,
        }
      );
      if (resp?.data?.data?.data) {
        setActivityList(resp.data.data.data);
      }
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
      // setShowLoader(false);
    }
  };

  const getMilestoneList = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/activity/milestones?order=DESC`
      );
      if (response?.data?.data) {
        setMilestoneList(response.data.data);
      }
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
      // setShowLoader(false);
    }
  };

  const navigateAdd = (type: string) => {
    if (type === "Milestone") {
      router.push(`/projects/${router.query.pid}/addmilestone`);
    } else if (type === "Test-case") {
      router.push(`/projects/${router.query.pid}/createtest`);
    } else if (type === "Test-run") {
      router.push(`/projects/${router.query.pid}/createtestrun`);
    } else {
      return;
    }
  };

  const navigateView = (type: string) => {
    if (type === "Milestone") {
      router.push(`/projects/${router.query.pid}/milestones`);
    } else if (type === "Test-case") {
      router.push(`/projects/${router.query.pid}/testcases`);
    } else if (type === "Test-run") {
      router.push(`/projects/${router.query.pid}/testruns`);
    } else {
      return;
    }
  };
  const loadTestChanges = () => {
    setDefaultActivity("testChanges");
  };
  const getTestChanges = async () => {
    const resp = await axiosService.get(
      "/projects/" +
      router?.query?.pid +
      "/activities/test-changes?page=" +
      pageForTest +
      "&take=50"
    );
    setTestChangeList(resp.data.data.data.data);
    setTotalPage(resp.data.data.meta.pageCount);
  };
  useEffect(() => {
    if (defaultActivity === "testChanges") {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIntersecting(true);
          }
        },
        { root: null, rootMargin: "0px", threshold: 1.0 }
      );
      if (testChangeRef.current) {
        observer.observe(testChangeRef.current);
      }
    }
  }, [testChangeRef.current, defaultActivity]);

  useEffect(() => {
    if (isIntersecting === true) {
      if (totalPage !== pageForTest) {
        getTestChangeForLazyLoading(pageForTest);
      }
    }
  }, [isIntersecting]);

  const getTestChangeForLazyLoading = async (page: any) => {
    setLoadingTestChange(true);
    setPageForTest(page + 1);
    const currentPage = page + 1;
    const resp = await axiosService.get(
      "/projects/" +
      router?.query?.pid +
      "/activities/test-changes?page=" +
      currentPage +
      "&take=50"
    );
    const newData = resp.data.data.data.data;
    if (testChangeList[testChangeList.length - 1].date === newData[0].date) {
      const newTestChangeList = [...testChangeList];
      const newTempData = [...newData];
      newTestChangeList[newTestChangeList.length - 1].activities.push(
        ...newTempData[0].activities
      );
      newTempData.shift();
      setTestChangeList([...newTestChangeList, ...newTempData]);
    } else {
      const newTestChangeList = [...testChangeList, ...newData];
      setTestChangeList(newTestChangeList);
    }
    setIntersecting(false);
    setLoadingTestChange(false);
  };

  const getDataTestCase = async (id: string) => {
    try {
      const details = await axiosService.get(
        "/projects/" + router.query.pid + "/test-cases/" + id + "/details"
      );
      router.push(
        "/projects/" + router.query.pid + "/testcase/" + details.data.data.id
      );
    } catch (err) {
      if (err.response.status === 404) {
        showError("No Test Case Data Found.");
      }
    }
  };
  const NotAvailable = ({ text }: any) => {
    return (
      <h1 className="mt-4 text-center mr-4 text-gray-500 text-xs font-medium italic">
        No {text} available
      </h1>
    );
  };
  return (
    <div className="min-h-full h-auto flex">
      <div className="w-9/12 p-4 pb-14">
        <div className="p-4 overviewChart">
          <OverviewCharts dataset={graphDataset} />
        </div>
        <div className="flex p-4 ">
          <div className="w-6/12">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 text-sm  sm:gap-4 sm:px-4 mr-4 rounded">
              Milestones
            </div>
            {!milestoneList.length && (
              <>
                <p className="mt-4 mr-4 text-gray-500 text-xs font-medium italic ">
                  This project does not have any active milestones.
                </p>
                <Button
                  id="show-pop-up"
                  type="button"
                  className="order-0 inline-flex items-center px-4 py-2  sm:order-1 mt-4"
                  onClick={() => navigateAdd("Milestone")}>
                  Add Milestone
                </Button>
              </>
            )}
            {milestoneList?.length ? (
              milestoneList.map((ele: any) => {
                return (
                  <div key={ele.id} className="border-b-2 mt-4 pb-2 pl-2 mr-4">
                    <p
                      onClick={() => goToMilestoneDetails(ele.id)}
                      className="text-gray-800 font-medium text-sm cursor-pointer">
                      {ele.name}
                    </p>
                    <p className="text-xs">
                      Due on{" "}
                      {ele?.endDate
                        ? moment(new Date(ele?.endDate)).format("MMMM DD, YYYY")
                        : "No due date"}
                    </p>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div className="w-6/12">
            <div className="rounded text-sm  bg-gray-200 px-4 py-2 sm:gap-4 sm:px-4 text-gray-900">
              Test Runs
            </div>

            {testRunList.map((ele: any) => {
              return (
                <div key={ele.id} className="border-b-2 mt-4 pb-2">
                  <p
                    onClick={() => goToTestRunDetails(ele.id)}
                    className="text-gray-800 font-medium text-sm cursor-pointer">
                    {ele.name}
                  </p>
                  <p className="text-xs">
                    By{" "}
                    {`${ele?.user.firstName} ${ele?.user?.lastName ? ele.user.lastName : ""
                      }`}{" "}
                    on {moment(new Date(ele.createdAt)).format("MMMM DD, YYYY")}
                  </p>
                </div>
              );
            })}
            {!testRunList.length && (
              <>
                <p className="mt-4 text-gray-500 text-xs font-medium italic ">
                  This project does not have any active test run.
                </p>
                <Button
                  onClick={() => navigateAdd("Test-run")}
                  id="show-pop-up"
                  type="button"
                  className="order-0 inline-flex items-center px-4 py-2  sm:order-1 mt-4">
                  Add Test Run
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="px-4 py-2 text-gray-900 bg-gray-200 mr-4 text-sm  ml-4 rounded">
          <span>Activity</span>
          <span className="float-right">
            <span
              className={` border-gray-600 px-2 cursor-pointer ${defaultActivity === "history" ? "border-b border-dashed" : ""
                }`}
              onClick={() => setDefaultActivity("history")}>
              History
            </span>
            <span className="border-l border-gray-600 mx-2"></span>
            <span
              className={` border-gray-600 px-2 cursor-pointer ${defaultActivity === "testChanges"
                ? "border-b border-dashed"
                : ""
                }`}
              onClick={() => loadTestChanges()}>
              Test Changes
            </span>
          </span>
        </div>
        <div className="px-4">
          {defaultActivity === "history" &&
            (activityList.length === 0 ? (
              <NotAvailable text="history" />
            ) : (
              activityList.map((ele: any) => {
                return (
                  <>
                    <div key={ele.date} className="text-gray-900 text-sm my-2">
                      <h1 className="border-b border-gray-900 w-max">
                        {`${moment(ele.date)
                          .format(`llll`)
                          .slice(0, 5)}${moment(ele.date).format(`LL`)} `}
                      </h1>
                    </div>
                    <div>
                      {ele.activities.map((item: any) => {
                        return (
                          <div
                            key={item.id}
                            className="border-b-2 p-2 flex justify-between	">
                            <div className="flex items-center">
                              <div>
                                <span
                                  className={`mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-100 ${item.entity === "MILESTONE"
                                    ? "bg-pink-400"
                                    : "mr-5 bg-purple-400"
                                    }`}>
                                  {item.entity}
                                </span>
                              </div>
                              <div className="text-grey-900 text-xs w-full">
                                {item.name.length > 75
                                  ? `${item.name.substring(0, 75)}...`
                                  : item.name}
                              </div>
                            </div>
                            <div className="text-grey-900 text-xs">
                              {item.status === "COMPLETED"
                                ? "Completed"
                                : item.status}
                              &nbsp;by&nbsp;
                              {`${item?.user.firstName} ${item?.user?.lastName ? item.user.lastName : ""
                                }`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })
            ))}
          <div>
            {defaultActivity === "testChanges" &&
              (activityList.length === 0 ? (
                <NotAvailable text="test changes" />
              ) : (
                <>
                  {testChangeList.map(
                    (testChange: any, indexOfTestChangeList: number) => (
                      <>
                        <div className="text-gray-900 text-sm my-2">
                          <h1 className="border-b border-gray-900 w-max">
                            {`${moment(testChange.date)
                              .format(`llll`)
                              .slice(0, 5)}${moment(testChange.date).format(
                                `LL`
                              )} `}
                          </h1>
                        </div>
                        {testChange.activities.map(
                          (activity: any, index: number) => (
                            <div
                              className="border-b-2 p-2 flex justify-between"
                              key={index}
                              ref={
                                indexOfTestChangeList ===
                                  testChangeList.length - 1 &&
                                  index === testChange?.activities.length - 1
                                  ? testChangeRef
                                  : null
                              }>
                              <div className="flex items-center">
                                <div>
                                  <span
                                    className={`mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-100 `}
                                    style={
                                      activity.status === "UNTESTED"
                                        ? {
                                          backgroundColor:
                                            "rgb(151, 151, 151)",
                                        }
                                        : activity.status === "PASSED"
                                          ? {
                                            backgroundColor: "rgb(60, 184, 80)",
                                          }
                                          : { backgroundColor: "rgb(228, 0, 70)" }
                                    }>
                                    {activity.status}
                                  </span>
                                </div>
                                <div
                                  className="text-grey-900 text-xs w-full cursor-pointer"
                                  onClick={() =>
                                    getDataTestCase(
                                      activity.testCaseResult.testCaseId
                                    )
                                  }>
                                  {activity.testCaseResult.testCaseTitle
                                    .length > 75
                                    ? `${activity.testCaseResult.testCaseTitle.substring(
                                      0,
                                      75
                                    )}...`
                                    : activity.testCaseResult.testCaseTitle}
                                </div>
                              </div>
                              <div className="text-grey-900 text-xs">
                                Tested by{" "}
                                {activity.user.firstName +
                                  " " +
                                  activity.user.lastName}
                              </div>
                            </div>
                          )
                        )}
                      </>
                    )
                  )}
                  {loadingTestChange && <div> Loading....</div>}
                </>
              ))}
          </div>
        </div>
      </div>
      <div className="w-3/12 bg-gray-100 p-4">
        <div className="bg-gray-200 px-4 py-2 rounded text-sm ">Action</div>
        <div className="border-b-2 mt-4 pb-2 pl-2">
          <p className="text-indigo-500 text-sm">Milestone</p>
          <div>
            <span
              onClick={() => navigateAdd("Milestone")}
              className="cursor-pointer  text-xs text-gray-500">
              <span className="underline">Add</span>&nbsp;&nbsp;|
            </span>
            &nbsp;&nbsp;
            <span
              onClick={() => navigateView("Milestone")}
              className="cursor-pointer underline text-xs text-gray-500">
              View All
            </span>
          </div>
        </div>
        <div className="border-b-2 mt-4 pb-2  pl-2">
          <p className="text-indigo-500 text-sm  ">Test Run</p>
          <div>
            <span
              onClick={() => navigateAdd("Test-run")}
              className="cursor-pointer  text-xs text-gray-500">
              <span className="underline">Add</span>&nbsp;&nbsp;|
            </span>
            &nbsp;&nbsp;
            <span
              onClick={() => navigateView("Test-run")}
              className=" cursor-pointer underline text-xs text-gray-500">
              View All
            </span>
          </div>
        </div>
        <div className="border-b-2 mt-4 pb-2 pl-2">
          <p className="text-indigo-500 text-sm ">Test Cases</p>
          <div>
            <span
              onClick={() => navigateAdd("Test-case")}
              className="cursor-pointer  text-xs text-gray-500">
              <span className="underline">Add</span>&nbsp;&nbsp;|
            </span>
            &nbsp;&nbsp;
            <span
              onClick={() => navigateView("Test-case")}
              className="cursor-pointer underline text-xs text-gray-500">
              View All
            </span>
          </div>
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded text-sm ">Todos</div>
        {todoList.length ? (
          todoList.map((ele: any) => {
            return (
              <div
                key={ele.id}
                className="flex justify-between border-b-2 mt-2 p-2">
                <span
                  onClick={() => goToTestRunDetails(ele.id)}
                  className="text-grey-400 text-sm ml-1 cursor-pointer">
                  {ele.name}
                </span>
                <span className="text-grey-400 text-sm">
                  {ele?.testreport?.total - ele?.testreport?.passed}
                </span>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

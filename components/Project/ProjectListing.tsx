import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  PencilAltIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import axiosService from "../Utils/axios";
import { showError, showSuccess } from "../Toaster/ToasterFun";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import moment from "moment";
import DeleteConfirmationModal from "../Common/DeleteModal";
import OverviewCharts from "../ProjectDetails/component/OverviewChart";
import Modal from "./Modal";
import FavouriteList from "./SingleList";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const router = useRouter();

  const [modalMsg, setMsg] = useState(<></>);

  const deleteFromFavouriteList = async (id: string) => {
    const resp = await axiosService.delete(`/projects/${id}/favorites`, {});
    if (resp.status === 200) {
      getFavoriteList();
      getProjects();
    }
  };

  const [showLoader, setShowLoader] = useState(true);
  const [showModal, toogleModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [favoriteList, setFavoriteList] = useState([]);

  const [projectList, setProjectList] = useState([]);
  const [grData, setGRData] = useState({});

  const [daysModal, setDaysModal] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(7);

  const [mostActiveResult, setMostActiveResult] = useState([]);

  const [projectListUpdate, setProjectListUpdate] = useState(false);

  const colorArr = ["#184BB8", "#5584E9", "#A3BCF3", "#DDE7FB"];

  const openModal = (project: any) => {
    setSelectedId(project?.id);
    const msg = (
      <>
        Are you sure want to delete the project{" "}
        <span className="font-semibold text-red-500">{`"${project?.name}"`}</span>
        ?
      </>
    );
    setMsg(msg);
    toogleModal(true);
  };

  // Hiding loader on favoriting/un-favoriting a project
  useEffect(() => {
    setProjectListUpdate(true);
  }, [favoriteList]);

  const getFavoriteList = async () => {
    try {
      const response = await axiosService.get("/projects/favorites/list");
      if (response?.data?.data) {
        setFavoriteList(response.data.data);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setFavoriteList([]);
      } else {
        showError(err.response.data.message);
      }
    }
  };

  const makeFavorite = async (id: string) => {
    try {
      const resp = await axiosService.post(`/projects/${id}/favorites`, {});
      if (resp?.data?.data) {
        getFavoriteList();
        getProjects();
      }
    } catch (err) {
      if (err?.response?.data) {
        // showError(err.response.data.message);
        deleteFromFavouriteList(id);
      }
    }
  };

  useEffect(() => {
    getFavoriteList();
  }, []);

  const deleteProject = async () => {
    toogleModal(false);
    setProjectListUpdate(true);
    // setShowLoader(true);
    try {
      const resp = await axiosService.delete(`/projects/${selectedId}`, {});
      if (resp?.data?.success) {
        showSuccess(resp.data.message);
      }
      getProjects();
      getFavoriteList();
      getActiveProject();
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    }
  };

  const getProjects = async () => {
    if (!projectListUpdate) {
      setShowLoader(true);
    }
    try {
      const response = await axiosService.get(`/organizations/projects`);
      const data = response.data.data;
      setProjectList(data);
      setShowLoader(false);
    } catch (err) {
      if (err.response && err.response.data) {
        setShowLoader(false);
        showError(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
        }
      } else {
        setShowLoader(false);
        showError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    getProjects();
    getActiveProject();
  }, [numberOfDays]);

  const getActiveProject = async () => {
    try {
      const resp = await axiosService.get(
        `/organizations/active/projects?days=${numberOfDays}`
      );

      if (resp?.data?.data) {
        const graphData = resp.data.data;
        const gl: any[] = [];
        const dataSet: any[] = [];
        const data: any[] = [];
        graphData.forEach((ele: any) => {
          gl.push(moment(ele.date).format("MMM DD"));
          data.length = 0;
          ele.projects.forEach((item: any) => {
            if (dataSet.length === 0) {
              dataSet.push({
                project: item.name,
                data: [...data, item.totalTestChanges],
              });
            } else {
              const saveData = dataSet.find((ele) => ele.project === item.name);
              if (saveData) {
                saveData.data = [...saveData.data, item.totalTestChanges];
                data.pop();
              } else {
                dataSet.push({
                  project: item.name,
                  data: [...data, item.totalTestChanges],
                });
              }
            }
          });
        });

        const calculateGraph: any = dataSet
          .map((ele: any) => {
            const sumOfChanges = ele.data.reduce(
              (ele: any, acc: any) => ele + acc
            );
            return {
              name: ele.project,
              noOfChanges: sumOfChanges,
            };
          })
          .sort((a: any, b: any) => b.noOfChanges - a.noOfChanges);
        setMostActiveResult(calculateGraph);

        const iterateData = dataSet.map((ele: any, index: number) => {
          return {
            label: ele.project,
            data: [...ele.data],
            backgroundColor: colorArr[index],
          };
        });
        const loopLength = numberOfDays - gl.length;
        // console.log("loopLength, gl", loopLength, gl);
        const additionalData: any[] = [];
        if (gl.length < numberOfDays) {
          for (let i = 0; i < loopLength; i++) {
            gl.unshift(moment(gl[0]).subtract(1, "days").format("MMM DD"));
            additionalData.push(0);
          }
        }

        iterateData.map((ele: any) => {
          ele.data = [...additionalData, ...ele.data];
        });

        // const dataOfGraph = {
        //   labels: [...gl],
        //   datasets: iterateData,
        // };
        const dataOfGraph = {
          labels: [...gl],
          datasets: iterateData
            .sort(
              (a, b) =>
                b.data.reduce((total = 0, val) => total + val) -
                a.data.reduce((total = 0, val) => total + val)
            )
            .map((val, i) => ({ ...val, backgroundColor: colorArr[i] })),
        };
        setGRData(dataOfGraph);
      }
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    }
  };

  const openDaysModal = () => {
    setDaysModal(true);
  };

  const goToEdit = (projId: string) => {
    router.push(`editproject/${projId}`);
  };

  const goToView = (projId: string) => {
    router.push(`/projects/${projId}/overview`);
  };

  const goToTodos = (projId: string) => {
    router.push(`/projects/${projId}/todo`);
  };

  return (
    <>
      {showLoader ? (
        <div className="flex justify-center items-center content-center my-32">
          <Loader />
        </div>
      ) : (
        <div className="h-full border flex flex-grow overflow-hidden bg-white">
          <Modal
            open={daysModal}
            toogleModal={setDaysModal}
            setNumberOfDays={setNumberOfDays}
            defaultVal={numberOfDays}
          />
          {/* Static sidebar for desktop */}
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            {/* Search header */}
            <main className="flex-1 relative overflow-y-auto z-0 focus:outline-none">
              {/* Projects list (only on smallest breakpoint) */}
              <div className="mt-10 sm:hidden">
                <div className="px-4 sm:px-6">
                  <h2 className="text-gray-500 text-xs font-medium tracking-wide">
                    Projects
                  </h2>
                </div>
                <ul className="mt-3 border-t border-gray-200 divide-y divide-gray-100">
                  {projectList.map((project: any) => (
                    <li key={project.id}>
                      <a
                        href={`/projects/${project?.id}/testcases`}
                        className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
                      >
                        <span className="flex items-center truncate space-x-3">
                          <span
                            className="bg-indigo-400 w-2.5 h-2.5 flex-shrink-0 rounded-full"
                            aria-hidden="true"
                          />
                          <span className="font-medium truncate text-sm leading-6">
                            {project?.name}
                          </span>
                        </span>
                        <ChevronRightIcon
                          className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Projects table (small breakpoint and up) */}
              <div className="min-h-full h-auto flex">
                <div className="w-9/12 p-4 pb-14">
                  <div className="flex">
                    <div className="p-4 overviewChart w-10/12">
                      <OverviewCharts dataset={grData} />
                    </div>
                    <div>
                      <div className="mt-4 text-gray-900 mb-4">
                        Most active{" "}
                        <span
                          className="cursor-pointer  "
                          onClick={() => openDaysModal()}
                        >
                          (
                          <span className="underline">{numberOfDays} Days</span>
                          )
                        </span>
                      </div>
                      {mostActiveResult.map((ele: any, index: any) => {
                        return (
                          <div key={ele.name} className="mb-4 pl-2">
                            <div className="flex align-center">
                              <div
                                className="h-4 w-4 mr-2 self-center"
                                style={{
                                  backgroundColor: `${colorArr[index]}`,
                                }}
                              ></div>
                              <p className="leading-5 lg:leading-3 text-gray-900 font-semibold text-sm lg:text-md self-center">
                                {ele?.name}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {ele.noOfChanges} recent test changes.
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className=" bg-gray-200 mx-4 rounded">
                    <div className="px-4 py-2 text-sm  text-left  ">
                      <span className="text-gray-900">Favorite Projects</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start  pb-2 my-4 mr-8 px-6">
                    {favoriteList.length ? (
                      favoriteList?.map((list: any) => {
                        return (
                          <FavouriteList
                            key={list.id}
                            list={list}
                            deleteFromFavouriteList={deleteFromFavouriteList}
                          />
                        );
                      })
                    ) : (
                      <div className="text-gray-500 text-xs font-medium italic m-auto">
                        No favorite project added yet.
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:block p-4">
                    <div className="align-middle inline-block min-w-full border-b border-gray-200">
                      <table className="min-w-full">
                        <thead className="">
                          <tr className="">
                            <th className="px-2 py-2 border-gray-200 rounded-l mb-4  bg-gray-200 font-normal capitalize  text-left text-gray-900">
                              <span className="lg:pl-2 whitespace-nowrap text-sm ">
                                Active Projects
                              </span>
                            </th>
                            <th className="hidden md:table-cell px-4 py-2 capitalize border-gray-200 font-normal  bg-gray-200 text-left text-gray-900">
                              <span className="lg:pl-2 text-sm ">Runs</span>
                            </th>
                            <th className=" hidden md:table-cell px-4 py-2 font-normal capitalize  border-gray-200 bg-gray-200 text-left text-gray-900">
                              <span className="text-sm ">milestones</span>
                            </th>
                            <th className="hidden md:table-cell px-4 py-2 font-normal capitalize border-gray-200 bg-gray-200 text-left text-gray-900">
                              <span className="whitespace-nowrap text-sm  ">
                                created on
                              </span>
                            </th>
                            <th className="pr-6 py-3 rounded-r border-gray-200 bg-gray-200 text-right font-normal capitalize text-gray-900 tracking-wider" />
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projectList.map((project: any, index: number) => (
                            <tr key={project.id}>
                              <td className="px-4 py-3 max-w-0 w-full whitespace-nowrap text-xs font-medium text-gray-900">
                                <div className="flex items-center space-x-3 lg:pl-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 cursor-pointer hover:text-indigo-100 ${
                                      project.favorite
                                        ? "text-indigo-700"
                                        : "text-indigo-100 hover:text-indigo-700"
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    onClick={() => makeFavorite(project.id)}
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <div
                                    className="bg-indigo-400 w-2.5 h-2.5 flex-shrink-0 rounded-full"
                                    aria-hidden="true"
                                  />
                                  <a
                                    onClick={() => goToView(project.id)}
                                    className="truncate hover:text-gray-600 hover:underline cursor-pointer"
                                  >
                                    <span>{project?.name}</span>
                                  </a>
                                </div>
                              </td>
                              <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-xs text-gray-500 text-right">
                                {project?.testsuites?.length}
                                {project?.testsuites?.length > 1
                                  ? ` runs`
                                  : ` run`}
                              </td>
                              <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-xs text-gray-500 text-right">
                                {project?.milestones?.length}
                                {project?.milestones?.length > 1
                                  ? ` milestones`
                                  : ` milestone`}
                              </td>
                              <td className="hidden  md:table-cell px-4 py-3  whitespace-nowrap text-xs text-gray-500 text-right">
                                {moment(new Date(project?.createdAt)).format(
                                  "MMMM DD, YYYY"
                                )}
                              </td>
                              <td className="pr-6">
                                <Menu
                                  as="div"
                                  className="relative flex justify-end items-center"
                                >
                                  {({ open }) => (
                                    <>
                                      <Menu.Button
                                        className={`w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none ${
                                          open &&
                                          "ring-2 ring-offset-2 ring-purple-500"
                                        }`}
                                      >
                                        <span className="sr-only">
                                          Open options
                                        </span>
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
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <Menu.Items
                                          static
                                          style={
                                            projectList.length - 1 === index &&
                                            projectList.length !== 1
                                              ? {
                                                  transform: "translateY(-55%)",
                                                }
                                              : {}
                                          }
                                          className="mx-3 cursor-pointer origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                                        >
                                          <div className="py-1">
                                            <Menu.Item>
                                              {({ active }) => (
                                                <a
                                                  onClick={() =>
                                                    goToEdit(project.id)
                                                  }
                                                  className={classNames(
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-700",
                                                    "group flex items-center px-4 py-2 text-sm"
                                                  )}
                                                >
                                                  <PencilAltIcon
                                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                  />
                                                  Edit
                                                </a>
                                              )}
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) => (
                                                <a
                                                  onClick={() =>
                                                    goToView(project.id)
                                                  }
                                                  className={classNames(
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-700",
                                                    "group flex items-center px-4 py-2 text-sm"
                                                  )}
                                                >
                                                  <EyeIcon
                                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                  />
                                                  View
                                                </a>
                                              )}
                                            </Menu.Item>
                                            {localStorage.getItem("role") ===
                                              "ORGADMIN" && (
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <a
                                                    onClick={() =>
                                                      openModal(project)
                                                    }
                                                    className={classNames(
                                                      active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                      "group flex items-center px-4 py-2 text-sm"
                                                    )}
                                                  >
                                                    <TrashIcon
                                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                      aria-hidden="true"
                                                    />
                                                    Delete
                                                  </a>
                                                )}
                                              </Menu.Item>
                                            )}
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </>
                                  )}
                                </Menu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {projectList.length === 0 && (
                      <div className="flex justify-center items-center content-center text-gray-500 text-xs font-medium italic my-4">
                        No project added yet.
                      </div>
                    )}

                    {/* <Pagination
                      setPageNum={setPageNum}
                      paginationData={paginationData}
                    /> */}
                  </div>
                </div>
                <div className="w-3/12 bg-gray-100 p-4">
                  <div className="bg-gray-200 text-sm px-4 py-2 mb-2 rounded">
                    Todos
                  </div>
                  {projectList.map((ele: any) => {
                    const activeEle = ele.testsuites.length
                      ? ele.testsuites.filter(
                          (item: any) => item.status !== "COMPLETED"
                        )
                      : [];
                    if (activeEle.length) {
                      return (
                        <div
                          className="flex justify-between align-center
                                    text-sm text-gray-500 p-2 border-b-2"
                          key={ele?.id}
                        >
                          <span
                            onClick={() => goToTodos(ele.id)}
                            className="hover:text-gray-600 hover:underline cursor-pointer"
                          >
                            {ele?.name}
                          </span>
                          <span>{activeEle.length}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
      {showModal && (
        <DeleteConfirmationModal
          msg={modalMsg}
          open={showModal}
          toogleModal={toogleModal}
          delete={deleteProject}
        />
      )}
    </>
  );
}

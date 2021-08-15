import React, { useState } from "react";
import { CheckCircleIcon as CheckCircleOutline } from "@heroicons/react/outline";
import {
  PencilAltIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import moment from "moment";
import DeleteConfirmationModal from "../../Common/DeleteModal";
import ConfirmModal from "../../Common/ConfirmModal";
import { showError, showSuccess } from "../../Toaster/ToasterFun";
import axiosService from "../../Utils/axios";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";

interface PropsType {
  RowData?: {
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
  editMilestone: (id: string) => void | any;
  viewMilestone: (id: string) => void | any;
  getMilestones: () => void | any;
}

export default function Table({
  RowData,
  editMilestone,
  viewMilestone,
  getMilestones,
}: PropsType) {
  const [ShowConfirmModal, setShowConfirmModal] = useState({
    open: false,
    message: <></>,
    id: "",
  });

  const [state, setstate] = useState({
    showModal: false,
    modalMsg: <></>,
    selectedId: "",
  });

  const openDeleteModal = (value: any) => {
    // const msg = `Are you sure want to delete this Milestone - ${value?.name} ?`;
    const msg = (
      <>
        Are you sure want to delete this Milestone{" "}
        <span className="font-semibold text-red-500">{`"${value.name}"`}</span>{" "}
        ?
      </>
    );
    setstate({ showModal: true, modalMsg: msg, selectedId: value?.id });
  };

  const deleteMilestone = async () => {
    setstate({ ...state, showModal: false });
    try {
      const response = await axiosService.delete(
        `/milestones/${state.selectedId}`,
        {}
      );
      if (response?.data?.success) {
        showSuccess(response.data.message);
        getMilestones();
      }
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    }
  };

  const changeStatus = async () => {
    setShowConfirmModal({
      ...ShowConfirmModal,
      open: false,
    });
    try {
      const response = await axiosService.put(
        `/milestones/${ShowConfirmModal.id}/status`,
        {
          status: "COMPLETED",
        }
      );
      if (response?.data?.success) {
        showSuccess(response.data.message);
        getMilestones();
      }
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    }
  };

  return (
    <>
      <DeleteConfirmationModal
        msg={state.modalMsg}
        open={state.showModal}
        toogleModal={(val: boolean) => setstate({ ...state, showModal: val })}
        delete={deleteMilestone}
      />

      <ConfirmModal
        handleCancel={() =>
          setShowConfirmModal({ ...ShowConfirmModal, open: false })
        }
        handleConfirm={() => changeStatus()}
        message={ShowConfirmModal.message}
        open={ShowConfirmModal.open}
      />

      <div className="flex flex-col overflow-hidden">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-10"
            id="test-run-list">
            <div className="overflow-hidden sm:rounded-lg">
              <table className={`min-w-full divide-y divide-gray-200 mb-6`}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">
                      Progress
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">
                      {RowData?.[0]?.status === "OPEN"
                        ? "Due Date"
                        : "End Date"}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {RowData?.map((value, i) => (
                    <tr key={i} className={`hover:bg-gray-50 rounded`}>
                      <td className="px-6 py-4 whitespace-nowrap  text-gray-500">
                        <a
                          onClick={() => viewMilestone(value.id)}
                          className=" truncate font-medium text-sm  text-gray-900 hover:underline cursor-pointer">
                          <span>{value?.name}</span>
                        </a>
                        <p className="text-sm text-gray-500 truncate">
                          {value.testsuites.length > 0 ? (
                            <>
                              Has{" "}
                              <span className="text-gray-500 font-medium">
                                {value.testsuites.length}
                              </span>{" "}
                              active test runs.
                            </>
                          ) : (
                            "No active test runs."
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-left text-xs font-medium">
                        <div
                          className={`w-full h-4 inline-block ${
                            value.testsuites.length === 0 && "bg-gray-200"
                          }`}>
                          {(() => {
                            const initialValue = {
                              untested: 0,
                              passed: 0,
                              failed: 0,
                              totalCase: 0,
                            };
                            const counts = value.testsuites.reduce(
                              (total, val) => {
                                const { untested, passed, failed, totalCase } =
                                  total;

                                return {
                                  untested: untested + val.testReport.untested,
                                  passed: passed + val.testReport.passed,
                                  failed: failed + val.testReport.failed,
                                  totalCase: totalCase + val.testReport.total,
                                };
                              },
                              initialValue
                            );

                            if (value.testsuites.length > 0) {
                              const passedPercentage =
                                (counts.passed / counts.totalCase) * 100;

                              const untestedPercentage =
                                (counts.untested / counts.totalCase) * 100;

                              const failedPercentage =
                                (counts.failed / counts.totalCase) * 100;

                              return (
                                <>
                                  <Tippy
                                    content={`${Math.round(
                                      passedPercentage
                                    )}% Passed (${counts.passed}/${
                                      counts.totalCase
                                    } tests)`}>
                                    <div
                                      className="inline-block h-full "
                                      style={{
                                        width: `${passedPercentage}%`,
                                        backgroundColor: "#3cb850",
                                      }}></div>
                                  </Tippy>

                                  <Tippy
                                    content={`${Math.round(
                                      untestedPercentage
                                    )}% Untested (${counts.untested}/${
                                      counts.totalCase
                                    } tests)`}>
                                    <div
                                      className="inline-block h-full "
                                      style={{
                                        width: `${untestedPercentage}%`,
                                        backgroundColor: "#979797",
                                      }}></div>
                                  </Tippy>

                                  <Tippy
                                    content={`${Math.round(
                                      failedPercentage
                                    )}% Failed (${counts.failed}/${
                                      counts.totalCase
                                    } tests)`}>
                                    <div
                                      className="inline-block h-full "
                                      style={{
                                        width: `${failedPercentage}%`,
                                        backgroundColor: "#e40046",
                                      }}></div>
                                  </Tippy>
                                </>
                              );
                            }
                          })()}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-right text-xs font-medium">
                        {moment(value.endDate).format("MMMM DD, YYYY")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex justify-end">
                          <PencilAltIcon
                            onClick={() => editMilestone(value.id)}
                            className="text-indigo-600 h-4 w-4 cursor-pointer mr-3"
                          />
                          <TrashIcon
                            onClick={() => openDeleteModal(value)}
                            className="text-indigo-600 h-4 w-4 cursor-pointer mr-3"
                          />
                          {value.status === "OPEN" ? (
                            <Tippy content="Mark as Complete">
                              <div>
                                <CheckCircleOutline
                                  onClick={() => {
                                    setShowConfirmModal({
                                      message: (
                                        <>
                                          Are you sure you want to mark{" "}
                                          <span className="font-medium text-indigo-600">
                                            {`"${value.name}"`}
                                          </span>{" "}
                                          as complete?
                                        </>
                                      ),
                                      id: value.id,
                                      open: true,
                                    });
                                  }}
                                  className="text-indigo-600 h-4 w-4 cursor-pointer mr-1"
                                />
                              </div>
                            </Tippy>
                          ) : (
                            <Tippy content="Completed">
                              <div>
                                <CheckCircleIcon className="text-indigo-600 h-4 w-4 mr-1" />
                              </div>
                            </Tippy>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

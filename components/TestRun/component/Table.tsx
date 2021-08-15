import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { useState } from "react";
import DeleteConfirmationModal from "../../Common/DeleteModal";
import { showError, showSuccess } from "../../Toaster/ToasterFun";
import axiosService from "../../Utils/axios";

interface Props {
  RowData: (string | number)[];
  editTestRun: (id: string) => void | any;
  viewTestRun: (id: string) => void | any;
  getTestRun: () => void | any;
  projectName: string;
}

export default function Table(props: Props) {
  const [showModal, toogleModal] = useState(false);
  const [modalMsg, setMsg] = useState(<></>);
  const [selectedId, setSelectedId] = useState("");

  const openDeleteModal = (value: any) => {
    setSelectedId(value?.id);
    const msg = (
      <>
        Are you sure want to delete the Test run report{" "}
        <span className="font-semibold text-red-500">{`"${value?.name}"`}</span>
        ?
      </>
    );
    setMsg(msg);
    toogleModal(true);
  };

  const deleteTestRun = async () => {
    toogleModal(false);
    try {
      const response = await axiosService.delete(
        `/test-suites/${selectedId}`,
        {}
      );
      if (response?.data?.success) {
        showSuccess(response.data.message);
        props.getTestRun();
      }
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    }
  };

  return (
    <>
      {showModal && (
        <DeleteConfirmationModal
          msg={modalMsg}
          open={showModal}
          toogleModal={toogleModal}
          delete={deleteTestRun}
        />
      )}
      <div className="flex flex-col overflow-hidden ">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-10"
            id="test-run-report">
            <div
              id="pdf-header"
              className=" flex item-center justify-center font-medium text-gray-900 py-3 hidden">
              {props?.projectName}&nbsp;Project Test Run Report
            </div>
            <div
              className={` border-b border-gray-200 ${props.RowData.length < 1 && "hidden"
                } `}>
              <table className="min-w-full ">
                <thead className={`bg-gray-50 border-t border-b `}>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3  rounded-l text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right rounded-r  text-xs font-medium text-gray-500 uppercase tracking-wider"
                      id="action-header">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {props.RowData.map((value: any, i) => (
                    <tr
                      // onClick={() => props.viewTestRun(value.id)}
                      key={i}
                      className={`hover:bg-indigo-100 rounded`}>
                      <td className="px-6 py-4 whitespace-nowrap  text-gray-500">
                        <a
                          onClick={(e) => {
                            e.stopPropagation();
                            props.viewTestRun(value.id);
                          }}
                          className="truncate font-medium text-gray-800 hover:text-gray-900 hover:underline cursor-pointer text-sm">
                          <span>{value.name}</span>
                        </a>
                        <p className="text-sm text-gray-500 truncate">
                          {value.testreport?.passed} Passed,{" "}
                          {value.testreport?.failed} Failed,{" "}
                          {value.testreport?.untested} Untested
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex justify-end">
                          <span
                            className={`capitalize mr-3 inline-flex items-center justify-center w-20 text-center px-2.5 py-0.5 rounded text-xs font-medium text-white
                          ${value.status === "PENDING" && "bg-indigo-400"} 
                          ${value.status === "INPROGRESS" && "bg-indigo-500"} 
                          ${value.status === "COMPLETED" && "bg-indigo-600"} 
                          `}>
                            {value.status === "INPROGRESS"
                              ? "In Progress"
                              : value.status.toLowerCase()}
                          </span>
                          <PencilAltIcon
                            onClick={() => props.editTestRun(value.id)}
                            className="text-indigo-600 h-4 w-4 cursor-pointer mr-2"
                          />
                          <TrashIcon
                            onClick={() => openDeleteModal(value)}
                            className="text-indigo-600 h-4 w-4 cursor-pointer"
                          />
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
      {props.RowData.length === 0 && (
        <div className="flex justify-center items-center content-center text-gray-500 text-xs font-medium italic my-2">
          No test run added yet.
        </div>
      )}
    </>
  );
}

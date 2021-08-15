import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import PopUp from "./PopUp";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  RowData: (string | number)[];
  submitStatus: (id: string, data: any) => void | any;
  name: string;
  seTestCaseNum: (num: number) => void | any;
}

export default function Table({
  RowData,
  submitStatus,
  name,
  seTestCaseNum,
}: Props) {
  //for popUp
  const [openPopUp, setOpenPopUp] = useState(false);

  // for storing status and id
  const [statusData, setStatusData] = useState({
    status: "",
    id: "",
  });

  // for catching comment from popUp component and to update status and comment
  const submitData = (text: string, doNotUpdate?: boolean) => {
    if (doNotUpdate) return setOpenPopUp(false);

    text
      ? submitStatus(statusData.id, {
          status: statusData.status,
          comment: text,
        })
      : submitStatus(statusData.id, { status: statusData.status });

    setOpenPopUp(false);
  };

  return (
    <>
      <PopUp open={openPopUp} submitData={submitData} />
      <div className="flex flex-col overflow-hidden">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-10"
            id="test-run-list"
          >
            <div
              id="pdf-header"
              className=" flex item-center justify-center font-medium text-gray-900 py-3 hidden"
            >
              {name}&nbsp;Test Run Details
            </div>
            <div className="overflow-hidden sm:rounded-lg">
              <table
                className={`min-w-full divide-y divide-gray-200 ${
                  RowData.length === 1
                    ? "mb-24"
                    : RowData.length === 0
                    ? ""
                    : "mb-6"
                }`}
              >
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12"
                    >
                      Action
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {RowData.map((value: any, i) => (
                    <tr key={i} className={`hover:bg-gray-50 rounded`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a
                          onClick={(e) => {
                            e.stopPropagation();
                            seTestCaseNum(1 + i);
                          }}
                          className="truncate hover:text-gray-600 hover:underline cursor-pointer"
                        >
                          <span>{value?.testCaseId}</span>
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-800 hover:text-gray-900">
                        <a
                          onClick={(e) => {
                            e.stopPropagation();
                            seTestCaseNum(1 + i);
                          }}
                          className="truncate hover:text-gray-600 hover:underline cursor-pointer"
                        >
                          <span>{value?.testCaseTitle}</span>
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <span
                          className={`capitalize inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            value?.status === "PASSED"
                              ? "bg-green-100 text-green-800"
                              : value?.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {value?.status.toLowerCase()}
                        </span>
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
                                  open && "ring-2 ring-offset-2 ring-purple-500"
                                }`}
                              >
                                <span className="sr-only">Open options</span>
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
                                    RowData.length - 1 === i &&
                                    RowData.length !== 1
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
                                          onClick={() => {
                                            setStatusData({
                                              ...statusData,
                                              status: "FAILED",
                                              id: value.id,
                                            });
                                            setOpenPopUp(true);
                                          }}
                                          className={classNames(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "group flex items-center px-4 py-2 text-xs"
                                          )}
                                        >
                                          Failed
                                        </a>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          onClick={() => {
                                            setStatusData({
                                              ...statusData,
                                              status: "PASSED",
                                              id: value.id,
                                            });
                                            setOpenPopUp(true);
                                          }}
                                          className={classNames(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "group flex items-center px-4 py-2 text-xs"
                                          )}
                                        >
                                          Passed
                                        </a>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          onClick={() => {
                                            setStatusData({
                                              ...statusData,
                                              status: "UNTESTED",
                                              id: value.id,
                                            });
                                            setOpenPopUp(true);
                                          }}
                                          className={classNames(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "group flex items-center px-4 py-2 text-xs"
                                          )}
                                        >
                                          Untested
                                        </a>
                                      )}
                                    </Menu.Item>
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
          </div>
        </div>
        {RowData.length === 0 && (
          <div className="flex justify-center items-center content-center text-gray-500 text-xs font-medium italic my-2">
            No test case added yet.
          </div>
        )}
      </div>
    </>
  );
}

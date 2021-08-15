// import Table from "../Common/Table";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// @ts-ignore
import ReactDragListView from "react-drag-listview/lib";
import {
  PencilAltIcon,
  TrashIcon,
  PlusIcon,
  DotsVerticalIcon,
} from "@heroicons/react/solid";
import axiosService from "../../Utils/axios";

export default function TestCaseListTable({
  testcases,
  openDeleteModal,
  sectionId,
  SectionName,
  showDragIcon,
  selectedData,
}: any) {
  const router = useRouter();

  const [orderTestCases, setOrderTestCases] = useState([...testcases]);

  useEffect(() => {
    setOrderTestCases(
      testcases?.map((val: any) => ({
        ...val,
        checked: false,
        SectionName,
      }))
    );
  }, [testcases]);

  const editTestCase = (id: string) => {
    router.push(`/projects/${router.query.pid}/editTestcase/${id}`);
  };

  const viewTestCase = (id: string) => {
    router.push(`/projects/${router.query.pid}/testcase/${id}`);
  };

  const reorderTestcase = async (obj: any, newPosition: number) => {
    const data = {
      testCaseId: obj?.id,
      newPosition: newPosition + 1,
    };
    try {
      await axiosService.post(
        `/projects/${router.query.pid}/sections/${sectionId}/re-order`,
        data
      );
    } catch (err) {
      console.error(err);
    }
  };

  const dragProps = {
    onDragEnd(fromIndex: any, toIndex: any) {
      // const data = [...orderdArticles!];
      const data = [...orderTestCases];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      setOrderTestCases(data);

      reorderTestcase(item, toIndex);
    },

    nodeSelector: "tr",
    handleSelector: "a",
  };

  // To export testCases data in excel
  useEffect(() => {
    let result: any[] = [];
    for (const x of orderTestCases) {
      if (x.checked) result = [...result, x];
    }
    selectedData([...result], SectionName);
  }, [orderTestCases]);

  return (
    <ReactDragListView {...dragProps}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* <<<<<<< HEAD */}
            {/* <th className="pb-1 flex mr-auto text-center py-4  whitespace-nowrap text-sm font-medium text-gray-900"> */}
            {/* ======= */}
            <th className="pb-1 text-left flex mr-auto text-center py-4  whitespace-nowrap text-xs font-medium text-gray-900">
              {/* >>>>>>> cb1dac0677e79182e10af6ac49b03b5f47058cac */}
              <div className="mx-auto flex ">
                {showDragIcon && <div className="h-4 w-4 mb-2 mr-2"></div>}

                <input
                  className={`h-4 w-4 text-indigo-600  border-gray-300 rounded focus:outline-none`}
                  type="checkbox"
                  checked={(() => {
                    let res = false;
                    for (const x of orderTestCases) {
                      if (!x.checked) return (res = x.checked);
                      res = x.checked;
                    }
                    return res;
                  })()}
                  onChange={(e) =>
                    setOrderTestCases(
                      orderTestCases.map((val) => ({
                        ...val,
                        checked: e.target.checked,
                      }))
                    )
                  }
                />
              </div>
            </th>
            <th
              scope="col"
              className="pr-6  py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              id="action-header">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orderTestCases?.map(
            (
              test: {
                testcaseId: string;
                title: string;
                id: string;
                checked: boolean;
              },
              i
            ) => (
              <tr
                // onClick={() => viewTestCase(test.id)}
                key={i}
                className="bg-white hover:bg-indigo-100 rounded">
                <td className="flex mx-auto text-center py-4  whitespace-nowrap text-xs font-normal text-gray-900 ">
                  <div className="flex mx-auto">
                    {showDragIcon && (
                      <a href="#" title="Drag" className="drag mr-2">
                        <DotsVerticalIcon className="text-gray-500 mx-auto h-4 w-4 cursor-move dragIcon" />

                        <PlusIcon className="text-indigo-600 mx-auto h-4 w-4 cursor-move plusIcon hidden" />
                      </a>
                    )}
                    <input
                      className={`h-4 w-4 text-indigo-600 focus:outline-none border-gray-300 rounded `}
                      type="checkbox"
                      checked={test.checked}
                      onChange={(e) =>
                        setOrderTestCases(
                          orderTestCases.map((val) =>
                            val.id === test.id
                              ? {
                                ...val,
                                checked: e.target.checked,
                              }
                              : { ...val }
                          )
                        )
                      }
                    />
                  </div>
                </td>
                <td className="pr-6 py-4 whitespace-nowrap text-xs font-medium  text-gray-900 ">
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      viewTestCase(test.id);
                    }}
                    className="truncate hover:text-gray-900 text-sm text-gray-800 hover:underline cursor-pointer">
                    <span>{test.testcaseId}</span>
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      viewTestCase(test.id);
                    }}
                    className="  hover:underline cursor-pointer font-medium hover:text-gray-900 text-sm text-gray-800">
                    <span>{`${(test.title).length > 110 ? `${(test.title).slice(0, 110)}....` : `${(test.title)}`}`}</span>
                  </a>
                </td>
                <td
                  id="action-value"
                  className=" px-6 py-4 whitespace-nowrap text-right text-xs font-normal">
                  <div className="flex justify-end">
                    <PencilAltIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        editTestCase(test.id);
                      }}
                      className="text-indigo-600 h-4 w-4 cursor-pointer mr-2"
                    />
                    <TrashIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(test);
                      }}
                      className="text-indigo-600 h-4 w-4 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </ReactDragListView>
  );
}

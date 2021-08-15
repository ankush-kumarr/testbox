import moment from "moment";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";

interface PropsType {
  RowData: {
    description: null | string;
    id: string;
    name: string;
    createdAt: string;
    testReport: {
      failed: number;
      passed: number;
      total: number;
      untested: number;
    };
  }[];
  viewTestRun: (id: string) => void | any;
}

export default function Table({ RowData, viewTestRun }: PropsType) {
  return (
    <>
      <div
        className={`flex flex-col overflow-hidden ${
          RowData.length < 1 && "hidden"
        }`}>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-10">
            <div className="overflow-hidden sm:rounded-lg">
              <table className={`min-w-full divide-y divide-gray-200 mb-6`}>
                <thead className="bg-gray-50 border-b border-t">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                      Progress
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {RowData?.map((value, i) => (
                    <tr key={i} className={`hover:bg-gray-50 rounded`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a
                          onClick={() => viewTestRun(value.id)}
                          className="font-medium truncate text-gray-900 hover:underline cursor-pointer">
                          <span>{value?.name}</span>
                        </a>
                        <p className="text-xs text-gray-400 truncate pt-1">
                          <span className="text-gray-900 ">
                            {moment(value.createdAt).format("MMMM DD, YYYY")}
                          </span>
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-medium mx-4">
                        <div className="w-full h-full flex items-center">
                          <div className=" w-32 sm:w-48 h-4 inline-block">
                            {(() => {
                              const { untested, passed, failed, total } =
                                value.testReport;

                              const passedPercentage = (passed / total) * 100;

                              const untestedPercentage =
                                (untested / total) * 100;

                              const failedPercentage = (failed / total) * 100;

                              return (
                                <>
                                  <Tippy
                                    content={`${Math.round(
                                      passedPercentage
                                    )}% Passed (${passed}/${total} tests)`}>
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
                                    )}% Untested (${untested}/${total} tests)`}>
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
                                    )}% Failed (${failed}/${total} tests)`}
                                    flip>
                                    <div
                                      className="inline-block h-full "
                                      style={{
                                        width: `${failedPercentage}%`,
                                        backgroundColor: "#e40046",
                                      }}></div>
                                  </Tippy>
                                </>
                              );
                            })()}
                          </div>

                          <div className="ml-3 content-center h-4 inline-flex items-center font-medium text-gray-700 text-sm">
                            {Math.round(
                              (value.testReport.passed /
                                value.testReport.total) *
                                100
                            )}
                            %
                          </div>
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
      {RowData?.length === 0 && (
        <div className="flex justify-center items-center content-center text-gray-500 text-sm font-medium italic">
          No active test runs in this milestone.
        </div>
      )}
    </>
  );
}

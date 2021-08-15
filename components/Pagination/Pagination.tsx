interface Props {
  setPageNum: (arg: number) => void | number;
  paginationData: {
    itemCount: number;
    page: number;
    pageCount: number;
    take: number;
  };
}

import { useState, useMemo, useEffect } from "react";

export default function Pagination(data: Props) {
  // console.log("pagination", data);
  const [ShowLastData, setShowLastData] = useState(false);

  const state = useMemo(
    () => ({
      showing:
        data.paginationData?.page * data.paginationData?.take -
        (data.paginationData.take - 1),
      to:
        data.paginationData.page * data.paginationData.take >
          data.paginationData.itemCount
          ? data.paginationData.itemCount
          : data.paginationData.page * data.paginationData.take,
    }),
    [data.paginationData]
  );

  useEffect(() => {
    if (state.showing === state.to) setShowLastData(true);
    else setShowLastData(false);
  }, [data.paginationData]);

  return data.paginationData?.pageCount > 1 ? (
    <div className="mx-auto sm:px-6 lg:px-8 mt-6" id="pagination">
      <nav
        className="bg-white px-4 py-3 flex items-center justify-between border-gray-200 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing&nbsp;
            <span className="font-medium">{state.showing}</span>
            {!ShowLastData && (
              <>
                &nbsp;to&nbsp;
                <span className="font-medium">{state.to}</span>
              </>
            )}
            &nbsp;of&nbsp;
            <span className="font-medium">{data.paginationData.itemCount}</span>
            &nbsp;results&nbsp;
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <div
            onClick={() => {
              data.paginationData.page === 1 || data.paginationData.page === 0
                ? null
                : data.setPageNum(data.paginationData.page - 1);
            }}
            className={`mt-1 cursor-pointer relative inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${(data.paginationData.page === 1 ||
                data.paginationData.page === 0) &&
              "hidden"
              }`}
          >
            Previous
          </div>
          <div
            onClick={() => {
              data.paginationData.page === data.paginationData.pageCount
                ? null
                : data.setPageNum(data.paginationData.page + 1);
            }}
            className={`mt-1 cursor-pointer ml-3 relative inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${data.paginationData.page === data.paginationData.pageCount &&
              "hidden"
              }`}
          >
            Next
          </div>
        </div>
      </nav>
    </div>
  ) : null;
}

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
        <div className="mx-4 flex items-center justify-start" id="pagination">  {/* mx-auto sm:px-6 lg:px-8 mt-6 */}
            <nav
                className="bg-white  flex flex-col items-center border-gray-200"
                aria-label="Pagination"
            >

                {/* button  */}
                <div className=" flex justify-between sm:justify-end ">
                    <div
                        onClick={() => {
                            data.paginationData.page === 1 || data.paginationData.page === 0
                                ? null
                                : data.setPageNum(data.paginationData.page - 1);
                        }}
                        className={` cursor-pointer rounded-l-full inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded-md text-gray-800 bg-indigo-50 hover:bg-indigo-100 ${(data.paginationData.page === 1 ||
                            data.paginationData.page === 0) &&
                            "hidden"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div
                        onClick={() => {
                            data.paginationData.page === data.paginationData.pageCount
                                ? null
                                : data.setPageNum(data.paginationData.page + 1);
                        }}
                        className={` cursor-pointer rounded-r-full ml-0.5 inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded-md text-gray-800 bg-indigo-50 hover:bg-indigo-100  ${data.paginationData.page === data.paginationData.pageCount &&
                            "hidden"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="hidden">
                    <p className="text-sm  text-gray-500">
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
            </nav>
        </div>
    ) : null;
}

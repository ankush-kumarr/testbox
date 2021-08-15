/* eslint-disable react/no-unescaped-entities */
import React from "react";

const MultipleMemberList = ({ users }: any) => {
  return (
    <main className="pb-12 px-4 lg:col-span-9 ">
      <div className="flex flex-col ">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <div className="pb-1 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-base leading-6 font-medium text-gray-900">
                  Preview
                </h3>
              </div>
              <div className="min-w-full divide-y divide-gray-200 border-2 border-gray-200 h-52  block overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 ">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider w-2"
                      >
                        Sno.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 position-relative ">
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="mt-4">
                          <div className="text-gray-500 text-sm text-center">
                            No user added yet.
                          </div>
                        </td>
                      </tr>
                    )}

                    {users?.map((user: any, index: any) => {
                      if (!user?.valid) {
                        return (
                          <tr className="text-sm">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="w-full" colSpan={3}>
                              <div className=" text-red-500 text-sm">
                                Please enter information in the given format.
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={index} className="table-row">
                          <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {user.title}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MultipleMemberList;

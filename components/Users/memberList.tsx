import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Button from "../Button";
import { showError, showSuccess } from "../../components/Toaster/ToasterFun";
import axiosService from "../Utils/axios";
import Loader from "../Loader/Loader";
import Pagination from "../Pagination/Pagination";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";
import { PencilAltIcon, MailIcon } from "@heroicons/react/solid";
const memberList = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [paginationData, setPaginationData] = useState({
    itemCount: 0,
    page: 0,
    pageCount: 0,
    take: 0,
  });
  const router = useRouter();
  useEffect(() => {
    getData();
  }, [pageNum]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get(
        `/organizations/members?order=DESC&page=${pageNum}&take=5`
      );
      const isAdmin = await axiosService.get("/auth/me");
      setUserRole(isAdmin.data.data.role);
      setUsers(response.data.data.data);
      setPaginationData(response.data.data.meta);
    } catch (error) {
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Something went wrong");
      }
    }
    setLoading(false);
  };
  const resendPassword = async (email: string) => {
    await axiosService.post("/auth/send-reset-link", { email: email });
    showSuccess("Email Sent to " + email);
  };
  return (
    <main className="pb-12 px-4 lg:col-span-9">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden border-gray-200 ">
              <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Users
                </h3>
                <div className="mt-5 flex sm:mt-1 mr-1 sm:ml-0">
                  <Button
                    id="add-new-member"
                    onClick={() => router.push("/users/add")}
                    type="button"
                    className="border border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New
                  </Button>
                  <Button
                    id="add-new-member"
                    onClick={() => router.push("/users/addMultiple")}
                    type="button"
                    className="border border-transparent ml-2 shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Multiple Users
                  </Button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center content-center my-32">
                  <Loader />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          userRole === "ORGADMIN" ? "text-left" : "text-right"
                        }`}
                      >
                        Role
                      </th>
                      {userRole === "ORGADMIN" && (
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user: any, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                            userRole === "ORGADMIN" ? "text-left" : "text-right"
                          }`}
                        >
                          {user.role === "ORGADMIN"
                            ? "Owner"
                            : user.role.charAt(0).toUpperCase() +
                              user.role
                                .toLowerCase()
                                .slice(1, user.role.length)}
                        </td>
                        {userRole === "ORGADMIN" && (
                          <td className="py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                            <Tippy content="Resend Password Link">
                              <span>
                                <MailIcon
                                  className="text-indigo-600 h-4 w-4 cursor-pointer mr-3"
                                  onClick={() => resendPassword(user.email)}
                                />
                              </span>
                            </Tippy>
                            <Tippy content="Edit Member">
                              <span>
                                <PencilAltIcon
                                  onClick={() =>
                                    router.push("/users/edit/" + user.id)
                                  }
                                  className="text-indigo-600 h-4 w-4 cursor-pointer mr-3"
                                />
                              </span>
                            </Tippy>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  {users.length === 0 && (
                    <div className="flex justify-center items-center content-center text-gray-400 text-base italic my-2">
                      No projects added yet.
                    </div>
                  )}
                </table>
              )}
              <Pagination
                setPageNum={setPageNum}
                paginationData={paginationData}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default memberList;

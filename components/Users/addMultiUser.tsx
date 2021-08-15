/* eslint-disable react/no-unescaped-entities */

import React, { useState } from "react";
import { useRouter } from "next/router";

import { InformationCircleIcon } from "@heroicons/react/solid";
import MultipleMemberList from "./multipleMemberList";
import Button from "../Button";
import axiosService from "../Utils/axios";
import { showError } from "../Toaster/ToasterFun";

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateName(name: string) {
  const re = /^(?=)[a-zA-Z æøåÆØÅ]+(?:[-' ][a-zA-Z æøåÆØÅ]+)*$/;
  return re.test(String(name).toLowerCase());
}

const AddMultiUser = () => {
  const [data, setData] = useState<any>([]);
  const router = useRouter();
  const [apiloading, setApiLoading] = useState(false);

  //Function to add users
  const submitFormAddMultipleUser = async () => {
    setApiLoading(true);

    const formData = {
      members: data,
    };
    try {
      await axiosService.post("/organizations/members/multiple", formData);
      router.push("/settings/users");
    } catch (error) {
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Something went wrong");
      }
    } finally {
      setApiLoading(false);
    }
  };

  const textAreahandler = (e: any) => {
    const listString = e?.target?.value.split("\n");
    setData([]);
    const array: any = [];
    listString.forEach((item: any) => {
      const stringArray = item.split(",");

      if (stringArray.length === 4) {
        array.push({
          firstName: stringArray[0]?.trim(),
          lastName: stringArray[1]?.trim(),
          email: stringArray[2]?.trim(),
          title: stringArray[3]?.trim(),
          valid:
            validateName(stringArray[0]?.trim()) &&
            validateName(stringArray[1]?.trim()) &&
            validateEmail(stringArray[2]?.trim()) &&
            stringArray[3]?.trim() !== "" &&
            stringArray[0]?.trim() !== "" &&
            stringArray[1]?.trim() !== "" &&
            array?.filter((obj: any) => obj?.email === stringArray[2]?.trim())
              ?.length === 0,
        });
      }
    });
    setData(array);
  };

  return (
    <div className="w-8/12 mx-auto px-8 pt-10 ">
      <div>
        <label className="block text-lg font-medium text-gray-900">
          Add New Users
        </label>
        <p className="block text-sm font-normal text-gray-500">
          Please fill in details for new users.
        </p>
      </div>
      <div className="w-full mt-5">
        <div className="border p-5 rounded-md border-grey-900 mb-2 bg-indigo-100">
          <div className=" flex">
            <InformationCircleIcon className="text-blue-600 h-8 w-8 mt-2 cursor-pointer" />
            <div>
              <div className="font-bold text-sm mb-2 ml-4 text-gray-800">
                Steps to add multiple users
              </div>
              <div className="text-sm ml-10">
                <ol className="list-decimal">
                  <li className="empty-ol-item">
                    <p>
                      Enter each user on a separate line in the text box below
                      using the following format:
                    </p>

                    <div className="m-4">
                      <p className="text-gray-600 italic">
                        FirstName, LastName, Email, Title
                        <br />
                        Bob, Doe, bob@example.com, Title
                        <br />
                      </p>
                    </div>
                  </li>

                  <li className="empty-ol-item">
                    Please ensure that first & last name should only contain
                    letters.
                  </li>
                  <li className="empty-ol-item">
                    Please ensure that all user's email should be unique.
                  </li>
                  <li className="empty-ol-item">
                    Use the Submit button at the bottom of the page to add the
                    users
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-20 mt-20 min-h-20">
          <div>
            <label
              htmlFor="Users*"
              className="block text-base font-medium text-gray-700"
            >
              Users*
            </label>
            <div className="mt-1 relative">
              <textarea
                onChange={textAreahandler}
                className="w-full border-2 border-gray-200 text-sm p-3"
                rows={9}
                cols={5}
                placeholder="Please enter user's details."
              />
            </div>
          </div>
          <div>
            <MultipleMemberList users={data} />
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <button
            onMouseDown={() => router.back()}
            type="button"
            className={` bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500 `}
          >
            Cancel
          </button>
          <Button
            id="add-user-submit"
            onClick={submitFormAddMultipleUser}
            loading={apiloading}
            type="submit"
            disabled={
              data?.length === 0 || data?.find((obj: any) => !obj?.valid)
            }
            className={`ml-4  border border-transparent  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddMultiUser;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchBox from "../Search/SearchBox";

export default function UserHeader() {
  const [showUserSetting, setShowUserSetting] = useState(false);
  const router = useRouter();

  const toogleSetting = () => {
    setShowUserSetting(!showUserSetting);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  const goToDashboard = () => {
    router.push("/");
  };

  const goToProfile = () => {
    toogleSetting();
    router.push("/profile/update-profile");
  };

  const handleClick = (e: any) => {
    if (e.target?.id !== "OpenProfile") setShowUserSetting(false);
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClick);
    return () => document.body.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <nav className="bg-gray-800 sticky top-0 z-10">
        <div className="px-8">
          <div className="relative flex items-center justify-between h-12">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false">
                <span className="sr-only">Open main menu</span>

                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="block lg:hidden h-6 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="TestBox"
                />
                <img
                  className="hidden lg:block h-6 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="TestBox"
                />
                <span className="text-white font-medium text-base px-3 hidden lg:block">
                  TESTBOX
                </span>
                <span className="text-white font-medium px-3 block lg:hidden">
                  {""}
                </span>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <a
                    onClick={goToDashboard}
                    className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                    aria-current="page">
                    Dashboard
                  </a>
                </div>
              </div>
              <div className="ml-auto flex relative">
                <SearchBox />
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto ml-2 lg:ml-4 sm:pr-0">
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true">
                    <span className="sr-only">Open user menu</span>
                    <img
                      id="OpenProfile"
                      className="h-8 w-8 rounded-full"
                      src="/profile.png"
                      onClick={() => toogleSetting()}
                    />
                  </button>
                </div>

                {showUserSetting && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu">
                    <a
                      onClick={goToProfile}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem">
                      Your Profile
                    </a>
                    <a
                      onClick={() => router.push("/settings/users")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem">
                      Settings
                    </a>
                    <a
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem">
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              onClick={goToDashboard}
              className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
              aria-current="page">
              Dashboard
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

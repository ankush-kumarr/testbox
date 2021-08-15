import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../Button";
const TabData: string[] = ["Test Cases"];

export default function Tabs() {
  const [HandleSwitch, setHandleSwitch] = useState(1);
  const router = useRouter();
  return (
    <>
      <div className="pl-4 w-full h-10 sm:px-6 lg:px-8">
        <div className=" w-full flex border-b-2">
          {TabData.map((val, i) => (
            <div
              key={val}
              onClick={() => setHandleSwitch(i + 1)}
              className={`relative mr-4 h-auto ${
                HandleSwitch === i + 1 ? "text-blue-500" : ""
              }`}
            >
              <div>{val}</div>
              {HandleSwitch === i + 1 && (
                <span className="absolute h-0.5 w-full bg-blue-500 bottom-0"></span>
              )}
            </div>
          ))}
          <Link href={`/projects/${router.query.pid}/createtest`}>
            <div className="ml-auto relative bottom-2">
              <Button
                id="new-case"
                className="inline-flex col-start-6 col-span-1 items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  className="h-6 w-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Case
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

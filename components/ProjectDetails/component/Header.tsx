interface PropsData {
  title?: string | JSX.Element;
  redirectToPage?: { url: string; text: string };
  redirectToBack?: string;
  description?: string | JSX.Element;
  status?: string;
  ShowCSV?: {
    tooltip: string;
    fileName: string;
    headers: { label: string; key: string }[];
    data: any[];
    errorMessage: string;
    ColorEnable?: boolean;
  };
  ShowEdit?: {
    HandleClick: () => any;
    tooltip: string;
    ColorEnable?: boolean;
  };
  ShowDelete?: {
    HandleClick: () => any;
    tooltip: string;
    ColorEnable?: boolean;
  };
  ShowPrinter?: { HandleClick: () => any; tooltip: string };
}

import React, { useState } from "react";
import {
  PrinterIcon,
  PencilIcon,
  TrashIcon,
  DocumentDownloadIcon,
} from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Button from "../../Button";
import BackButton from "../../Button/cancelButton";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";
import { showError } from "../../Toaster/ToasterFun";
// @ts-ignore
import { CSVLink } from "react-csv";

export default function TestCaseHeading({
  title,
  description,
  status,
  redirectToPage,
  redirectToBack,
  ShowEdit,
  ShowDelete,
  ShowPrinter,
  ShowCSV,
}: PropsData) {
  const router = useRouter();

  // To show loader in button if clicked
  const [buttonLoader, setButtonLoader] = useState({
    backButton: false,
    redirectButton: false,
  });

  return (
    <div className="px-4 pt-4 pb-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="flex-1 min-w-0">
        {title && (
          <h2 className="text-xl font-semibold leading-6 text-gray-900 ">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-gray-500 truncate mt-1">{description}</p>
        )}
      </div>

      <div className="mt-4 flex sm:mt-0 sm:ml-4">
        {ShowCSV && (
          <Tippy content={ShowCSV.tooltip}>
            <div>
              <CSVLink
                onClick={() => {
                  if (ShowCSV.data.length > 0) return true;
                  showError(ShowCSV.errorMessage);
                  return false;
                }}
                filename={ShowCSV.fileName}
                data={ShowCSV.data}
                headers={ShowCSV.headers}>
                <DocumentDownloadIcon
                  className={`h-6 w-6 mt-2 cursor-pointer ${
                    ShowCSV.ColorEnable ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
              </CSVLink>
            </div>
          </Tippy>
        )}

        {ShowPrinter && (
          <Tippy content={ShowPrinter.tooltip}>
            <div className="mx-3">
              <PrinterIcon
                className="text-indigo-600 h-6 w-6 mt-2 cursor-pointer"
                onClick={ShowPrinter.HandleClick}
              />
            </div>
          </Tippy>
        )}

        {ShowEdit && (
          <Tippy content={ShowEdit.tooltip}>
            <div className="">
              <PencilIcon
                className={`h-6 w-6 mt-2 cursor-pointer ${
                  ShowEdit.ColorEnable ? "text-indigo-600" : "text-gray-400"
                }`}
                onClick={ShowEdit.HandleClick}
              />
            </div>
          </Tippy>
        )}

        {ShowDelete && (
          <Tippy content={ShowDelete.tooltip}>
            <div className="mx-2">
              <TrashIcon
                // className="text-indigo-600 h-6 w-6 mt-2 cursor-pointer"
                className={`h-6 w-6 mt-2 cursor-pointer ${
                  ShowDelete.ColorEnable ? "text-indigo-600" : "text-gray-400"
                }`}
                onClick={ShowDelete.HandleClick}
              />
            </div>
          </Tippy>
        )}

        {status && (
          <div
            className={`capitalize mr-0 mt-2 h-6 inline-flex items-center  px-2.5 py-0.5 rounded-md text-sm font-medium text-white
              ${status?.toLowerCase() === "pending" && "bg-indigo-400"}
              ${status?.toLowerCase() === "in progress" && "bg-indigo-500"}
              ${status?.toLowerCase() === "completed" && "bg-indigo-600"}
               `}>
            {status}
          </div>
        )}

        {redirectToPage && (
          <div>
            <Button
              id={redirectToPage?.text}
              loading={buttonLoader.redirectButton}
              type="button"
              onClick={() => {
                setButtonLoader({ ...buttonLoader, redirectButton: true });
                router.push(redirectToPage.url);
              }}
              className="ml-3 mt-1 inline-flex items-center ">
              {redirectToPage?.text}
            </Button>
          </div>
        )}

        {redirectToBack && (
          <BackButton
            onMouseDown={() => {
              router.push(redirectToBack);
            }}
            type="button"
            className="ml-3 mt-1 inline-flex items-center ">
            Back
          </BackButton>
        )}
      </div>
    </div>
  );
}

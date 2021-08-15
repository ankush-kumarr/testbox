import { PrinterIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import downloadPdf from "../../Common/DownloadPdf";

export default function TestCaseHeading({ projectName, setShowLoader }: any) {
  const router = useRouter();
  const printDocument = async () => {
    setShowLoader(true);
    await downloadPdf("test-case-report");
    setShowLoader(false);
  };

  return (
    <div className=" px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-bold leading-6 text-gray-900 ">
          {projectName && projectName + " Project"}
        </h2>
      </div>
      <div className="mt-4 flex sm:mt-0 sm:ml-4">
        <PrinterIcon
          className="text-indigo-600 h-6 w-6 mt-2 cursor-pointer"
          onClick={printDocument}
        />
        <Link href={`/projects/${router.query.pid}/createtest`}>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Test Case
          </button>
        </Link>
      </div>
    </div>
  );
}

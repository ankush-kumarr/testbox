import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import SectionTable from "./ModalSectionTable";
import { useRouter } from "next/router";
import CancelButton from "../../Button/cancelButton";
import axiosService from "../../Utils/axios";
import Button from "../../Button";
import SectionList from "./ModalSectionList";
import { useFormikContext } from "formik";

const SelectionModal = ({
  showModal,
  setShowModal,
  setTotalTestcases,
}: any) => {
  const router = useRouter();
  const formik = useFormikContext();

  const { setFieldValue } = formik;
  const [RowData, setRowData] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [selectedSectionIds, setSelectedSectionIds] = useState<any[]>([]);

  const { values }: any = formik;

  useEffect(() => {
    if (showModal) setSelectedSectionIds(values.sectionIds);
  }, [showModal]);

  useEffect(() => {
    if (router?.query?.pid) getTestcases();
  }, [router?.query?.pid]);

  const getTestcases = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/test-cases`
      );
      setRowData(response?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitSections = () => {
    setFieldValue("sectionIds", selectedSectionIds);
    const noOfTestcases = countAllTestcases();
    setTotalTestcases(noOfTestcases);
    setShowModal(false);
  };

  const addAllSections = () => {
    const newSectionIds: any[] = [];
    RowData.map((item: any) => {
      if (!selectedSectionIds.includes(item.id)) {
        newSectionIds.push(item.id);
      }
    });

    setSelectedSectionIds([...selectedSectionIds, ...newSectionIds]);
  };

  const countAllTestcases = () => {
    let count = 0;
    RowData.map((item: any) => {
      if (selectedSectionIds.includes(item.id)) {
        count += item.testcases.length;
      }
    });
    return count;
  };

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setShowModal(false)}
      >
        <div className="h-full min-h-screen px-4 text-center">
        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
            <div className="inline-block h-3/4 w-full max-w-screen-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
              <div className="h-full flex flex-col justify-between">
              <Dialog.Title
                as="div"
                className="text-lg font-medium leading-6 text-gray-500"
              >
                Select sections
              </Dialog.Title>
              <div className="h-4/5">
                <div className="h-full border border-gray-400 grid grid-cols-3 grid-row-2">
                  <div
                    className="h-full overflow-y-auto border-r-2 border-gray-400 bg-gray-200"
                    id="sectionList"
                  >
                    <div className="mb-2 px-4 py-1 text-sm text-gray-500 bg-gray-50 divide-x-2 font-medium divide-gray-400">
                      Select :&nbsp;
                      <span
                        onClick={addAllSections}
                        className="hover:underline cursor-pointer pr-2"
                      >
                        All
                      </span>
                      <span
                        onClick={() => setSelectedSectionIds([])}
                        className="hover:underline cursor-pointer pl-2"
                      >
                        None
                      </span>
                    </div>
                    <SectionList
                      RowData={RowData}
                      sectionData={sectionData}
                      setSectionData={setSectionData}
                      selectedSectionIds={selectedSectionIds}
                      setSelectedSectionIds={setSelectedSectionIds}
                    />
                  </div>
                  <div className="h-full overflow-y-auto col-span-2" id="table">
                    <SectionTable sectionData={sectionData} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end" id="buttons">
                <Button onClick={submitSections} className="ml-2 order-last">
                  OK
                </Button>
                <CancelButton onClick={() => setShowModal(false)}>
                  Cancel
                </CancelButton>
              </div>
            </div>
          </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SelectionModal;

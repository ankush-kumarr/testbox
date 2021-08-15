import React, { useEffect, useState } from "react";
import SectionPopUp from "./SectionPopUp";
import SectionListing from "./SectionListing";
import axiosService from "../Utils/axios";
import { useRouter } from "next/router";
import { showError, showSuccess } from "../../components/Toaster/ToasterFun";
import DeleteConfirmationModal from "../Common/DeleteModal";
import Button from "../Button";
const SectionMain = (props: any) => {
  const router = useRouter();
  const [popup, setPopUp] = useState(false);
  const [editValue, setEditValue] = useState({});
  const [sections, setSections] = useState([]);
  const showPopUp = () => {
    setEditValue({});
    setPopUp(true);
  };
  const hidePopUp = () => {
    setPopUp(false);
    setTimeout(() => {
      document.getElementById("show-pop-up")?.blur();
    }, 0);
  };
  const editSection = (values: {
    id: string;
    name: string;
    description: string;
  }) => {
    setPopUp(true);
    setEditValue({ ...values });
  };
  useEffect(() => {
    getSections();
  }, []);

  const getSections = async () => {
    try {
      const response = await axiosService.get(
        "/projects/" + router.query.pid + "/sections"
      );
      setSections(response.data.data.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Something went wrong");
      }
    }
  };

  const [showModal, toogleModal] = useState(false);
  const [modalMsg, setMsg] = useState(<></>);
  const [selectedId, setSelectedId] = useState("");

  const openDeleteModal = (value: any) => {
    const msg = (
      <>
        Are you sure want to delete the section{" "}
        <span className="font-semibold text-red-500">{`"${value?.name}"`}</span>
        ?
      </>
    );
    setMsg(msg);
    setSelectedId(value.id);
    toogleModal(true);
  };

  const deleteSection = async () => {
    toogleModal(false);
    try {
      const response = await axiosService.delete(
        `/projects/${router.query.pid}/sections/${selectedId}`,
        {}
      );
      if (response?.data?.success) {
        props.getTestCases();
        getSections();
        showSuccess(response.data.message);
      }
    } catch (err) {
      if (err?.response?.data) {
        showError(err.response.data.message);
      }
    } finally {
      // setShowLoader(false);
    }
  };

  return (
    <div className="h-full  lg:border-l lg:border-gray-200 lg:grid-cols-1 lg:gap-2">
      <div className="px-4">
        <div className="bg-white">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base leading-6 font-medium text-gray-900">
              Add New Section
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 font-medium italic">
              <p>Create a new section to group your test cases</p>
            </div>
            <div className="mt-5">
              <Button
                id="show-pop-up"
                type="button"
                className="order-0 inline-flex items-center px-4 py-2  sm:order-1"
                onClick={() => showPopUp()}>
                New Section
              </Button>
            </div>
          </div>
        </div>
        <SectionListing
          editPopUp={editSection}
          sections={sections}
          openDeleteModal={openDeleteModal}
        />
      </div>
      {popup && (
        <SectionPopUp
          popup={popup}
          hidePopUp={hidePopUp}
          editValue={editValue}
          getSection={() => getSections()}
        />
      )}
      {showModal && (
        <DeleteConfirmationModal
          msg={modalMsg}
          open={showModal}
          toogleModal={toogleModal}
          delete={deleteSection}
        />
      )}
    </div>
  );
};

export default SectionMain;

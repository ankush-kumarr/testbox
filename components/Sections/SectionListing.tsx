import React from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
interface Iprops {
  editPopUp: (section: any) => void;
  sections: any[];
  openDeleteModal: (section: any) => void;
}
const SectionListing = (props: Iprops) => {
  return (
    <div className="px-6">
      {props.sections.map((section, i) => (
        <div
          key={i}
          className={`pb-2 pt-2 ${
            i !== section.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          <span className="inline-block mr-2">{i + 1}.</span>
          <span className="inline-block mr-2 text-sm">{section.name}</span>
          {section.name !== "Unassigned" && (
            <span className="float-right">
              <PencilAltIcon
                onClick={() => props.editPopUp(section)}
                className="text-indigo-600 h-6 w-4 cursor-pointer mr-3 inline-block pb-1"
              />
              <TrashIcon
                onClick={() => props.openDeleteModal(section)}
                className="text-indigo-600 h-6 w-4 cursor-pointer mr-3 inline-block pb-1"
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionListing;

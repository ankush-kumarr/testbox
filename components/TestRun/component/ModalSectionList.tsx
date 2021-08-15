import { useEffect } from "react";
import { useState } from "react";

const ModalSectionList = ({
  RowData,
  setSectionData,
  selectedSectionIds,
  setSelectedSectionIds,
}: any) => {
  const [active, setActive] = useState("");

  const onSectionClicked = (item: any) => {
    setSectionData(item);
    setActive(item?.id);
  };

  useEffect(() => {
    const firstEle = RowData[0];
    setSectionData(firstEle);
    setActive(firstEle?.id);
  }, []);

  const handleCheck = (event: any, item: any) => {
    if (event.target.checked && !selectedSectionIds.includes(item?.id)) {
      //   console.log("Not found hence added in sectionIds");
      const newSectionIdsList = [...selectedSectionIds, item?.id];
      setSelectedSectionIds(newSectionIdsList);
    } else if (!event.target.checked && selectedSectionIds.includes(item?.id)) {
      //   console.log("Present in sectionIds");
      const newSectionIdsList = [...selectedSectionIds];
      const index = newSectionIdsList.indexOf(item?.id);
      if (index > -1) {
        newSectionIdsList.splice(index, 1);
      }
      setSelectedSectionIds(newSectionIdsList);
    }
  };

  return (
    <>
      {RowData.map((item: any, index: number) => {
        if (item.testcases?.length !== 0) {
          return (
            <div
              className="ml-4 flex flex-row whitespace-nowrap space-x-2 items-center"
              key={index}
            >
              <input
                className="h-4 w-4 text-indigo-600 focus:outline-none border-gray-300 rounded"
                type="checkbox"
                checked={selectedSectionIds.includes(item?.id)}
                onChange={(e) => handleCheck(e, item)}
              />
              <a
                className={`px-2 py-1 cursor-pointer text-sm rounded-md ${
                  active === item?.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-400"
                }`}
                onClick={() => onSectionClicked(item)}
              >
                {item?.name}
              </a>
            </div>
          );
        }
      })}
    </>
  );
};

export default ModalSectionList;

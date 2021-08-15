import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosService from "../Utils/axios";

interface MatchedData {
  milestones: [];
  testCases: [];
  testSuites: [];
  projects: [];
}

const SearchBox = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [matchedData, setMatchedData] = useState<MatchedData>({
    milestones: [],
    testCases: [],
    testSuites: [],
    projects: [],
  });

  const Section = ({ label, data, routeToPath }: any) => {
    return (
      <div className="mb-2">
        <em className="ml-2 font-semibold">{label}</em>
        <hr></hr>
        {data.map((item: any) => (
          <div
            onMouseDown={() => {
              setInputValue("");
              routeToPath(item);
            }}
            className="px-2 py-1 hover:bg-blue-500 hover:text-white text-sm cursor-pointer"
            key={item.id}>
            {item.name}
          </div>
        ))}
      </div>
    );
  };

  const TestcaseSection = ({ label, data, routeToPath }: any) => {
    return (
      <div className="mb-2">
        <em className="ml-2 font-semibold">{label}</em>
        <hr></hr>
        {data.map((item: any) => (
          <div
            onMouseDown={() => {
              setInputValue("");
              routeToPath(item);
            }}
            className="px-2 py-1 hover:bg-blue-500 hover:text-white text-sm cursor-pointer"
            key={item.id}>
            {item.title.length > 42
              ? `${item.title.substring(0, 42)}...`
              : item.title}
          </div>
        ))}
      </div>
    );
  };

  const goToProject = (item: any) => {
    router.push(`/projects/${item.id}/overview`);
  };
  const goToMilestone = (item: any) => {
    router.push(`/projects/${item.project.id}/milestone/${item.id}`);
  };
  const goToTestcase = (item: any) => {
    router.push(`/projects/${item.project.id}/testcase/${item.id}`);
  };
  const goToTestrun = (item: any) => {
    router.push(`/projects/${item.project.id}/testrun/${item.id}/test-results`);
  };

  const renderDropdown = () => {
    const { projects, milestones, testCases, testSuites } = matchedData;
    return (
      <>
        {/* 32 max - frontend */}
        {projects && (
          <Section label="Project" data={projects} routeToPath={goToProject} />
        )}
        {/* 32 max - frontend */}
        {milestones && (
          <Section
            label="Milestone"
            data={milestones}
            routeToPath={goToMilestone}
          />
        )}
        {/* 200 max - backend */}
        {testCases && (
          <TestcaseSection
            label="Testcase"
            data={testCases}
            routeToPath={goToTestcase}
          />
        )}
        {/* 32 max - frontend */}
        {testSuites && (
          <Section
            label="Testrun"
            data={testSuites}
            routeToPath={goToTestrun}
          />
        )}
      </>
    );
  };

  const inputOnChange = (e: any) => {
    setInputValue(e.target.value);
    if (e.target.value?.length > 1) setShowDropDown(true);
    else setShowDropDown(false);
  };

  const inputOnFocus = () => {
    if (inputValue.length > 1) setShowDropDown(true);
  };

  useEffect(() => {
    const GetData = async () => {
      if (inputValue.length > 1) {
        try {
          const response = await axiosService.get(
            `/organizations/search?query=${inputValue}`
          );
          // console.log("Response: ", response);
          setMatchedData(response?.data?.data);
        } catch (err) {
          // console.log(err?.response?.data?.message);
        }
      } else {
        return;
      }
    };

    GetData();
  }, [inputValue]);

  return (
    <>
      <input
        className="px-3 py-1 rounded-md text-sm font-medium w-72 relative"
        type="search"
        placeholder="Search..."
        value={inputValue}
        onChange={inputOnChange}
        onFocus={inputOnFocus}
        onBlur={() => setShowDropDown(false)}
      />

      {showDropDown && (
        <div className="absolute top-11 rounded-md shadow-md border border-gray-300 w-72 h-auto bg-white z-10">
          {Object.keys(matchedData).length === 0 ? (
            <div className="px-2 py-1 text-sm">No matches</div>
          ) : (
            renderDropdown()
          )}
        </div>
      )}
    </>
  );
};

export default SearchBox;

interface projectNameType {
  projectName: string;
}

export default function TestCaseProjectNameHeader({
  projectName,
}: projectNameType) {
  return (
    <div className=" text-xl font-medium">
      {projectName}
      {projectName && (
        <span className=" text-xs ml-1 text-gray-500">in Projects</span>
      )}{" "}
    </div>
  );
}

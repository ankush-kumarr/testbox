const ModalSectionTable = ({ sectionData }: any) => {
  return (
    <>
      <div className="text-md ml-4 my-2 font-semibold text-gray-600">
        {sectionData.name}
      </div>
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-2/12">
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-10/12">
              Title
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sectionData.testcases?.map((item: any, index: number) => (
            <tr key={index} className="bg-white hover:bg-indigo-100 rounded">
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 w-8 ">
                {item.testcaseId}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                {item.title}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ModalSectionTable;

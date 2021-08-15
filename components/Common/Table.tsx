interface Props {
  header: (string | number)[];
  RowData: (string | number)[][];
}

interface Text {
  text: string;
}

const ViewEditTH = ({ text }: Text) => (
  <th scope="col" className="relative px-6 py-3">
    <span className="sr-only">{text}</span>
  </th>
);

export default function ProjectList(data: Props) {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {data.header.map((val, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {val}
                        </th>
                      ))}
                      <ViewEditTH text={"View"} />
                      <ViewEditTH text={"Edit"} />
                    </tr>
                  </thead>
                  <tbody>
                    {data.RowData.map((value, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        {value.map((val, index) => (
                          <td
                            key={index}
                            className={`${"px-6 py-2 whitespace-nowrap text-sm text-gray-500"} ${
                              index === 0 &&
                              "text-gray-900 font-medium capitalize"
                            }`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

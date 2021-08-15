const TestViewCard = ({
    label,
    text,
}: {
    label: string;
    text: string | number;
}) => {

    return (
        <div className="  flex flex-col mr-2   ">
            <div className="flex rounded-md font-bold cursor-pointer text-gray-800 ">
                <h1 className="text-sm "> {label}</h1>
            </div>
            <div className=" text-sm font-normal ">
                <h1 >{text}</h1>
            </div>
        </div>
    );
};

export const ExpectedResultCard = ({
    label,
    text,
}: {
    label: string;
    text: string;
}) => {

    return (
        <div className="my-6 p-2  ">
            <div className="flex justify-start text-gray-800 font-bold">
                <h1 className="text-sm flex-shrink-0 ">{label}</h1>
                <div className=" ml-2 border-t border-gray-200 mt-3  w-full "></div>
            </div>
            <div className="p-3 text-sm font-normal break-words  ">
                {text?.split("\n")?.map((data, index) => {
                    return <h1
                        className=" p-1"
                        key={index}>{data}</h1>;
                })}
            </div>
        </div>
    );
};



export default TestViewCard;

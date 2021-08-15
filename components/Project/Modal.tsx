import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function Modal(props: any) {

    const cancelButtonRef = useRef(null)
    const [numberOfDays, setNumberOfDays] = useState(14);

    const handleChange = (e: any) => {
        setNumberOfDays(e.target.value);
    };

    const submitFilter = () => {
        props.setNumberOfDays(numberOfDays);
        props.toogleModal(false);
    };

    const daysSelectionOption = [
        { key: "7 Days", value: 7 },
        { key: "14 Days", value: 14 },
        { key: "30 Days", value: 30 },
        { key: "60 Days", value: 60 },
        { key: "90 Days", value: 90 },
    ];

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={props.open}
                onClose={props.toogleModal}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                        <div className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 ${props.open || "hidden"
                            }`}>

                            <div className="flex justify-between  items-center font-semibold text-gray-500  ">
                                <h1 className="underline">Select Time Frame</h1>


                            </div>
                            <div className=" py-2 flex flex-col space-y-2 text-sm ">
                                <div className="flex flex-col justify-start">
                                    <label className="block text-sm font-medium text-gray-600">
                                        Time Frame
                                    </label>
                                    <select
                                        onChange={handleChange}
                                        className="relative w-full text-gray-600  bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        defaultValue={props.defaultVal}
                                    >
                                        {daysSelectionOption.map((days: any) => {
                                            return (
                                                <option
                                                    key={days.value}
                                                    value={days.value}
                                                    className="text-sm rounded-xl text-gray-600"
                                                >
                                                    {days.key}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <h1 className="text-sm text-gray-600 ">
                                    Select a different time frame for the chart.
                                </h1>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() => submitFilter()}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <h1 className="ml-1">Confirm</h1>
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"

                                    onClick={() => props.toogleModal(false)}
                                    ref={cancelButtonRef}
                                >
                                    <h1 className="ml-1">Cancel</h1>

                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

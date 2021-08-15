/* This example requires Tailwind CSS v2.0+ */
export default function Example() {
    return (
        <section className="py-12 h-screen bg-gray-50 overflow-hidden md:py-20 lg:py-24">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <img
                        className="mx-auto h-8"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="logo"
                    />
                    <blockquote className="mt-10">
                        <div className="max-w-3xl mx-auto text-center text-2xl leading-9 font-medium text-gray-900">
                            <p>
                                Your response has been recorded.
                            </p>
                        </div>
                        <footer className="mt-8">
                            <div className="md:flex md:items-center md:justify-center">
                                <div className="md:flex-shrink-0">
                                </div>
                                <div className="mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center">
                                    <a href="/"
                                        className="text-base font-medium text-indigo-600 hover:text-indigo-700">Go back to Home Page</a>
                                </div>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </section >
    )
}


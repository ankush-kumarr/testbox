import Footer from "../Home/Footer"
import Header from "../Home/Header"

/* This example requires Tailwind CSS v2.0+ */
const stats = [
    { label: 'Founded', value: '2021' },
    { label: 'Employees', value: '5' },
    { label: 'Beta Users', value: '521' },
    { label: 'Raised', value: '$25M' },
]

export default function Example() {
    return (
        <div className="bg-white">
            <div className="relative overflow-hidden">
                <Header />
                <div className="relative bg-white py-16 sm:py-24">
                    <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
                        <div className="relative sm:py-16 lg:py-0">
                            <div aria-hidden="true" className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen">
                                <div className="absolute inset-y-0 right-1/2 w-full bg-gray-50 rounded-r-3xl lg:right-72" />
                                <svg
                                    className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                                    width={404}
                                    height={392}
                                    fill="none"
                                    viewBox="0 0 404 392"
                                >
                                    <defs>
                                        <pattern
                                            id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                                            x={0}
                                            y={0}
                                            width={20}
                                            height={20}
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                        </pattern>
                                    </defs>
                                    <rect width={404} height={392} fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)" />
                                </svg>
                            </div>
                            <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20">
                                {/* Testimonial card*/}
                                <div className="relative pt-64 pb-10 rounded-2xl shadow-xl overflow-hidden">
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover"
                                        src="/userDashboard.png"
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 via-indigo-600 opacity-70" />
                                    <div className="relative px-8">
                                        <div>
                                            <img
                                                className="h-12"
                                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                                alt="Test Box"
                                            />
                                        </div>
                                        <blockquote className="mt-8">


                                            <footer className="mt-4">
                                                <p className="text-base font-semibold text-indigo-200">Sarah Williams, CEO at TestBox</p>
                                            </footer>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
                            {/* Content area */}
                            <div className="pt-12 sm:pt-16 lg:pt-20">
                                <h2 className="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-4xl">
                                    On a mission to empower teams
                                </h2>
                                <div className="mt-6 text-gray-500 space-y-6">
                                    <p className="text-lg">
                                        Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum urna sed consectetur neque tristique
                                        pellentesque. Blandit amet, sed aenean erat arcu morbi. Cursus faucibus nunc nisl netus morbi vel
                                        porttitor vitae ut. Amet vitae fames senectus vitae.
                                    </p>
                                    <p className="text-base leading-7">
                                        Sollicitudin tristique eros erat odio sed vitae, consequat turpis elementum. Lorem nibh vel, eget
                                        pretium arcu vitae. Eros eu viverra donec ut volutpat donec laoreet quam urna. Sollicitudin tristique
                                        eros erat odio sed vitae, consequat turpis elementum. Lorem nibh vel, eget pretium arcu vitae. Eros eu
                                        viverra donec ut volutpat donec laoreet quam urna.
                                    </p>
                                    <p className="text-base leading-7">
                                        Rhoncus nisl, libero egestas diam fermentum dui. At quis tincidunt vel ultricies. Vulputate aliquet
                                        velit faucibus semper. Pellentesque in venenatis vestibulum consectetur nibh id. In id ut tempus
                                        egestas. Enim sit aliquam nec, a. Morbi enim fermentum lacus in. Viverra.
                                    </p>
                                </div>
                            </div>

                            {/* Stats section */}
                            <div className="mt-10">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="border-t-2 border-gray-100 pt-6">
                                            <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                                            <dd className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>


    )
}


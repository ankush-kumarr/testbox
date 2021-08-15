import { CheckIcon } from '@heroicons/react/outline'
import Header from "./Header"
import Footer from "./Footer"
import {
    CloudUploadIcon,
    CogIcon,
    LockClosedIcon,
    RefreshIcon,
    ServerIcon,
    ShieldCheckIcon,
} from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/solid'
const features = [
    {
        name: 'Centralized Test Management',
        description: 'Collaborate with stakeholders on test cases, plans, and runs.',
        icon: CloudUploadIcon,
    },
    {
        name: 'Easily Track Results',
        description: 'Execute your tests and track results that matter.',
        icon: LockClosedIcon,
    },
    {
        name: 'Powerful Reports and Metrics',
        description: 'Actionable reports, metrics, and real-time insights.',
        icon: RefreshIcon,
    },
    {
        name: 'Seamless Integration',
        description: 'Integrate with bug trackers, automated tests, and more.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Increased Productivity',
        description: 'Fast and easy to use for a productive, happy team.',
        icon: CogIcon,
    },
    {
        name: 'Scalable and Customizable',
        description: 'Cloud or download, highly customizable, and much more.',
        icon: ServerIcon,
    },
]
const blogPosts = [
    {
        id: 1,
        title: 'Boost your conversion rate',
        href: '#',
        date: 'Mar 16, 2020',
        datetime: '2020-03-16',
        category: { name: 'Article', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
        preview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',
        author: {
            name: 'Roel Aufderehar',
            imageUrl:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            href: '#',
        },
        readingLength: '6 min',
    },
    {
        id: 2,
        title: 'How to use search engine optimization to drive sales',
        href: '#',
        date: 'Mar 10, 2020',
        datetime: '2020-03-10',
        category: { name: 'Video', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
        preview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit facilis asperiores porro quaerat doloribus, eveniet dolore. Adipisci tempora aut inventore optio animi., tempore temporibus quo laudantium.',
        author: {
            name: 'Brenna Goyette',
            imageUrl:
                'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            href: '#',
        },
        readingLength: '4 min',
    },
    {
        id: 3,
        title: 'Improve your customer experience',
        href: '#',
        date: 'Feb 12, 2020',
        datetime: '2020-02-12',
        category: { name: 'Case Study', href: '#' },
        imageUrl:
            'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
        preview:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis perferendis hic.',
        author: {
            name: 'Daniela Metz',
            imageUrl:
                'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            href: '#',
        },
        readingLength: '11 min',
    },
]



export default function Example() {

    return (
        <div className="bg-white">
            <div className="relative overflow-hidden">
                <Header />

                <main>
                    <div className="pt-10 bg-gray-700 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
                        <div className="mx-auto max-w-7xl lg:px-8">
                            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                                    <div className="lg:py-24">

                                        <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                            <span className="block">TestBox: Comprehensive Test Case Management</span>

                                        </h1>
                                        <p className="text-base mt-1 text-gray-300 sm:text-2xl lg:text-2xl xl:text-2xl">
                                            for QA and Development Teams
                                        </p>
                                        <div className="mt-10 sm:mt-12">
                                            <form action="#" className="sm:max-w-xl sm:mx-auto lg:mx-0">
                                                <div className="sm:flex">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex">
                                                            <CheckIcon className="mt-4 mr-1 h-7 w-7 text-indigo-600" aria-hidden="true" />

                                                            <p className="mt-3 text-lg text-gray-300 sm:mt-4">

                                                                Efficiently manage test cases, plans and runs
                                                            </p>
                                                        </div>
                                                        <div className="flex">
                                                            <CheckIcon className="mt-4 mr-1 h-7 w-7 text-indigo-600" aria-hidden="true" />
                                                            <p className="mt-3 text-lg text-gray-300 sm:mt-4">
                                                                Boost testing productivity significantly
                                                            </p>
                                                        </div>

                                                        <div className="flex">
                                                            <CheckIcon className="mt-4 mr-1 h-7 w-7 text-indigo-600" aria-hidden="true" />
                                                            <p className="mt-3 text-lg text-gray-300 sm:mt-4">
                                                                Get real-time insights into your testing progress
                                                            </p>
                                                        </div>

                                                        <div className="flex">
                                                            <CheckIcon className="mt-4 mr-1 h-7 w-7 text-indigo-600" aria-hidden="true" />
                                                            <p className="mt-3 text-lg text-gray-300 sm:mt-4">
                                                                Integrate TestRail with your issue tracker
                                                            </p>
                                                        </div>

                                                        <div className="flex">
                                                            <CheckIcon className="mt-4 mr-1 h-7 w-7 text-indigo-600" aria-hidden="true" />
                                                            <p className="mt-3 text-lg text-gray-300 sm:mt-4">
                                                                Choose TestBox Enterprise for larger teams
                                                            </p>
                                                        </div>



                                                    </div>

                                                </div>
                                                <div className="mt-5 sm:mt-0 sm:ml-3">
                                                    <button
                                                        type="submit"
                                                        className="block w-1/4 py-3 px-4 mt-4 rounded-md shadow bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-indigo-900"
                                                    >
                                                        Get Started
                                                    </button>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="pb-6 mt-12 mb-16 sm:mb-48 lg:m-12 ">
                                    <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                        <img
                                            className="w-full  lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                            src="/userDashboard.png"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature section with screenshot */}
                    <div className="relative bg-gray-50 pt-16 sm:pt-24 lg:pt-32">
                        <div className="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
                            <div>
                                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                                    Comprehensive Test Case Management
                                </p>
                                <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                                    Increase productivity with a powerful and easy-to-use interface.
                                </p>
                            </div>
                            <div className="mt-12 mb-12 pb-8">
                                <img
                                    className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
                                    src="/userDashboard.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature section with grid */}
                    <div className="relative bg-white py-16 sm:py-24 lg:py-32">
                        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                                A complete web-based test case management solution to efficiently manage, track, and organize your software testing efforts.
                            </p>
                            <div className="mt-12">
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {features.map((feature) => (
                                        <div key={feature.name} className="pt-6">
                                            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                                <div className="-mt-6">
                                                    <div>
                                                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-md shadow-lg">
                                                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                                        </span>
                                                    </div>
                                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                                                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial section */}
                    {/* Blog section */}
                    <div className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
                        <div className="relative">
                            <div className="text-center mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                                <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">Learn</h2>
                                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                                    Helpful Resources
                                </p>
                                <p className="mt-5 mx-auto max-w-prose text-xl text-gray-500">
                                    Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc, ullamcorper
                                    malesuada. Eleifend condimentum id viverra nulla.
                                </p>
                            </div>
                            <div className="mt-12 mx-auto max-w-md px-4 grid gap-8 sm:max-w-lg sm:px-6 lg:px-8 lg:grid-cols-3 lg:max-w-7xl">
                                {blogPosts.map((post) => (
                                    <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                        <div className="flex-shrink-0">
                                            <img className="h-48 w-full object-cover" src={post.imageUrl} alt="" />
                                        </div>
                                        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-cyan-600">
                                                    <a href={post.category.href} className="hover:underline">
                                                        {post.category.name}
                                                    </a>
                                                </p>
                                                <a href={post.href} className="block mt-2">
                                                    <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                                                    <p className="mt-3 text-base text-gray-500">{post.preview}</p>
                                                </a>
                                            </div>
                                            <div className="mt-6 flex items-center">
                                                <div className="flex-shrink-0">
                                                    <a href={post.author.href}>
                                                        <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt={post.author.name} />
                                                    </a>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        <a href={post.author.href} className="hover:underline">
                                                            {post.author.name}
                                                        </a>
                                                    </p>
                                                    <div className="flex space-x-1 text-sm text-gray-500">
                                                        <time dateTime={post.datetime}>{post.date}</time>
                                                        <span aria-hidden="true">&middot;</span>
                                                        <span>{post.readingLength} read</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="relative bg-gray-700">
                        <div className="relative h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
                            <img
                                className="w-full h-full object-cover"
                                src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&sat=-100"
                                alt=""
                            />
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 mix-blend-multiply"
                            />
                        </div>
                        <div className="relative mx-auto max-w-md px-4 py-12 sm:max-w-7xl sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32">
                            <div className="md:ml-auto md:w-1/2 md:pl-10">
                                <h2 className="text-base font-semibold uppercase tracking-wider text-gray-300">
                                    Award winning support
                                </h2>
                                <p className="mt-2 text-white text-3xl font-extrabold tracking-tight sm:text-4xl">We’re here to help</p>
                                <p className="mt-3 text-lg text-gray-300">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam sed. Quam a
                                    scelerisque amet ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat quisque ut interdum
                                    tincidunt duis.
                                </p>
                                <div className="mt-8">
                                    <div className="inline-flex rounded-md shadow">
                                        <a
                                            href="#"
                                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent  text-base font-medium text-white rounded-md  hover:bg-indigo-700 bg-indigo-600"
                                        >
                                            Visit the help center
                                            <ExternalLinkIcon className="-mr-1 ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    )
}

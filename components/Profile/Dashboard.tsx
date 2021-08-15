import UpdateProfile from "./UpdateProfile";
import ChangePassword from "./ChangePassword";
import { useRouter } from "next/router";

// To render sideNav icons and relevant data dynamically
const TapNavData = [
  {
    text: "Profile",
    link: "/profile/update-profile",
    d:
      "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    text: "Password",
    link: "/profile/change-password",
    d:
      "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  },
];

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {TapNavData.map((val, i) => (
              <a
                key={i}
                onClick={() => router.push(val.link)}
                className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium cursor-pointer ${
                  router?.asPath === val.link
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-50"
                }`}
                aria-current="page"
              >
                <svg
                  className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={val.d}
                  />
                </svg>
                <span className="truncate">{val.text}</span>
              </a>
            ))}
          </nav>
        </aside>
        <div className="max-w-xl pb-12 px-4 lg:col-span-6">
          {router?.query?.subURL === "update-profile" && <UpdateProfile />}
          {router?.query?.subURL === "change-password" && <ChangePassword />}
        </div>
      </div>
    </div>
  );
}

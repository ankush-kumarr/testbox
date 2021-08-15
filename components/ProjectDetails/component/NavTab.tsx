import { useRouter } from "next/router";

interface NavTabProps {
  navData: {
    redirect: string;
    text: string;
  }[];
}

export default function NavTab({ navData }: NavTabProps) {
  const router = useRouter();

  return (
    <div className="sm:block">
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-8 sm:px-6 lg:px-8"
          aria-label="Tabs">
          {navData.map((val, i) => (
            <a
              key={i}
              className={`cursor-pointer  whitespace-nowrap py-4 border-b-2 font-medium text-sm px-1 ${
                router?.asPath === val?.redirect
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              aria-current="page"
              onClick={() => router.push(val.redirect)}>
              {val.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

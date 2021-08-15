import Link from "next/link";
import Button from "../Button";

export default function ProjectHeading() {
  return (
    <div className="md:flex md:items-center md:justify-between px-8 py-4">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold leading-7 text-gray-900 sm:text-xl">
          Projects
        </h2>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        <Link href="/createproject">
          <Button type="submit" className={``} id="project-heading-new-project">
            New Project
          </Button>
        </Link>
      </div>
    </div>
  );
}

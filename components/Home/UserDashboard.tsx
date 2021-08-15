// import ProjectHeading from "../Project/ProjectHeading";
import ProjectHeading from "../ProjectDetails/component/Header";
import ProjectListing from "../Project/ProjectListing";

export default function UserDashboard() {
  return (
    <>
      <ProjectHeading
        title={"Projects"}
        redirectToPage={{ url: "/createproject", text: " New Project" }}
      />
      <ProjectListing />
    </>
  );
}

import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FormikInput,
  FormikTextArea,
  FormikInputSearch,
} from "../Common/FormikInput";
import axiosService from "../Utils/axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { showError } from "../Toaster/ToasterFun";
import { FormSubmitPanel } from "../Common/FormSubmitPanel";
import Loader from "../Loader/Loader";
import TestcaseSelect from "./component/TestcaseSelect";

const AddTestRun = () => {
  const router = useRouter();
  const AddTestRunSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(32, "Name should be maximum 32 characters")
      .required("Name is required"),
    assignTo: Yup.string().required("Assign to is required"),
  });

  const initialValues = {
    name: "",
    description: "",
    assignTo: "",
    milestone: "",
    sectionIds: [],
  };

  const [showLoader, setShowLoader] = useState(true);
  const [apiloading, setApiLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const [options, setOptions] = useState([]);
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const [state, setState] = useState("includeAll");
  const [totalTestcases, setTotalTestcases] = useState(0);

  const returnToMainPage = () =>
    router.push(`/projects/${router.query.pid}/testruns`);

  useEffect(() => {
    getSelectOptions();
  }, []);

  useEffect(() => {
    if (router?.query?.pid) getMilestoneOptions();
  }, [router?.query?.pid]);

  const getSelectOptions = async () => {
    try {
      const response = await axiosService.get(`/organizations/members/all`);
      const memberData = response.data.data.members;
      const memberList = memberData.map((item: any) => {
        return { value: item.id, label: item.firstName + " " + item.lastName };
      });
      setOptions(memberList);
      setShowLoader(false);
    } catch (err) {
      setShowLoader(false);
      if (err.response && err.response.data) {
        showError(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
        }
      } else showError("Something went wrong");
    }
  };

  const getMilestoneOptions = async () => {
    try {
      const milestoneResponse = await axiosService.get(
        `projects/${router.query.pid}/open/milestones`
      );
      const milestoneData = milestoneResponse.data.data;
      const milestoneList = milestoneData.map((item: any) => {
        return { value: item.id, label: item.name };
      });

      setMilestoneOptions(milestoneList);
      setShowLoader(false);
    } catch (err) {
      setShowLoader(false);
      if (err.response && err.response.data) {
        showError(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
        }
      } else showError("Something went wrong");
    }
  };

  const submitFormAddTestRun = async (value: typeof initialValues) => {
    setApiLoading(true);
    try {
      let data = {};
      if (!value.description.trim() && !value?.milestone) {
        data = {
          testSuite: {
            name: value.name.trim(),
            assignTo: value.assignTo,
          },
        };
      } else if (!value?.description?.trim()) {
        data = {
          testSuite: {
            name: value.name.trim(),
            assignTo: value.assignTo,
            milestone: value.milestone,
          },
        };
      } else if (!value?.milestone) {
        data = {
          testSuite: {
            name: value.name.trim(),
            assignTo: value.assignTo,
            description: value.description.trim(),
          },
        };
      } else
        data = {
          testSuite: {
            name: value.name.trim(),
            description: value.description.trim(),
            assignTo: value.assignTo,
            milestone: value.milestone,
          },
        };

      let response;
      if (
        state === "includeSpecific" &&
        value.sectionIds &&
        totalTestcases > 0
      ) {
        const newData: any = { ...data };
        newData.testSuite.sectionIds = value.sectionIds;
        response = await axiosService.post(
          `/projects/${router.query.pid}/test-suites/filtered`,
          data
        );
      } else if (
        state === "includeSpecific" &&
        value.sectionIds &&
        totalTestcases === 0
      ) {
        showError("Please select atleast one test case.");
        setApiLoading(false);
        return;
      } else {
        response = await axiosService.post(
          `/projects/${router.query.pid}/test-suites/`,
          data
        );
      }

      // showSuccess(response.data.message);
      // console.log("response from add test run", response);

      // To redirect to test case execution page (test cases result and status page)
      router.push(
        `/projects/${router.query.pid}/testrun/${response.data.data.id}/test-results`
      );

      // To redirect to test run dashboard page
      // router.push(`/projects/${router.query.pid}/testruns`);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push("/");
        }
      } else showError("Something went wrong");
      setApiLoading(false);
    }
  };

  return showLoader ? (
    <Loader withoverlay={true} />
  ) : (
    <div className="flex items-center justify-center mt-12 sm:mx-4 md:mx-20 lg:mx-4  xl:mx-24 ">
      <div className="sm:w-2/3 w-2/3 md:w-2/3 lg:w-2/4 xl:w-1/3 ">
        <Formik
          initialValues={initialValues}
          validationSchema={AddTestRunSchema}
          onSubmit={submitFormAddTestRun}
          enableReinitialize>
          {() => {
            return (
              <Form className="space-y-6">
                <div>
                  <h1 className="text-lg leading-6 font-medium text-gray-900">
                    Create New Test Run
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Please fill in details of your new test run.
                  </p>
                </div>
                <div>
                  <FormikInput
                    type="text"
                    name="name"
                    label="Name"
                    validation={validation}
                  />
                </div>
                <div>
                  <FormikInputSearch
                    type="text"
                    label="Assign To"
                    name="assignTo"
                    optionsForSelect={options}
                    validation={validation}
                  />
                </div>
                <div>
                  <FormikInputSearch
                    type="text"
                    label="Milestone"
                    name="milestone"
                    optionsForSelect={milestoneOptions}
                  />
                </div>
                <div>
                  <FormikTextArea
                    type="text"
                    name="description"
                    label="Description"
                  // validation={validation}
                  />
                </div>
                <div>
                  <TestcaseSelect
                    state={state}
                    setState={setState}
                    totalTestcases={totalTestcases}
                    setTotalTestcases={setTotalTestcases}
                  />
                </div>
                <FormSubmitPanel
                  idForSubmit="add-test-run"
                  validateFunc={() => setValidation(true)}
                  onCancel={returnToMainPage}
                  loading={apiloading}
                  validSubmit={false}
                  submitTitle="Create"
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddTestRun;

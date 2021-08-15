import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FormikInput,
  FormikInputSearch,
  FormikTextArea,
} from "../Common/FormikInput";
import axiosService from "../Utils/axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { showError } from "../Toaster/ToasterFun";
import { FormSubmitPanel } from "../Common/FormSubmitPanel";
import Loader from "../Loader/Loader";

const EditTestRun = () => {
  const router = useRouter();
  const EditTestRunSchema = Yup.object().shape({
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
    nameOfAssignee: "",
    milestone: "",
    currentMilestone: "",
  };

  const [data, setData] = useState({ ...initialValues });

  // To show loader while data is being fetched from api
  const [showLoader, setShowLoader] = useState(true);
  const [apiloading, setApiLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [milestoneOptions, setMilestoneOptions] = useState([]);

  const returnToMainPage = () =>
    router.push(`/projects/${router.query.pid}/testruns`);

  const getSelectOptions = async () => {
    try {
      const response = await axiosService.get(`/organizations/members/all`);
      const memberData = response.data.data.members;
      const memberList = memberData.map((item: any) => {
        return { value: item.id, label: item.firstName + " " + item.lastName };
      });

      const milestoneResponse = await axiosService.get(
        `projects/${router.query.pid}/open/milestones`
      );
      const milestoneData = milestoneResponse.data.data;
      const milestoneList = milestoneData.map((item: any) => {
        return { value: item.id, label: item.name };
      });

      setMilestoneOptions(milestoneList);

      setOptions(memberList);
    } catch (error) {
      console.log(error);
    }
  };

  const getTestRunDetais = async () => {
    try {
      const response = await axiosService.get(
        `/projects/${router.query.pid}/test-suite-detail/${router.query.id}`
      );
      // console.log("response from getTestRunDetais", response);
      setData({
        name: response.data.data.name,
        description: response.data.data.description,
        assignTo: response.data.data.assignedTo.id,
        nameOfAssignee:
          response.data.data.assignedTo.firstName +
          " " +
          response.data.data.assignedTo.lastName,
        currentMilestone: response.data.data.milestoneId?.name,
        milestone: response.data.data.milestoneId?.id,
      });

      getSelectOptions();
      setShowLoader(false);
    } catch (err) {
      // console.log("error from getTestRunDetais", err);
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

  const submitFormEditTestRun = async (value: typeof initialValues) => {
    setApiLoading(true);
    try {
      let data = {};
      if (!value?.description?.trim() && !value?.milestone) {
        data = { name: value.name.trim(), assignTo: value.assignTo };
      } else if (!value?.description?.trim()) {
        data = {
          name: value.name.trim(),
          assignTo: value.assignTo,
          milestone: value.milestone,
        };
      } else if (!value?.milestone) {
        data = {
          name: value.name.trim(),
          assignTo: value.assignTo,
          description: value.description.trim(),
        };
      } else
        data = {
          name: value.name.trim(),
          description: value.description.trim(),
          assignTo: value.assignTo,
          milestone: value.milestone,
        };

      await axiosService.put(
        `/projects/${router.query.pid}/test-suite/${router.query.id}`,
        data
      );

      // console.log(data, " response from put ", response);
      // showSuccess(response.data.message);
      router.push(`/projects/${router.query.pid}/testruns`);
      setApiLoading(false);
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

  useEffect(() => {
    if (router?.query?.pid) {
      getTestRunDetais();
    }
  }, [router?.query]);

  return showLoader ? (
    <Loader withoverlay={true} />
  ) : (
    <>
      <div className="flex items-center justify-center mt-12 sm:mx-4 md:mx-20 lg:mx-4  xl:mx-16 ">
        <div className="sm:w-2/3 w-2/3 md:w-2/3 lg:w-2/4 xl:w-1/3 ">
          <Formik
            initialValues={data}
            validationSchema={EditTestRunSchema}
            onSubmit={submitFormEditTestRun}
            enableReinitialize>
            {(formik) => {
              const { dirty } = formik;
              return (
                <Form className="space-y-6">
                  <div>
                    <h1 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Test Run
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Please update the details of your test run.
                    </p>
                  </div>
                  <div>
                    <FormikInput type="text" name="name" label="Name" />
                  </div>
                  <div>
                    <FormikInputSearch
                      type="text"
                      label="Assign To"
                      name="assignTo"
                      optionsForSelect={options}
                      valueOfLabel={data.nameOfAssignee}
                    />
                  </div>
                  <div>
                    <FormikInputSearch
                      type="text"
                      label="Milestone"
                      name="milestone"
                      optionsForSelect={milestoneOptions}
                      valueOfLabel={data.currentMilestone}
                    />
                  </div>
                  <div>
                    <FormikTextArea
                      type="text"
                      name="description"
                      label="Description"
                    />
                  </div>
                  <FormSubmitPanel
                    idForSubmit="edit-test-run"
                    onCancel={returnToMainPage}
                    loading={apiloading}
                    validSubmit={router?.query?.id && !dirty ? true : false}
                    submitTitle="Update"
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditTestRun;

import * as yup from "yup";

const passwordRegExp = /^[^ ]*$/;
const onlyNumber = /^[\d ]*$/;
const phoneNumber = /^[1-9][0-9]*$/;
const hasEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const hasWeb = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{1,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{1,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{1,}|www\.[a-zA-Z0-9]+\.[^\s]{1,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const hasNumber = /(\(\d{3}\))?[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}/gim;
const nameRegExp = /^(?=)[a-zA-Z æøåÆØÅ]+(?:[-' ][a-zA-Z æøåÆØÅ]+)*$/;
// const phoneNumberRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const phoneNumberRegExp = /^([+]\d{2})?\d{8}$/;

const hasOrganization = /^([a-zA-Z0-9 _-]+)$/;

export const validateRequiredEmail = () =>
  yup.string().trim().email("Email is not valid").required("Email is required").matches(hasEmail, 'Email is not valid');


export const validateRequiredOrg = () =>
  yup.string()
  .trim()
  .matches(hasOrganization, "Organization name is not valid")
  .required("Organization is required");

export const validateRequiredPhone = () =>
  yup
    .string()
    .required("validation.phone.required")
    .nullable()
    .matches(phoneNumber, "validation.phone.invalid")
    .matches(phoneNumberRegExp, "validation.phone.invalid");
// .max(10, 'validation.phone.max.digit');
// .min(10, 'validation.phone.min.digit');

export const validateRequiredPassword = () =>
  yup
    .string()
    .matches(passwordRegExp, "validation.password.invalid.space")
    .required("Password is required")
    .min(8, "Password is too short - should be 8 chars minimum");

export const validateRequirementRequired = () =>
  yup
    .string()
    .matches(hasEmail, "validation.password.invalid.space")
    .matches(hasNumber, "validation.password.invalid.space")
    .matches(hasWeb, "validation.password.invalid.space")
    .min(8, "validation.password.min")
    .required("validation.password.required");

export const validateRequiredConfirmPassword = () =>
  yup
    .string()
    .matches(passwordRegExp, "validation.password.invalid.space")
    .min(8, "validation.password.min")
    .required("validation.password.required");

export const validateRequiredFirstName = () =>
  yup
    .string()
    .trim()
    .matches(nameRegExp, "First Name is not valid")
    .required("First Name is required")
    .max(32, "First Name must be between 1 to 32 characters.");
    


export const validateRequiredLastName = () =>
  yup
    .string()
    .matches(nameRegExp, "Last Name is not valid")
    .required("Last Name is required")
    .min(3, "Last Name should be minimum 3 characters");

export const validateRequiredDOB = () =>
  yup.string().required("validation.dob.required").nullable();

export const validateRequired = () =>
  yup.string().required("validation.required").nullable();

export const validateRequiredCity = () =>
  yup
    .string()
    .matches(nameRegExp, "validation.city.invalid")
    .required("validation.city.required")
    .nullable();

export const validateRequiredPostalCode = () =>
  yup
    .string()
    .required("validation.postalcode.required")
    .matches(onlyNumber, "validation.postalcode.number")

    .max(4, "validation.postalcode.max.digit")
    .min(4, "validation.postalcode.min.digit");

export const validateRequiredAddress = () =>
  yup.string().nullable().required("validation.address.required");

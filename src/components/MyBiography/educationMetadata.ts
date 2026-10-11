import type { EducationItem } from "../../types/biography";
import type { FieldConfig } from "../../types/forms";
import intl from "../../locales/en.json";

export const educationFields: FieldConfig<EducationItem>[] = [
  {
    name: "field",
    label: intl.fieldOfStudy,
    placeholder: intl.fieldOfStudyExample,
    rules: { required: intl.fieldOfStudyRequired },
  },
  {
    name: "degree",
    label: intl.degree,
    placeholder: intl.degreeExample,
    rules: { required: intl.degreeRequired },
  },
  {
    name: "institution",
    label: intl.institution,
    placeholder: intl.institutionExample,
    rules: { required: intl.institutionRequired },
  },
  {
    name: "country",
    label: intl.country,
    placeholder: intl.countryExample,
    rules: { required: intl.countryRequired },
  },
  {
    name: "year",
    label: intl.educationYear,
    placeholder: intl.educationYearExample,
    rules: { required: intl.educationYearRequired },
  },
];

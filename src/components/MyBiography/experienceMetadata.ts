import type { ExperienceItem } from "../../types/biography";
import type { FieldConfig } from "../../types/forms";
import intl from "../../locales/en.json";

export const experienceFields: FieldConfig<ExperienceItem>[] = [
  {
    name: "position",
    label: intl.position,
    placeholder: intl.positionExample,
    rules: { required: intl.positionRequired },
  },
  {
    name: "institution",
    label: intl.institutionOrPlace,
    placeholder: intl.institutionOrPlaceExample,
    rules: { required: intl.institutionRequired },
  },
  {
    name: "country",
    label: intl.country,
    placeholder: intl.countryExample,
    rules: { required: intl.countryRequired },
  },
  {
    name: "dates",
    label: intl.periodOfTime,
    placeholder: intl.periodOfTimeExample,
    rules: { required: intl.periodOfTimeRequired },
  },
];

import type { EducationItem } from "../../types/biography";
import type { FieldConfig } from "../../types/forms";

export const educationFields: FieldConfig<EducationItem>[] = [
  {
    name: "field",
    label: "Field of study",
    placeholder: "e.g. visual arts, history of art, etc.",
    rules: { required: "Field of study is required" },
  },
  {
    name: "degree",
    label: "Degree",
    placeholder: "e.g. bachelors, certificate, course, etc.",

    rules: { required: "Degree is required" },
  },
  {
    name: "institution",
    label: "Institution",
    placeholder: "Institution",
    rules: { required: "Institution is required" },
  },
  {
    name: "country",
    label: "Country",
    placeholder: "City, Country: ",
    rules: { required: "Country is required" },
  },
  {
    name: "year",
    label: "Completion Year (or expected)",
    placeholder: "Year/Period e.g. 1970, January - February 2014",
    rules: {
      required: "Completion year is required",
    },
  },
];

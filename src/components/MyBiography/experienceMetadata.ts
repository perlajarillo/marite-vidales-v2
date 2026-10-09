import type { ExperienceItem } from "../../types/biography";
import type { FieldConfig } from "../../types/forms";

export const experienceFields: FieldConfig<ExperienceItem>[] = [
  {
    name: "position",
    label: "Position/Rol",
    placeholder: "e.g. art teacher, juror, exposition guide.",
    rules: { required: "Position/Rol is required" },
  },
  {
    name: "institution",
    label: "Institution/Place",
    placeholder: "name of the event, museum, etc.",

    rules: { required: "Institution is required" },
  },
  {
    name: "country",
    label: "Country",
    placeholder: "City, Country: ",
    rules: { required: "Country is required" },
  },
  {
    name: "dates",
    label: "Period of time (start-end)",
    placeholder: "Year/Period e.g. 1970, January - February 2014",
    rules: {
      required: "Period of time is required",
    },
  },
];

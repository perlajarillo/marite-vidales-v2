import intl from "../../locales/en.json";
import type { Exhibit } from "../../types/exhibits";
import type { FieldConfig } from "../../types/forms";

export const exhibitFields: FieldConfig<Exhibit>[] = [
  {
    name: "dates",
    label: intl.exhibitDates,
    placeholder: intl.exhibitDatesExample,
    rules: { required: intl.exhibitDatesRequired },
  },
  {
    name: "name",
    label: intl.exhibitName,
    placeholder: intl.exhibitNameExample,
    rules: { required: intl.exhibitNameRequired },
  },
  {
    name: "place",
    label: intl.exhibitPlace,
    placeholder: intl.exhibitPlaceExample,
    rules: { required: intl.exhibitPlaceRequired },
  },
  {
    name: "year",
    label: intl.exhibitYear,
    placeholder: intl.exhibitYearExample,
    rules: { required: intl.exhibitYearRequired },
  },
];

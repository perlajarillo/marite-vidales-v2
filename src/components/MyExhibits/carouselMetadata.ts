import intl from "../../locales/en.json";
import type { ExhibitPicture } from "../../types/exhibits";
import type { FieldConfig } from "../../types/forms";

export const carouselFields: FieldConfig<ExhibitPicture>[] = [
  {
    name: "url",
    label: "",
    placeholder: "intl.exhibitImageURLExample",
    type: "url",
  },
  {
    name: "caption",
    label: intl.exhibitCaption,
    placeholder: intl.exhibitCaptionExample,
    rules: { required: intl.exhibitCaptionRequired },
    type: "textarea",
  },

  {
    name: "order",
    label: "",
    placeholder: "",
    type: "hidden",
  },
];

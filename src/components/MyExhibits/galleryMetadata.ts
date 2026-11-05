import type { Gallery } from "../../types/exhibits";
import type { FieldConfig } from "../../types/forms";
import intl from "../../locales/en.json";

export const galleryFields: FieldConfig<Gallery>[] = [
  {
    name: "address",
    label: intl.address,
    placeholder: intl.addressExample,
    rules: { required: intl.addressRequired },
  },
  {
    name: "gallery",
    label: intl.gallery,
    placeholder: intl.galleryExample,
    rules: { required: intl.galleryRequired },
  },
];

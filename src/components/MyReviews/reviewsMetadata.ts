import type { Review } from "../../types/reviews";
import type { FieldConfig } from "../../types/forms";
import intl from "../../locales/en.json";

export const reviewsFields: FieldConfig<Review>[] = [
  {
    name: "author",
    label: intl.author,
    placeholder: intl.authorExample,
    rules: { required: intl.authorRequired },
  },
  {
    name: "quote",
    label: intl.quote,
    placeholder: intl.quoteExample,
    rules: { required: intl.quoteRequired },
    type: "textarea",
  },
  {
    name: "role",
    label: intl.role,
    placeholder: intl.roleExample,
    rules: { required: intl.roleRequired },
  },
];

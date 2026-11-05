import intl from "../../locales/en.json";
import type { GrantAward } from "../../types/exhibits";
import type { FieldConfig } from "../../types/forms";

export const grantsAndAwardsFields: FieldConfig<GrantAward>[] = [
  {
    name: "grantAward",
    label: intl.grantAward,
    placeholder: intl.grantAwardExample,
    rules: { required: intl.grantAwardRequired },
  },
];

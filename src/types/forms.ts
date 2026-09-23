import {
  type Path,
  type RegisterOptions,
  type FieldValues,
} from "react-hook-form";

export type FieldType = "text" | "number" | "email" | "textarea" | "select";

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: { label: string; value: string | number }[]; // For select inputs
  rules?: RegisterOptions<T, Path<T>>;
}

export interface DynamicFormModalProps<T extends FieldValues> {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  defaultValues?: Partial<T>;
  fields: FieldConfig<T>[];
  onSave: (data: T) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

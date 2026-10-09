import { useEffect } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { type DynamicFormModalProps } from "../../../types/forms";
import styles from "./Modal.module.css";
import intl from "../../../locales/en.json";

export default function FormDialog<T extends FieldValues>({
  isOpen,
  title,
  subtitle,
  defaultValues,
  fields,
  onSave,
  onCancel,
  submitLabel = "SAVE",
  cancelLabel = "CANCEL",
}: DynamicFormModalProps<T>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    defaultValues: defaultValues as any,
    mode: "onChange",
  });

  // Reset form when modal opens/closes or initial values change
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues as any);
    }
  }, [isOpen, defaultValues, reset]);

  if (!isOpen) return null;

  return (
    <div className={styles.formDialog}>
      <div className={styles.formDialogContainer}>
        {/* Header */}
        <h2 className={styles.dialogTitle}>{title}</h2>
        {subtitle && <p className={styles.formDialogSubtitle}>{subtitle}</p>}

        <form onSubmit={handleSubmit(onSave)} className="space-y-5">
          <div className={styles.formDialogFieldsContainer}>
            {fields.map((field) => {
              const errorMessage = errors[field.name]?.message as
                | string
                | undefined;

              return (
                <div
                  key={String(field.name)}
                  className={styles.formDialogFieldsColumn}
                >
                  <label className={styles.formDialogFieldLabel}>
                    {field.label}
                    {field.rules?.required && " *"}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      {...register(field.name, field.rules)}
                      placeholder={field.placeholder}
                      className={styles.formDialogInput}
                      rows={3}
                    />
                  ) : field.type === "select" ? (
                    <select
                      {...register(field.name, field.rules)}
                      className={styles.formDialogSelect}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      {...register(field.name, field.rules)}
                      placeholder={field.placeholder}
                      className={styles.formDialogInput}
                    />
                  )}

                  {errorMessage && (
                    <span className={styles.formDialogFieldError}>
                      {errorMessage}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className={styles.formDialogActionBar}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.dialogSecondaryButton}
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.dialogPrimaryButton}
            >
              {isSubmitting ? intl.saving : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

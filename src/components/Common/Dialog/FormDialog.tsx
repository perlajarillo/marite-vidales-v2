import { useEffect } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { type DynamicFormModalProps } from "../../../types/forms";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl border border-gray-200">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 mb-6">{subtitle}</p>
        )}

        <form onSubmit={handleSubmit(onSave)} className="space-y-5">
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            {fields.map((field) => {
              const errorMessage = errors[field.name]?.message as
                | string
                | undefined;

              return (
                <div key={String(field.name)} className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">
                    {field.label}
                    {field.rules?.required && " *"}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      {...register(field.name, field.rules)}
                      placeholder={field.placeholder}
                      className="w-full border-b border-gray-300 py-1 text-sm focus:border-black focus:outline-none transition-colors"
                      rows={3}
                    />
                  ) : field.type === "select" ? (
                    <select
                      {...register(field.name, field.rules)}
                      className="w-full border-b border-gray-300 py-1 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
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
                      className="w-full border-b border-gray-300 py-1 text-sm focus:border-black focus:outline-none transition-colors"
                    />
                  )}

                  {errorMessage && (
                    <span className="mt-1 text-xs text-red-500">
                      {errorMessage}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "SAVING..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

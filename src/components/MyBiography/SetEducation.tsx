import { useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import useBiography from "../../hooks/useBiography";
import ConfirmDialog from "../Common/Dialog/ConfirmDialog";
import intl from "../../locales/en.json";
import { useFieldArray, useForm } from "react-hook-form";
import {
  createEducationItem,
  saveBiographyEducation,
} from "../../services/biography";
import { toRecord } from "../../utilities/records";
import { type EducationForm, type EducationItem } from "../../types/biography";
import FormDialog from "../Common/Dialog/FormDialog";
import { educationFields } from "./educationMetadata";

const emptyForm: EducationForm = {
  field: "",
  degree: "",
  institution: "",
  country: "",
  year: "",
  id: "",
  index: 0,
  recordKey: "",
};

const SetEducation = () => {
  const { user } = useAuth();
  // Server/hook data
  const { education: savedEducation, loading, fetchData } = useBiography();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: { education: [emptyForm] },
    mode: "onSubmit",
  });

  const { fields, remove, swap, insert } = useFieldArray({
    control,
    name: "education",
  });
  //console.log(JSON.stringify(fields));
  // console.log(isDirty);

  useEffect(() => {
    // 1. Transform Record<string, EducationItem> -> FormEducationItem[]
    const defaultValuesArray = Object.entries(savedEducation)
      .map(([key, value]) => ({
        recordKey: key, // preserve the original dictionary key
        ...value,
      }))
      .sort((a, b) => a.index - b.index);
    reset({ education: defaultValuesArray });
  }, [savedEducation]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingKey(null);
    setError("");
  };

  const openAddForm = () => {
    setEditingKey(null);
    // setForm(emptyForm);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (key: string) => {
    const item = savedEducation[key];
    if (!item) return;
    setEditingKey(key);
    setError("");
    setIsFormOpen(true);
  };

  const addEducation = async (data: EducationItem) => {
    try {
      createEducationItem(data);
      setMessage("Education added.");
      closeForm();
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteKey) return;
    try {
      // await remove(ref(db, `biography/education/${deleteKey}`));
      setDeleteKey(null);
      setMessage("Education deleted.");
    } catch {
      setMessage("Something went wrong. Try again.");
    }
  };

  const handleSaveOrder = async () => {
    try {
      const updatedEducationList = fields.map((field, i) => {
        return { ...field, index: i };
      });

      console.log(updatedEducationList);
      const updatedEducation = toRecord(updatedEducationList, "recordKey");
      console.log(updatedEducation);

      saveBiographyEducation(updatedEducation);
      setIsOrderDialogOpen(false);
      fetchData();
      setMessage("Education order updated.");
    } catch {
      setMessage("Something went wrong. Try again.");
    }
  };

  if (!user || loading) return null;

  return (
    <section className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-brand-primary">
          {intl.education}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openAddForm}
            className="rounded bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-secondary cursor-pointer"
          >
            {intl.addEducation}
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => setIsOrderDialogOpen(true)}
              className="rounded border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-slate-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-0 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
              disabled={!isDirty}
            >
              {intl.changeOrder}
            </button>
          )}
        </div>
      </div>
      {message && (
        <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </p>
      )}
      {fields.length === 0 ? (
        <p className="text-sm text-slate-600">{intl.noEducationAdded}</p>
      ) : (
        <div className="divide-y divide-slate-200">
          {fields.map((field, index) => {
            //  const item = savedEducation[key];
            // if (!item) return null;
            return (
              <article
                key={field.recordKey}
                className="flex flex-wrap items-center gap-4 py-4"
              >
                <input
                  type="hidden"
                  {...register(`education.${index}.recordKey`)}
                />
                <input
                  type="hidden"
                  {...register(`education.${index}.field`)}
                />
                <input
                  type="hidden"
                  {...register(`education.${index}.degree`)}
                />
                <input
                  type="hidden"
                  {...register(`education.${index}.institution`)}
                />
                <input
                  type="hidden"
                  {...register(`education.${index}.country`)}
                />
                <input type="hidden" {...register(`education.${index}.year`)} />
                <p className="min-w-0 flex-1 text-sm leading-6 text-slate-700">
                  <span className="font-semibold">{index + 1}. </span>
                  {field.field}. {field.degree}. {field.institution}.{" "}
                  {field.country}. {field.year}
                </p>
                {/* Swap Actions */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => swap(index, index - 1)}
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => swap(index, index + 1)}
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => openEditForm(field.recordKey)}
                  className="rounded border border-brand-primary px-3 py-2 text-sm text-brand-primary hover:bg-slate-50 cursor-pointer"
                >
                  {intl.edit}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteKey(field.recordKey)}
                  className="rounded bg-red-700 px-3 py-2 text-sm text-white hover:bg-red-800 cursor-pointer"
                >
                  {intl.delete}
                </button>
              </article>
            );
          })}
        </div>
      )}
      <FormDialog<EducationItem>
        isOpen={isFormOpen}
        title={intl.addEducation}
        subtitle={intl.allFieldsRequired}
        defaultValues={emptyForm}
        fields={educationFields}
        onSave={addEducation}
        onCancel={() => setIsFormOpen(false)}
      />

      {(deleteKey || isOrderDialogOpen) && (
        <ConfirmDialog
          dialogTitle={
            deleteKey ? "Delete education entry?" : "Change education order?"
          }
          dialogBody={
            deleteKey
              ? "This action cannot be undone."
              : "Are you sure you want to change the entries order?"
          }
          confirmAction={deleteKey ? handleDelete : handleSaveOrder}
          cancelAction={() => {
            setDeleteKey(null);
            setIsOrderDialogOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default SetEducation;

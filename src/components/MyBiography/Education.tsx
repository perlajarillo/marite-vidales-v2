import { useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import useBiography from "../../hooks/useBiography";
import ConfirmDialog from "../Common/Dialog/ConfirmDialog";
import intl from "../../locales/en.json";
import { useFieldArray, useForm } from "react-hook-form";
import {
  createEducationItem,
  saveBiographyEducation,
  updateEducationItem,
} from "../../services/biography";
import { toRecord } from "../../utilities/records";
import { type EducationForm, type EducationItem } from "../../types/biography";
import FormDialog from "../Common/Dialog/FormDialog";
import { educationFields } from "./educationMetadata";
import styles from "./MyBiography.module.css";

const emptyEducationItem: EducationItem = {
  field: "",
  degree: "",
  institution: "",
  country: "",
  year: "",
  id: "",
  index: 0,
};
const emptyForm: EducationForm = {
  ...emptyEducationItem,
  recordKey: "",
};

const Education = () => {
  const { user } = useAuth();
  // Server/hook data
  const { education: savedEducation, loading, fetchData } = useBiography();
  // State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [indexToRemove, setIndexToRemove] = useState<number>();
  const [saveAfterRemoving, setSaveAfterRemoving] = useState<boolean>(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingRecord, setEditingRecord] = useState<EducationItem | null>(
    null,
  );
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const {
    register,
    control,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: { education: [emptyForm] },
    mode: "onChange",
  });

  const { fields, remove, swap } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    const defaultValuesArray = Object.entries(savedEducation)
      .map(([key, value]) => ({
        ...value,
        recordKey: key, // preserve the original dictionary key
      }))
      .sort((a, b) => a.index - b.index);
    reset({ education: defaultValuesArray });
  }, [savedEducation]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
    setError("");
    setActiveKey(null);
  };

  const openAddForm = () => {
    setEditingRecord(null);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (record: EducationItem, recordKey: string) => {
    if (!record) return;
    setEditingRecord(record);
    setActiveKey(recordKey);
    setError("");
    setIsFormOpen(true);
  };

  const addEducation = async (data: EducationItem) => {
    if (isDirty) {
      handleSaveOrder();
    }
    try {
      createEducationItem({ ...data, index: fields.length });
      fetchData();
      setMessage(intl.educationAdded);
      closeForm();
    } catch {
      setError(intl.somethingWentWrong);
    }
  };

  const editEducation = async (data: EducationItem) => {
    try {
      if (activeKey) {
        console.log(activeKey);
        console.log(data);
        updateEducationItem(activeKey, data);
        fetchData();
        closeForm();
      }
      setMessage(intl.educationUpdated);
    } catch {
      setError(intl.somethingWentWrong);
    }
  };

  const handleDelete = async () => {
    if (indexToRemove === undefined) return;
    try {
      remove(indexToRemove);
      setIsDeleting(false);
      setSaveAfterRemoving(true);
    } catch {
      setMessage(intl.somethingWentWrong);
    }
  };

  const onCancel = () => {
    setIsDeleting(false);
    setActiveKey(null);
    setIndexToRemove(undefined);
    setIsOrderDialogOpen(false);
  };

  useEffect(() => {
    if (saveAfterRemoving) {
      handleSaveOrder();
      setIndexToRemove(undefined);
      setMessage(intl.educationDeleted);
      setSaveAfterRemoving(false);
    }
  }, [saveAfterRemoving, fields]);

  const handleSaveOrder = async () => {
    try {
      const updatedEducationList = fields.map((field, i) => {
        return { ...field, index: i };
      });

      const updatedEducation = toRecord(updatedEducationList, "recordKey");
      saveBiographyEducation(updatedEducation);
      setIsOrderDialogOpen(false);
      fetchData();
      setMessage(intl.educationOrderUpdated);
    } catch {
      setMessage(intl.somethingWentWrong);
    }
  };

  const onDelete = (index: number) => {
    setIsDeleting(true);
    setIndexToRemove(index);
  };

  const moveUp = (index: number, recordedIndex: number) => {
    if (index > 0) {
      setHighlightedId(recordedIndex);
      swap(index, index - 1);
    }
  };

  const moveDown = (index: number, recordedIndex: number) => {
    if (index < fields.length - 1) {
      setHighlightedId(recordedIndex);
      swap(index, index + 1);
    }
  };

  if (!user || loading) return null;

  return (
    <section className={styles.biographySection}>
      <div className={styles.biographySectionHeader}>
        <h2 className={styles.biographySectionTitle}>{intl.education}</h2>
        <div className={styles.biographySectionHeaderActionBar}>
          <button
            type="button"
            onClick={openAddForm}
            className={styles.primaryButton}
          >
            {intl.addEducation}
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => setIsOrderDialogOpen(true)}
              className={styles.secondaryButton}
              disabled={!isDirty}
            >
              {intl.changeOrder}
            </button>
          )}
        </div>
      </div>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <span className={styles.errorMessage}>{error}</span>}
      {fields.length === 0 ? (
        <p className={styles.missingInformationMessage}>
          {intl.noEducationAdded}
        </p>
      ) : (
        <div className="divide-y divide-slate-200">
          {fields.map((field, index) => {
            return (
              <article
                key={field.recordKey}
                className={`${styles.row} ${index !== field.index && highlightedId === field.index ? styles.highlightedRow : ""}`}
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
                <p className={styles.listItem}>
                  <span className="font-semibold">{index + 1}. </span>
                  {field.field}. {field.degree}. {field.institution}.{" "}
                  {field.country}. {field.year}
                </p>
                {/* Swap Actions */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveUp(index, field.index)}
                  className="cursor-pointer"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => moveDown(index, field.index)}
                  className="cursor-pointer"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const { recordKey, ...rest } = field;
                    openEditForm(rest, recordKey);
                  }}
                  className={styles.editButton}
                >
                  {intl.edit}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  className={styles.deleteButton}
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
        defaultValues={editingRecord || emptyEducationItem}
        fields={educationFields}
        onSave={activeKey != null ? editEducation : addEducation}
        onCancel={() => setIsFormOpen(false)}
      />

      {(isDeleting || isOrderDialogOpen) && (
        <ConfirmDialog
          dialogTitle={
            isDeleting ? intl.deleteEducationEntry : intl.changeEducationOrder
          }
          dialogBody={
            isDeleting
              ? intl.actionCanNotBeUndone
              : intl.areYouSureToUpdateOrder
          }
          confirmAction={isDeleting ? handleDelete : handleSaveOrder}
          cancelAction={onCancel}
        />
      )}
    </section>
  );
};

export default Education;

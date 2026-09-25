import { useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import useBiography from "../../hooks/useBiography";
import ConfirmDialog from "../Common/Dialog/ConfirmDialog";
import intl from "../../locales/en.json";
import { useFieldArray, useForm } from "react-hook-form";
import {
  createExperienceItem,
  saveBiographyExperience,
  updateExperienceItem,
} from "../../services/biography";
import { toRecord } from "../../utilities/records";
import {
  type ExperienceForm,
  type ExperienceItem,
} from "../../types/biography";
import FormDialog from "../Common/Dialog/FormDialog";
import { experienceFields } from "./experienceMetadata";
import styles from "./MyBiography.module.css";

const emptyExperienceItem: ExperienceItem = {
  position: "",
  institution: "",
  country: "",
  dates: "",
  index: 0,
};
const emptyForm: ExperienceForm = {
  ...emptyExperienceItem,
  recordKey: "",
};

const ProfessionalExperience = () => {
  const { user } = useAuth();
  // Server/hook data
  const { experience: savedExperience, loading, fetchData } = useBiography();
  // State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [indexToRemove, setIndexToRemove] = useState<number>();
  const [saveAfterRemoving, setSaveAfterRemoving] = useState<boolean>(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingRecord, setEditingRecord] = useState<ExperienceItem | null>(
    null,
  );

  const {
    register,
    control,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: { experience: [emptyForm] },
    mode: "onChange",
  });

  const { fields, remove, swap } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    const defaultValuesArray = Object.entries(savedExperience)
      .map(([key, value]) => ({
        ...value,
        recordKey: key, // preserve the original dictionary key
      }))
      .sort((a, b) => a.index - b.index);
    reset({ experience: defaultValuesArray });
  }, [savedExperience]);

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

  const openEditForm = (record: ExperienceItem, recordKey: string) => {
    if (!record) return;
    setEditingRecord(record);
    setActiveKey(recordKey);
    setError("");
    setIsFormOpen(true);
  };

  const addExperience = async (data: ExperienceItem) => {
    if (isDirty) {
      handleSaveOrder();
    }
    try {
      createExperienceItem({ ...data, index: fields.length });
      fetchData();
      setMessage(intl.experienceAdded);
      closeForm();
    } catch {
      setError(intl.somethingWentWrong);
    }
  };

  const editExperience = async (data: ExperienceItem) => {
    try {
      if (activeKey) {
        console.log(activeKey);
        console.log(data);
        updateExperienceItem(activeKey, data);
        fetchData();
        closeForm();
      }
      setMessage(intl.experienceUpdated);
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

  useEffect(() => {
    if (saveAfterRemoving) {
      handleSaveOrder();
      setIndexToRemove(undefined);
      setMessage(intl.experienceDeleted);
      setSaveAfterRemoving(false);
    }
  }, [saveAfterRemoving, fields]);

  const handleSaveOrder = async () => {
    try {
      const updatedExperienceList = fields.map((field, i) => {
        return { ...field, index: i };
      });

      const updatedExperience = toRecord(updatedExperienceList, "recordKey");
      saveBiographyExperience(updatedExperience);
      setIsOrderDialogOpen(false);
      fetchData();
      setMessage(intl.experienceOrderUpdated);
    } catch {
      setMessage(intl.somethingWentWrong);
    }
  };

  if (!user || loading) return null;

  return (
    <section className={styles.biographySection}>
      <div className={styles.biographySectionHeader}>
        <h2 className={styles.biographySectionTitle}>{intl.experience}</h2>
        <div className={styles.biographySectionHeaderActionBar}>
          <button
            type="button"
            onClick={openAddForm}
            className={styles.primaryButton}
          >
            {intl.addExperience}
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
          {intl.noProfessionalExperienceAdded}
        </p>
      ) : (
        <div className="divide-y divide-slate-200">
          {fields.map((field, index) => {
            return (
              <article
                key={field.recordKey}
                className="flex flex-wrap items-center gap-4 py-4"
              >
                <input
                  type="hidden"
                  {...register(`experience.${index}.recordKey`)}
                />
                <input
                  type="hidden"
                  {...register(`experience.${index}.position`)}
                />
                <input
                  type="hidden"
                  {...register(`experience.${index}.institution`)}
                />
                <input
                  type="hidden"
                  {...register(`experience.${index}.country`)}
                />
                <input
                  type="hidden"
                  {...register(`experience.${index}.dates`)}
                />
                <p className={styles.listItem}>
                  <span className="font-semibold">{index + 1}. </span>
                  {field.position}. {field.institution}. {field.country}.{" "}
                  {field.dates}
                </p>
                {/* Swap Actions */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => swap(index, index - 1)}
                  className="cursor-pointer"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => swap(index, index + 1)}
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
                  onClick={() => {
                    setIsDeleting(true);
                    setIndexToRemove(index);
                  }}
                  className={styles.deleteButton}
                >
                  {intl.delete}
                </button>
              </article>
            );
          })}
        </div>
      )}
      <FormDialog<ExperienceItem>
        isOpen={isFormOpen}
        title={intl.addExperience}
        subtitle={intl.allFieldsRequired}
        defaultValues={editingRecord || emptyExperienceItem}
        fields={experienceFields}
        onSave={activeKey != null ? editExperience : addExperience}
        onCancel={() => setIsFormOpen(false)}
      />

      {(isDeleting || isOrderDialogOpen) && (
        <ConfirmDialog
          dialogTitle={
            isDeleting ? intl.deleteExperienceEntry : intl.changeExperienceOrder
          }
          dialogBody={
            isDeleting
              ? intl.actionCanNotBeUndone
              : intl.areYouSureToUpdateOrder
          }
          confirmAction={isDeleting ? handleDelete : handleSaveOrder}
          cancelAction={() => {
            setIsDeleting(false);
            setActiveKey(null);
            setIndexToRemove(undefined);
            setIsOrderDialogOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default ProfessionalExperience;

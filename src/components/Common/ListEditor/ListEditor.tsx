import { useEffect, useState, type ReactNode } from "react";
import {
  useFieldArray,
  useForm,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { toRecord } from "../../../utilities/records";
import type { FieldConfig, RecordKey } from "../../../types/forms";
import ConfirmDialog from "../Dialog/ConfirmDialog";
import FormDialog from "../Dialog/FormDialog";
import styles from "./ListEditor.module.css";

type IndexedItem = FieldValues & { index: number };
type EditorRow = FieldValues & RecordKey & { index: number };
type EditorForm = { items: EditorRow[] };

interface FormEditorMessages {
  added: string;
  updated: string;
  deleted: string;
  orderUpdated: string;
  error: string;
  deleteTitle: string;
  orderTitle: string;
  deleteBody: string;
  orderBody: string;
  emptyMessage: string;
  allFieldsRequired: string;
  editLabel: string;
  deleteLabel: string;
  changeOrderLabel: string;
}

interface FormEditorProps<T extends IndexedItem> {
  title: string;
  addLabel: string;
  editTitle: string;
  emptyItem: T;
  items: Record<string, T>;
  fields: FieldConfig<T>[];
  messages: FormEditorMessages;
  formatSummary: (item: T) => ReactNode;
  createItem: (item: T) => Promise<unknown>;
  updateItem: (key: string, item: T) => Promise<void>;
  saveOrder: (items: Record<string, T>) => Promise<void>;
  fetchData: () => void;
}

function FormEditor<T extends IndexedItem>({
  title,
  addLabel,
  editTitle,
  emptyItem,
  items: savedItems,
  fields,
  messages,
  formatSummary,
  createItem,
  updateItem,
  saveOrder,
  fetchData,
}: FormEditorProps<T>) {
  const initialItems = Object.entries(savedItems)
    .map(([recordKey, item]) => ({ ...item, recordKey }) as EditorRow)
    .sort((a, b) => a.index - b.index);
  const {
    control,
    register,
    getValues,
    reset,
    formState: { isDirty: isOrderDirty },
  } = useForm<EditorForm>({
    defaultValues: { items: initialItems },
    mode: "onChange",
  });
  const {
    fields: items,
    append,
    remove,
    swap,
    update,
  } = useFieldArray<EditorForm, "items", "fieldArrayId">({
    control,
    name: "items",
    keyName: "fieldArrayId",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState<number>();
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
    setActiveKey(null);
    setError("");
  };

  const openAddForm = () => {
    setEditingRecord(null);
    setActiveKey(null);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (record: T, recordKey: string) => {
    setEditingRecord(record);
    setActiveKey(recordKey);
    setError("");
    setIsFormOpen(true);
  };

  const handleSaveOrder = async (
    orderedItems: EditorRow[] = getValues("items"),
    successMessage = messages.orderUpdated,
  ) => {
    try {
      const updatedItems = orderedItems.map((item, index) => ({
        ...item,
        index,
      }));
      const updatedRecord = toRecord(updatedItems, "recordKey");
      await saveOrder(updatedRecord as Record<string, T>);
      reset({ items: updatedItems });
      setIsOrderDialogOpen(false);
      fetchData();
      setMessage(successMessage);
      return true;
    } catch {
      setMessage(messages.error);
      return false;
    }
  };

  const handleAdd = async (data: T) => {
    try {
      if (isOrderDirty && !(await handleSaveOrder())) return;
      const createdKey = await createItem({ ...data, index: items.length });
      if (typeof createdKey !== "string") throw new Error("Missing item key");
      append({
        ...data,
        index: items.length,
        recordKey: createdKey,
      } as EditorRow);
      fetchData();
      setMessage(messages.added);
      closeForm();
    } catch {
      setError(messages.error);
    }
  };

  const handleEdit = async (data: T) => {
    if (activeKey === null) return;
    try {
      await updateItem(activeKey, data);
      const itemIndex = items.findIndex((item) => item.recordKey === activeKey);
      if (itemIndex !== -1) {
        update(itemIndex, { ...data, recordKey: activeKey } as EditorRow);
      }
      fetchData();
      setMessage(messages.updated);
      closeForm();
    } catch {
      setError(messages.error);
    }
  };

  const handleDelete = async () => {
    if (indexToRemove === undefined) return;
    const currentItems = getValues("items");
    const remainingItems = currentItems.filter(
      (_, index) => index !== indexToRemove,
    );
    remove(indexToRemove);
    if (await handleSaveOrder(remainingItems, messages.deleted)) {
      setIsDeleting(false);
      setIndexToRemove(undefined);
    } else {
      reset({ items: currentItems });
    }
  };

  const handleCancelConfirmation = () => {
    setIsDeleting(false);
    setIndexToRemove(undefined);
    setIsOrderDialogOpen(false);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    swap(index, targetIndex);
    setHighlightedId(items[index].index);
  };

  useEffect(() => {
    const defaultValuesArray = Object.entries(savedItems)
      .map(([key, value]) => ({
        ...value,
        recordKey: key,
      }))
      .sort((a, b) => a.index - b.index);
    reset({ items: defaultValuesArray });
  }, [savedItems]);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionHeaderActionBar}>
          <button
            type="button"
            onClick={openAddForm}
            className={styles.primaryButton}
          >
            {addLabel}
          </button>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setIsOrderDialogOpen(true)}
              className={styles.secondaryButton}
              disabled={!isOrderDirty}
            >
              {messages.changeOrderLabel}
            </button>
          )}
        </div>
      </div>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <span className={styles.errorMessage}>{error}</span>}
      {items.length === 0 ? (
        <p className={styles.missingInformationMessage}>
          {messages.emptyMessage}
        </p>
      ) : (
        <div className="divide-y divide-slate-200">
          {items.map(({ fieldArrayId, recordKey, ...item }, index) => (
            <article
              key={fieldArrayId}
              className={`${styles.row} ${index !== item.index && highlightedId === item.index ? styles.highlightedRow : ""}`}
            >
              {Object.keys(emptyItem)
                .filter((fieldName) => fieldName !== "index")
                .map((fieldName) => (
                  <input
                    key={fieldName}
                    type="hidden"
                    {...register(
                      `items.${index}.${fieldName}` as Path<EditorForm>,
                    )}
                  />
                ))}
              <input
                type="hidden"
                {...register(`items.${index}.recordKey` as Path<EditorForm>)}
              />
              <p className={styles.listItem}>
                <span className="font-semibold">{index + 1}. </span>
                {formatSummary(item as T)}
              </p>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
                className="cursor-pointer"
                aria-label={`Move ${title} item up`}
              >
                ▲
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                className="cursor-pointer"
                aria-label={`Move ${title} item down`}
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => openEditForm(item as T, recordKey)}
                className={styles.editButton}
              >
                {messages.editLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIndexToRemove(index);
                  setIsDeleting(true);
                }}
                className={styles.deleteButton}
              >
                {messages.deleteLabel}
              </button>
            </article>
          ))}
        </div>
      )}
      <FormDialog<T>
        isOpen={isFormOpen}
        title={editingRecord ? editTitle : addLabel}
        subtitle={messages.allFieldsRequired}
        defaultValues={editingRecord || emptyItem}
        fields={fields}
        onSave={activeKey !== null ? handleEdit : handleAdd}
        onCancel={closeForm}
      />
      {(isDeleting || isOrderDialogOpen) && (
        <ConfirmDialog
          dialogTitle={isDeleting ? messages.deleteTitle : messages.orderTitle}
          dialogBody={isDeleting ? messages.deleteBody : messages.orderBody}
          confirmAction={isDeleting ? handleDelete : () => handleSaveOrder()}
          cancelAction={handleCancelConfirmation}
        />
      )}
    </section>
  );
}

export default FormEditor;

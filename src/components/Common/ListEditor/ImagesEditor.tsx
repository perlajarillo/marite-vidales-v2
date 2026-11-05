import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import {
  useFieldArray,
  useForm,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { FieldConfig, RecordKey } from "../../../types/forms";
import ConfirmDialog from "../Dialog/ConfirmDialog";
import FormDialog from "../Dialog/FormDialog";
import { toRecord } from "../../../utilities/records";
import styles from "./ListEditor.module.css";
import intl from "../../../locales/en.json";
import { validateFile } from "../../../utilities/images";

type IndexedItem = FieldValues & { order: number };
type EditorRow = FieldValues & RecordKey & { order: number };
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
  createItem: (item: T, picture: File) => Promise<unknown>;
  updateItem: (key: string, item: T) => Promise<void>;
  saveOrder: (items: Record<string, T>) => Promise<void>;
  createItemsInBulk: (items: T[], filesArray: File[]) => Promise<void>;
  fetchData: () => void;
  prependNewItem?: boolean;
}

function ImagesManager<T extends IndexedItem>({
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
  createItemsInBulk,
  prependNewItem = false,
}: FormEditorProps<T>) {
  const initialItems = Object.entries(savedItems)
    .map(([recordKey, item]) => ({ ...item, recordKey }) as EditorRow)
    .sort((a, b) => a.order - b.order);
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
    prepend,
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFilesPreview, setSelectedFilesPreview] = useState<string[]>(
    [],
  );
  const [formTemplateValues, setFormTemplateValues] = useState<T>(emptyItem);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isAddingInBulk, setIsAddingInBulk] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
    setActiveKey(null);
    setError("");
  };

  const openAddForm = (url: string, file: File) => {
    setEditingRecord(null);
    setActiveKey(null);
    setError("");
    setIsFormOpen(true);
    setFormTemplateValues({ ...emptyItem, url });
    setSelectedFile(file);
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
        order: index,
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
      if (!selectedFile) return;
      const createdKey = await createItem(
        { ...data, order: items.length },
        selectedFile,
      );
      if (typeof createdKey !== "string") throw new Error("Missing item key");
      if (prependNewItem) {
        prepend({
          ...data,
          order: 0,
          recordKey: createdKey,
        });
        handleSaveOrder(undefined, messages.added);
      } else {
        append({
          ...data,
          order: items.length,
          recordKey: createdKey,
        } as EditorRow);
        fetchData();
        setMessage(messages.added);
      }
      const selectedFileIndex = selectedFilesPreview.indexOf(data.url);
      selectedFiles.splice(selectedFileIndex, 1);
      selectedFilesPreview.splice(selectedFileIndex, 1);
      setSelectedFile(undefined);
    } catch {
      setError(messages.error);
    } finally {
      closeForm();
    }
  };

  const handleSaveInBulk = async () => {
    try {
      setIsAddingInBulk(false);
      setIsProcessing(true);
      if (isOrderDirty && !(await handleSaveOrder())) return;
      if (!selectedFiles) return;
      var totalItems = items.length - 1;
      const selectedFilesTemplates = Array.from(selectedFilesPreview, () => {
        totalItems++;
        return { caption: "", url: "", order: totalItems };
      });
      await createItemsInBulk(
        selectedFilesTemplates as unknown as T[],
        selectedFiles,
      );
      fetchData();
      setMessage(intl.selectedImagesHaveBeenAdded);
      setSelectedFiles([]);
      setSelectedFilesPreview([]);
    } catch {
      setError(messages.error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async (data: T) => {
    if (activeKey === null) return;
    try {
      if (isOrderDirty && !(await handleSaveOrder())) return;
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
      (_, order) => order !== indexToRemove,
    );
    remove(indexToRemove);
    setIsDeleting(false);
    if (await handleSaveOrder(remainingItems, messages.deleted)) {
      setIndexToRemove(undefined);
    } else {
      reset({ items: currentItems });
    }
    closeForm();
    setIndexToRemove(undefined);
  };

  const handleCancelConfirmation = () => {
    setIsDeleting(false);
    setIndexToRemove(undefined);
    setIsOrderDialogOpen(false);
    setIsAddingInBulk(false);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    swap(index, targetIndex);
    setHighlightedId(items[index].order);
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError(""); // Clear previous errors
    const filesArray = Array.from(fileList);
    const files: File[] = [];
    const thumbnails: string[] = [];
    const errors: string[] = [];

    filesArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        files.push(file);
        thumbnails.push(URL.createObjectURL(file));
      }
    });

    if (errors.length > 0) {
      setError(errors.join(" "));
    }

    if (files.length > 0) {
      setSelectedFiles([...selectedFiles, ...files]);
      setSelectedFilesPreview([...selectedFilesPreview, ...thumbnails]);
    }
  };

  const handleSelectedFiles = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files?.length === 0) return;
    setError("");
    processFiles(event.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removeSelectedFile = (selectedFileIndex: number) => {
    const files: File[] = [...selectedFiles];
    const thumbnails: string[] = [...selectedFilesPreview];
    files.splice(selectedFileIndex, 1);
    thumbnails.splice(selectedFileIndex, 1);
    setSelectedFiles(files);
    setSelectedFilesPreview(thumbnails);
  };

  useEffect(() => {
    const defaultValuesArray = Object.entries(savedItems)
      .map(([key, value]) => ({
        ...value,
        recordKey: key,
      }))
      .sort((a, b) => a.order - b.order);
    reset({ items: defaultValuesArray });
  }, [savedItems]);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <span className={styles.errorMessage}>{error}</span>}
      {/* Upload Dropzone */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => setError("")}
        className={`${styles.dropZone} 
          ${isDraggingOver ? styles.draggingOver : styles.notDraggingOver}`}
      >
        <span>
          {isDraggingOver ? intl.dropImagesHere : intl.clickToUploadOrDragDrop}
        </span>
        <span className={styles.allowedFiles}>{intl.allowedFiles}</span>

        <input
          type="file"
          multiple
          accept=".jpg, .jpeg, .png"
          onChange={handleSelectedFiles}
          className="hidden"
        />
      </label>
      {selectedFilesPreview.length >= 1 && (
        <div className={styles.additionalDetailsContainer}>
          <p>{intl.addImagesInstructions}</p>
          <button
            type="button"
            onClick={() => setIsAddingInBulk(true)}
            className={styles.secondaryButton}
            disabled={isProcessing}
          >
            {isProcessing ? intl.savingSelectedFiles : intl.saveAllImages}
          </button>
        </div>
      )}
      <div className={styles.previewImageContainer}>
        {selectedFilesPreview.map((selectedFilePreview, index) => (
          <div key={selectedFilePreview} className={styles.previewImageWrapper}>
            <img
              src={selectedFilePreview}
              alt="Selected profile preview"
              onClick={() =>
                isProcessing
                  ? () => {}
                  : openAddForm(selectedFilePreview, selectedFiles[index])
              }
              className={`${styles.previewImage} ${isProcessing ? "animate-pulse" : ""}`}
            />
            <button
              onClick={() => removeSelectedFile(index)}
              className={styles.removeImageButton}
              title="Remove image"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      {/* Image Sequence Grid */}
      <div className={styles.imageSequenceGrid}>
        <div className={styles.imageGridContainer}>
          <h3 className={styles.imageGridHeader}>
            Sequence Order ({items.length} images)
          </h3>
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
        {items.length === 0 ? (
          <p className={styles.emptyMessage}>{messages.emptyMessage}</p>
        ) : (
          <div className={styles.imagesGrid}>
            {items.map(({ fieldArrayId, recordKey, ...img }, index) => (
              <div key={fieldArrayId} className={styles.imageItemWrapper}>
                {Object.keys(emptyItem)
                  .filter((fieldName) => fieldName !== "order")
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
                <div
                  className={`${styles.imageItem} ${index !== img.order && highlightedId === img.order ? styles.highlightedItem : ""}`}
                  onClick={() => openEditForm(img as T, recordKey)}
                >
                  <span className={styles.bullet}>{index + 1}</span>
                  <div>{formatSummary(img as T)}</div>
                </div>

                <div className={styles.actionBarWrapper}>
                  <div className={styles.orderArrowButtonsContainer}>
                    <button
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className={styles.orderArrowButton}
                      title={intl.moveLeft}
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      className={styles.orderArrowButton}
                      title={intl.moveRight}
                    >
                      →
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIndexToRemove(index);
                      setIsDeleting(true);
                    }}
                    className={styles.removeImageButton}
                    title={intl.delete}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FormDialog<T>
        isOpen={isFormOpen}
        title={editingRecord ? editTitle : addLabel}
        subtitle={messages.allFieldsRequired}
        defaultValues={editingRecord || formTemplateValues}
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
      {isAddingInBulk && (
        <ConfirmDialog
          dialogTitle={intl.addingImagesWithMissingDetails}
          dialogBody={intl.addMoreOrOneImagesConfirmation}
          confirmAction={handleSaveInBulk}
          cancelAction={handleCancelConfirmation}
        />
      )}
    </section>
  );
}

export default ImagesManager;

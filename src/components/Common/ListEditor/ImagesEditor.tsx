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
      console.log("selectedFilesTemplates", selectedFilesTemplates);
      await createItemsInBulk(
        selectedFilesTemplates as unknown as T[],
        selectedFiles,
      );
      fetchData();
      setMessage("A group of images have been added.");
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
    //const validImages: CarouselImage[] = [];
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
    <section className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white  ">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <span className={styles.errorMessage}>{error}</span>}
      {/* Upload Dropzone */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => setError("")}
        className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:bg-slate-100 transition 
          ${
            isDraggingOver
              ? "border-indigo-600 bg-indigo-50/80 bg-scale-[0.99]"
              : "border-slate-300 bg-slate-50 hover:bg-slate-100"
          }`}
      >
        <span className="text-sm font-medium text-slate-600">
          {isDraggingOver
            ? "Drop images here"
            : "Click to upload or drag & drop"}
        </span>
        <span className="text-xs text-slate-400 mt-1">
          PNG, JPG, WEBP up to 10MB
        </span>

        <input
          type="file"
          multiple
          accept=".jpg, .jpeg, .png"
          onChange={handleSelectedFiles}
          className="hidden"
        />
      </label>
      {selectedFilesPreview.length >= 1 && (
        <div className="flex flex-col justify-center items-center">
          <p>
            Click any image to add extra details and save them one by one. You
            can also save everything at once using the button below, but you'll
            need to fill in any missing details later.
          </p>
          <button
            type="button"
            onClick={() => setIsAddingInBulk(true)}
            className={styles.secondaryButton}
            disabled={isProcessing}
          >
            {isProcessing ? "Saving selected Files..." : "Save all images"}
          </button>
        </div>
      )}
      <div className="flex gap-5">
        {selectedFilesPreview.map((selectedFilePreview, index) => (
          <div
            key={selectedFilePreview}
            className="flex flex-col justify-center gap-3.5"
          >
            <img
              src={selectedFilePreview}
              alt="Selected profile preview"
              onClick={() =>
                isProcessing
                  ? () => {}
                  : openAddForm(selectedFilePreview, selectedFiles[index])
              }
              className={`w-30 h-16 object-cover rounded-lg border border-slate-200 ${isProcessing ? "animate-pulse" : ""}`}
            />
            <button
              onClick={() => removeSelectedFile(index)}
              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition ml-2"
              title="Remove image"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      {/* Image Sequence Grid */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-slate-700">
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
          <p className="text-sm text-slate-400 italic text-center py-4">
            No images added yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {items.map(({ fieldArrayId, recordKey, ...img }, index) => (
              <div
                key={fieldArrayId}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-xs"
              >
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
                  className={`${"flex items-center space-x-4"} ${index !== img.order && highlightedId === img.order ? styles.highlightedRow : ""}`}
                  onClick={() => openEditForm(img as T, recordKey)}
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
                    {index + 1}
                  </span>
                  <div>{formatSummary(img as T)}</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center pl-1">
                    <button
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer disabled:opacity-30 transition disabled:cursor-not-allowed"
                      title="Move Left"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer disabled:opacity-30 transition disabled:cursor-not-allowed"
                      title="Move Right"
                    >
                      →
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIndexToRemove(index);
                      setIsDeleting(true);
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition ml-2 cursor-pointer"
                    title="Delete"
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
          dialogTitle={"Adding multiple images"}
          dialogBody={
            "You are about to add one or more images at once. You will need to fill in any missing details later. Are you sure to proceed?"
          }
          confirmAction={handleSaveInBulk}
          cancelAction={handleCancelConfirmation}
        />
      )}
    </section>
  );
}

export default ImagesManager;

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAuth } from "../Login/AuthContext";
import { saveBiographySummary } from "../../services/biography";
import biographyStyles from "../Biography/Biography.module.css";
import styles from "./MyBiography.module.css";
import useBiography from "../../hooks/useBiography";
import BiographySkeleton from "../Biography/BiographySkeleton";
import intl from "../../locales/en.json";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

const SummaryAndPicture = () => {
  const { user } = useAuth();
  const {
    summary: savedSummary,
    picturePreview: savedPicture,
    loading,
    fetchData,
  } = useBiography();

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [draftSummary, setDraftSummary] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const handleOpenEdit = () => {
    setDraftSummary(savedSummary ?? "");
    setFilePreview(savedPicture ?? null);
    setSelectedFile(null);
    setError(null);
    setSuccess("");
    setIsEditorOpen(true);
  };

  const handleCloseEdit = () => {
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }
    setIsEditorOpen(false);
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);
  };

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isForbiddenType = !ALLOWED_TYPES.includes(file.type);
    const isForbiddenExt = !ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext),
    );

    if (file.size > MAX_IMAGE_SIZE) {
      setError(intl.imageShouldBeSmaller);
      event.target.value = "";
      return;
    }

    if (isForbiddenType || isForbiddenExt) {
      setError(intl.onlyTypesAllowed);
      event.target.value = "";
      return;
    }

    setError(null);
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftSummary.trim()) {
      setError(intl.artistStatementRequired);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveBiographySummary(
        draftSummary.trim(),
        selectedFile || undefined,
      );
      if (fetchData) await fetchData(); // Re-fetch or let cache update
      setSuccess("Summary and/or photo updated.");
      handleCloseEdit();
    } catch {
      setError(intl.biographySectionNotUpdated);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  if (loading) return <BiographySkeleton />;

  return (
    <div className={biographyStyles.biographyContainer}>
      <section className={biographyStyles.summaryContainer}>
        {success && <p className={styles.successMessage}>{success}</p>}
        <div className={biographyStyles.photoContainer}>
          <img
            src={savedPicture}
            alt="Marite Vidales"
            className={biographyStyles.photo}
          />
        </div>
        <div>
          <p className={biographyStyles.summaryText}>
            {savedSummary || "No artist statement has been added yet."}
          </p>
          <button
            type="button"
            onClick={handleOpenEdit}
            className={`${styles.editSummaryPhotoButton} bg-brand-primary hover:bg-brand-secondary`}
          >
            {intl.editSummaryPhoto}
          </button>
        </div>
      </section>

      {isEditorOpen && (
        <div className={styles.editorContainer} role="dialog" aria-modal="true">
          <form onSubmit={handleSubmit} className={styles.editorForm}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <h2 className={styles.formTitle}>{intl.editSummaryPhoto}</h2>

            <div className={styles.summaryAndPictureGrid}>
              <div>
                <label
                  htmlFor="biography-summary"
                  className={styles.textAreaLabel}
                >
                  {intl.artistStatement}
                </label>
                <textarea
                  id="biography-summary"
                  value={draftSummary}
                  onChange={(e) => setDraftSummary(e.target.value)}
                  required
                  rows={12}
                  className={styles.textArea}
                  placeholder={intl.artistStatement}
                />
              </div>
              <div className="space-y-3">
                <img
                  src={filePreview || savedPicture}
                  alt="Selected profile preview"
                  className="aspect-square w-full object-cover"
                />
                <label
                  className={styles.inputFileLabel}
                  htmlFor="biography-picture"
                >
                  {intl.profileImage}
                </label>
                <input
                  id="biography-picture"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handlePictureChange}
                  className={` text-brand-secondary file:bg-brand-primary ${styles.inputFile}`}
                />
                <p className={styles.inputFileFoot}>{intl.allowedFileType}</p>
              </div>
            </div>
            <div className={styles.actionBar}>
              <button
                type="button"
                onClick={handleCloseEdit}
                className={styles.cancelButton}
              >
                {intl.cancel}
              </button>
              <button
                type="submit"
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? intl.saving : intl.saveChanges}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SummaryAndPicture;

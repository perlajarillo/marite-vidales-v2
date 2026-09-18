import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAuth } from "../Login/AuthContext";
import { saveBiographySummary } from "../../services/biography";
import biographyStyles from "../Biography/Biography.module.css";
import styles from "./MyBiography.module.css";
import useBiography from "../../hooks/useBiography";
import BiographySkeleton from "../Biography/BiographySkeleton";
import intl from "../../locales/en.json";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
// Allowed types and extensions
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

const SetBiography = () => {
  const { user } = useAuth();
  const {
    error,
    setError,
    loading,
    summary,
    setSummary,
    picturePreview,
    setPicturePreview,
  } = useBiography();

  const [picture, setPicture] = useState<File>();
  const [saving, setSaving] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (picturePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(picturePreview);
      }
    };
  }, [picturePreview]);

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedPicture = event.target.files?.[0];
    const fileName = selectedPicture?.name.toLowerCase();

    if (!selectedPicture) return;

    setError(null);
    //Validate picture size
    if (selectedPicture.size > MAX_IMAGE_SIZE) {
      setPicture(undefined);
      setError(new Error(intl.imageShouldBeSmaller));
      event.target.value = ""; // Reset the input

      return;
    }

    // Validate file type
    const isForbiddenType = !ALLOWED_TYPES.includes(selectedPicture.type);
    const isForbiddenExt =
      fileName && !ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    if (isForbiddenType || isForbiddenExt) {
      setPicture(undefined);
      setError(new Error(intl.onlyTypesAllowed));
      event.target.value = ""; // Reset the input
      return;
    }

    setPicture(selectedPicture);
    setPicturePreview(URL.createObjectURL(selectedPicture));
  };

  const cancelEdit = () => {
    setIsEditorOpen(false);
    setError(null);
    setSuccess("");
    setPicture(undefined);
    setPicturePreview(picturePreview || "");
    setSummary(summary ?? "");
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!summary.trim()) {
      setError(new Error(intl.artistStatementRequired));
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess("");

    try {
      await saveBiographySummary(summary.trim(), picture);
      setPicture(undefined);
      setIsEditorOpen(false);
      setSuccess("Summary and/or photo updated.");
    } catch {
      setError(new Error(intl.biographySectionNotUpdated));
    } finally {
      setSaving(false);
    }
  };

  const onClickEdit = () => {
    setSummary(summary ?? "");
    setIsEditorOpen(true);
    setError(null);
    setSuccess("");
  };

  if (!user) return null;
  if (loading) {
    return <BiographySkeleton />;
  }

  return (
    <div className={biographyStyles.biographyContainer}>
      <section className={biographyStyles.summaryContainer}>
        {success && <p className={styles.successMessage}>{success}</p>}
        <div className={biographyStyles.photoContainer}>
          <img
            src={picturePreview}
            alt="Marite Vidales"
            className={biographyStyles.photo}
          />
        </div>
        <div>
          <p className={biographyStyles.summaryText}>
            {summary || "No artist statement has been added yet."}
          </p>
          <button
            type="button"
            onClick={onClickEdit}
            className={`${styles.editSummaryPhotoButton} bg-brand-primary hover:bg-brand-secondary focus:outline-brand-primary`}
          >
            {intl.editSummaryPhoto}
          </button>
        </div>
      </section>

      {isEditorOpen && (
        <div
          className={styles.editorContainer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-biography-title"
        >
          <form onSubmit={handleSubmit} className={styles.editorForm}>
            <div>
              {error && <p className={styles.errorMessage}>{error.message}</p>}
            </div>
            <div>
              <h2 id="edit-biography-title" className={styles.formTitle}>
                {intl.editSummaryPhoto}
              </h2>
              <p className={styles.formSubtitle}>
                {intl.updateSummaryProfileImg}
              </p>
            </div>
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
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  required
                  rows={12}
                  className={styles.textArea}
                  placeholder={intl.artistStatement}
                />
              </div>
              <div className="space-y-3">
                <img
                  src={picturePreview}
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
                onClick={() => cancelEdit()}
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

export default SetBiography;

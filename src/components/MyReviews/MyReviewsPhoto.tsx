import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAuth } from "../Login/AuthContext";
import { saveReviewsPhoto } from "../../services/reviews";
import reviewStyles from "../Reviews/Reviews.module.css";
import styles from "../MyBiography/MyBiography.module.css";
import intl from "../../locales/en.json";
import useReviews from "../../hooks/useReviews";
import ReviewsSkeleton from "../Reviews/ReviewsSkeleton";
import { validateFile } from "../../utilities/images";

const MyReviewsPhoto = () => {
  const { user } = useAuth();
  const { loading, fetchData, photo } = useReviews();
  const savedPicture = photo?.pictureUrl;
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const handleOpenEdit = () => {
    setFilePreview(savedPicture ?? undefined);
    setSelectedFile(undefined);
    setError(null);
    setSuccess("");
    setIsEditorOpen(true);
  };

  const handleCloseEdit = () => {
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }
    setIsEditorOpen(false);
    setSelectedFile(undefined);
    setFilePreview(undefined);
    setError(null);
  };

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setError(error);
      event.target.value = "";
      return;
    }
    setError(null);
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    if (!selectedFile) {
      setError(intl.noFileSelected);
      setSaving(false);
      return;
    }
    try {
      await saveReviewsPhoto(selectedFile);
      if (fetchData) await fetchData(); // Re-fetch or let cache update
      setSuccess(intl.reviewsPhotoUpdated);
      handleCloseEdit();
    } catch {
      setError(intl.reviewsPhotoNotUpdated);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  if (loading) return <ReviewsSkeleton />;

  return (
    <div className={reviewStyles.reviewsPhotoContainer}>
      <div className={reviewStyles.reviewsPhotoWrapper}>
        {success && <p className={styles.successMessage}>{success}</p>}
        <img
          src={savedPicture}
          alt="Marite Vidales"
          className={reviewStyles.reviewImage}
        />
      </div>
      <div className={reviewStyles.reviewsPhotoActions}>
        <button
          type="button"
          onClick={handleOpenEdit}
          className={`${styles.editSummaryPhotoButton} bg-brand-primary hover:bg-brand-secondary`}
        >
          {intl.changeReviewsPhoto}
        </button>
      </div>
      {isEditorOpen && (
        <div className={styles.editorContainer} role="dialog" aria-modal="true">
          <form
            onSubmit={handleSubmit}
            className={reviewStyles.reviewsPhotoForm}
          >
            {error && <p className={styles.errorMessage}>{error}</p>}
            <h2 className={styles.formTitle}>{intl.changeReviewsPhoto}</h2>
            <div className={reviewStyles.reviewsPhotoFormContent}>
              <img
                src={filePreview || savedPicture}
                alt="Selected profile preview"
                className={reviewStyles.reviewImage}
              />

              <input
                id="reviews-picture"
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handlePictureChange}
                className={`pt-1 text-brand-secondary file:bg-brand-primary ${styles.inputFile}`}
              />
              <p className={styles.inputFileFoot}>{intl.allowedFileType}</p>
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

export default MyReviewsPhoto;

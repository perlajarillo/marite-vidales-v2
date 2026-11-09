import { useAuth } from "../Login/AuthContext";
import intl from "../../locales/en.json";
import {
  createReviewItem,
  saveReviews,
  updateReviewItem,
} from "../../services/reviews";
import IndexedListEditor from "../Common/ListEditor/IndexedListEditor";
import { reviewsFields } from "./reviewsMetadata";
import type { Review } from "../../types/reviews";
import useReviews from "../../hooks/useReviews";
import { ReviewCard } from "../Reviews/ReviewCard";

const emptyReviewItem: Review = {
  author: "",
  quote: "",
  role: "",
  index: 0,
};

const ReviewsEditor = () => {
  const { user } = useAuth();
  const { reviews, loading, fetchData } = useReviews();

  if (!user || loading) return null;

  return (
    <IndexedListEditor<Review>
      title={intl.reviews}
      addLabel={intl.addReview}
      editTitle={intl.editReview}
      emptyItem={emptyReviewItem}
      items={reviews ?? {}}
      fields={reviewsFields}
      messages={{
        added: intl.reviewsAdded,
        updated: intl.reviewsUpdated,
        deleted: intl.reviewsDeleted,
        orderUpdated: intl.reviewsOrderUpdated,
        error: intl.somethingWentWrong,
        deleteTitle: intl.deleteReviewsEntry,
        orderTitle: intl.changeReviewsOrder,
        deleteBody: intl.actionCanNotBeUndone,
        orderBody: intl.areYouSureToUpdateOrder,
        emptyMessage: intl.noReviewsAdded,
        allFieldsRequired: intl.allFieldsRequired,
        editLabel: intl.edit,
        deleteLabel: intl.delete,
        changeOrderLabel: intl.changeOrder,
      }}
      formatSummary={(item) => (
        <ReviewCard
          key={item.index}
          quote={item.quote}
          author={item.author}
          role={item.role}
          index={item.index}
        />
      )}
      fetchData={fetchData}
      createItem={createReviewItem}
      updateItem={updateReviewItem}
      saveOrder={saveReviews}
    />
  );
};

export default ReviewsEditor;

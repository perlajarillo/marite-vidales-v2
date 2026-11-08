import { ReviewCard } from "./ReviewCard";
import ReviewsSkeleton from "./ReviewsSkeleton";
import useReviews from "../../hooks/useReviews";
import mariteStudio from "../../assets/reviews-image.jpg";
import style from "./Reviews.module.css";

const Reviews = () => {
  const { reviews: data, loading } = useReviews();
  const reviews = data
    ? Object.entries(data)
        .map(([id, review]) => ({ id, ...review }))
        .sort((a, b) => a.index - b.index)
    : [];
  return (
    <div className={style.reviewContainer}>
      {loading ? (
        <ReviewsSkeleton />
      ) : (
        <div className={style.reviewContentWrapper}>
          <div className={style.reviewContent}>
            <div className={style.reviewImageWrapper}>
              <img
                src={mariteStudio}
                alt="Marité Vidales in her studio"
                className={style.reviewImage}
              />
            </div>
            {reviews.map((rev) => (
              <ReviewCard
                key={rev.id}
                quote={rev.quote}
                author={rev.author}
                role={rev.role}
                index={rev.index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;

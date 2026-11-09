import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import MyReviewsPhoto from "./MyReviewsPhoto";
import ReviewsEditor from "./ReviewsEditor";

const MyReviews = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div className="mt-6 md:pt-0 flex flex-col gap-5">
      <MyReviewsPhoto />
      <ReviewsEditor />
    </div>
  );
};

export default MyReviews;

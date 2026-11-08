import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import ReviewsEditor from "./ReviewsEditor";

const MyReviews = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div className="mt-6 md:pt-0 flex flex-col gap-5">
      <ReviewsEditor />
    </div>
  );
};

export default MyReviews;

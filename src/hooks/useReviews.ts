import { useState, useEffect } from "react";
import { getReviews } from "../services/reviews";
import type { ReviewsData } from "../types/reviews";

const useReviews = () => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getReviews()
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  };

  return { reviews: data?.reviews, photo: data?.photo, loading, fetchData };
};

export default useReviews;

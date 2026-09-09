import { useState, useEffect } from "react";
import { getReviews } from "../services/reviews";
import type { Reviews } from "../types/reviews";

const useReviews = () => {
  const [data, setData] = useState<Reviews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews()
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

export default useReviews;

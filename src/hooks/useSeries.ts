import { useState, useEffect } from "react";
import { getSeries } from "../services/series";
import type { Series } from "../types/series";

const useSeries = () => {
  const [data, setData] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeries()
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

export default useSeries;

import { useState, useEffect } from "react";
import { getExhibits } from "../services/exhibits";
import type { Exhibits } from "../types/exhibits";

const useExhibits = () => {
  const [data, setData] = useState<Exhibits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExhibits()
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

export default useExhibits;

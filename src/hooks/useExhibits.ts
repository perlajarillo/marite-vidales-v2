import { useState, useEffect } from "react";
import { getExhibits } from "../services/exhibits";
import type { Exhibits, Gallery } from "../types/exhibits";

const useExhibits = () => {
  const [data, setData] = useState<Exhibits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [galleries, setGalleries] = useState<Record<string, Gallery>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getExhibits()
      .then((data) => {
        setData(data);
        setGalleries(data?.galleries ?? {});
      })
      .catch((error: unknown) => {
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to load exhibits data"),
        );
      })
      .finally(() => setLoading(false));
  };

  return {
    data,
    galleries,
    grantsAndAwards: data?.grantsAndAwards ?? {},
    solo: data?.solo ?? {},
    juried: data?.juried ?? {},
    selected: data?.selected ?? {},
    carousel: data?.carousel ?? {},
    loading,
    error,
    fetchData,
  };
};

export default useExhibits;

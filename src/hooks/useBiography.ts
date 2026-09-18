import { useState, useEffect } from "react";
import { getBiography } from "../services/biography";
import type { Biography } from "../types/biography";

const useBiography = () => {
  const [data, setData] = useState<Biography | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [summary, setSummary] = useState("");
  const [picturePreview, setPicturePreview] = useState<string | undefined>("");
  useEffect(() => {
    getBiography()
      .then((data) => {
        setData(data);
        setSummary(data?.summary?.trimStart() ?? "");
        setPicturePreview(data?.pictureUrl ?? "");
      })
      .catch((error: unknown) => {
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to load biography"),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    data,
    setData,
    error,
    setError,
    hasData: data !== null,
    loading,
    setLoading,
    summary,
    setSummary,
    picturePreview,
    setPicturePreview,
  };
};

export default useBiography;

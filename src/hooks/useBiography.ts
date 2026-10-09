import { useState, useEffect } from "react";
import { getBiography } from "../services/biography";
import type {
  Biography,
  EducationItem,
  ExperienceItem,
} from "../types/biography";

const useBiography = () => {
  const [data, setData] = useState<Biography | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState<Record<string, EducationItem>>({});
  const [experience, setExperience] = useState<Record<string, ExperienceItem>>(
    {},
  );

  const [picturePreview, setPicturePreview] = useState<string | undefined>("");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getBiography()
      .then((data) => {
        setData(data);
        setSummary(data?.summary?.trimStart() ?? "");
        setEducation(data?.education ?? {});
        setExperience(data?.experience ?? {});
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
  };

  return {
    data,
    error,
    hasData: data !== null,
    loading,
    setLoading,
    summary,
    picturePreview,
    fetchData,
    education,
    experience,
  };
};

export default useBiography;

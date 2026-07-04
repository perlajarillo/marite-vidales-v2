import { useState, useEffect } from "react";
import { getBiography } from "../services/biography";
import type { Biography } from "../types/biography";

const useBiography = () => {
  const [data, setData] = useState<Biography | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBiography()
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

export default useBiography;

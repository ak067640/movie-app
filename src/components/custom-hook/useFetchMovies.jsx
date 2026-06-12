import { useEffect, useState } from "react";
import axios from "axios";

const useFetchMovies = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, { signal: controller.signal });
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.log(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
};

export default useFetchMovies;

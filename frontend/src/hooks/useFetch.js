import { useState, useEffect } from "react";

const useFetch = (fetchFn, deps = []) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    setLoading(true);
    fetchFn()
      .then((r) => setData(r.data.data))
      .catch((e) => setError(e.response?.data?.message || "Something went wrong"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};

export default useFetch;

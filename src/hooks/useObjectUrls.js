import { useEffect, useMemo, useState } from "react";

export function useObjectUrls(files) {
  const signature = useMemo(
    () => files.map((f) => `${f?.name}-${f?.size}-${f?.lastModified}`).join("|"),
    [files]
  );

  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (!files.length) {
      setUrls([]);
      return undefined;
    }

    const created = files.map((f) => (f ? URL.createObjectURL(f) : null));
    setUrls(created);

    return () => {
      created.forEach((u) => u && URL.revokeObjectURL(u));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- signature tracks files
  }, [signature]);

  return urls;
}

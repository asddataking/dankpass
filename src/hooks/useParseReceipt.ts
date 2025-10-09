// hooks/useParseReceipt.ts
import { useState } from "react";

export function useParseReceipt() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function parse(blobUrl: string, userId: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blobUrl, userId })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Parse failed");
      setResult(json);
      return json;
    } catch (e: any) {
      setError(e?.message || "error");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { parse, loading, result, error };
}


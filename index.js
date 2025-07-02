import { useState } from "react";

export default function Home() {
  const [review, setReview] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReply = async () => {
    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, tone }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to generate reply");
      } else {
        const data = await res.json();
        setResponse(data.reply);
      }
    } catch (e) {
      setError("Network error or server unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      <h1>Review Reply Generator</h1>
      <textarea
        rows={4}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Paste the customer review here..."
        style={{ width: "100%", marginBottom: 12 }}
      />
      <input
        type="text"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        placeholder="Response tone (e.g., Friendly)"
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button onClick={generateReply} disabled={loading}>
        {loading ? "Loading..." : "Generate Reply"}
      </button>
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      <textarea
        rows={4}
        value={response}
        readOnly
        placeholder="GPT-generated reply will appear here..."
        style={{ width: "100%", marginTop: 12 }}
      />
    </main>
  );
}

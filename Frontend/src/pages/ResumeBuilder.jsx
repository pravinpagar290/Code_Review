import React, { useState } from "react";
import api from "../api/api";

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    summary: "",
    experience: "",
  });
  const [savedId, setSavedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await api.post("/resume", form);
      setSavedId(resp.data.id);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoad() {
    if (!savedId) return;
    setLoading(true);
    try {
      const resp = await api.get(`/resume/${savedId}`);
      setForm(resp.data.data || {});
    } catch (err) {
      setError("Load failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ color: "#fff" }}>Resume Builder</h1>
      <form onSubmit={handleSave} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <textarea
          placeholder="Summary"
          rows={4}
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
        />
        <textarea
          placeholder="Experience"
          rows={6}
          value={form.experience}
          onChange={(e) => update("experience", e.target.value)}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "8px 12px" }}
          >
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleLoad}
            disabled={!savedId || loading}
            style={{ padding: "8px 12px" }}
          >
            Load Saved
          </button>
        </div>
      </form>

      {savedId && (
        <div style={{ marginTop: 12, color: "#d1fae5" }}>
          Saved ID: <strong>{savedId}</strong>
        </div>
      )}

      {error && <div style={{ color: "salmon", marginTop: 12 }}>{error}</div>}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function BlockEditor({ value, onChange, adminToken }) {
  const [blocks, setBlocks] = useState(Array.isArray(value) ? value : []);

  function update(next) {
    setBlocks(next);
    onChange?.(next);
  }

  function addText() {
    update([...blocks, { type: "text", content: "" }]);
  }

  function addEmbed() {
    update([...blocks, { type: "embed", url: "" }]);
  }

  function addHeading() {
    update([...blocks, { type: "heading", level: 2, text: "Section title" }]);
  }

  async function addImage(file) {
    if (!file) return;
    const res = await fetch("/api/uploads/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
      body: JSON.stringify({ folder: "raagsan" })
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Upload sign failed");

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", data.api_key);
    form.append("timestamp", String(data.timestamp));
    form.append("signature", data.signature);
    form.append("folder", data.folder);

    const upload = await fetch(`https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`, { method: "POST", body: form });
    const uploaded = await upload.json();
    if (uploaded.secure_url) {
      update([...blocks, { type: "image", url: uploaded.secure_url, alt: file.name }]);
    } else {
      alert("Upload failed");
    }
  }

  function updateBlock(idx, patch) {
    const next = blocks.slice();
    next[idx] = { ...next[idx], ...patch };
    update(next);
  }

  function removeBlock(idx) {
    const next = blocks.slice();
    next.splice(idx, 1);
    update(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" className="bg-gray-900 text-white px-3 py-1" onClick={addText}>Add Text</button>
        <button type="button" className="bg-gray-900 text-white px-3 py-1" onClick={addEmbed}>Add Embed</button>
        <button type="button" className="bg-gray-900 text-white px-3 py-1" onClick={addHeading}>Add Heading</button>
        <label className="bg-gray-900 text-white px-3 py-1 cursor-pointer">
          Add Image
          <input type="file" className="hidden" accept="image/*" onChange={(e) => addImage(e.target.files?.[0])} />
        </label>
      </div>
      <div className="space-y-4">
        {blocks.map((b, i) => (
          <div key={i} className="border p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm uppercase tracking-wide text-gray-500">{b.type}</span>
              <button type="button" className="text-red-600" onClick={() => removeBlock(i)}>Remove</button>
            </div>
            {b.type === "text" && (
              <textarea className="border w-full p-2" rows={4} value={b.content || ""} onChange={(e) => updateBlock(i, { content: e.target.value })} />
            )}
            {b.type === "image" && (
              <div>
                <img src={b.url} alt={b.alt || ""} className="max-h-48" />
                <input className="border p-2 w-full mt-2" placeholder="Alt text" value={b.alt || ""} onChange={(e) => updateBlock(i, { alt: e.target.value })} />
              </div>
            )}
            {b.type === "heading" && (
              <div className="flex items-center gap-2">
                <select className="border p-2" value={b.level || 2} onChange={(e) => updateBlock(i, { level: Number(e.target.value) })}>
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input className="border p-2 w-full" value={b.text || ""} onChange={(e) => updateBlock(i, { text: e.target.value })} />
              </div>
            )}
            {b.type === "embed" && (
              <input className="border p-2 w-full" placeholder="Embed URL" value={b.url || ""} onChange={(e) => updateBlock(i, { url: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { username, password, redirect: true, callbackUrl: "/admin" });
    if (res?.error) setError(res.error);
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm">Username</label>
          <input className="border px-3 py-2 w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="border px-3 py-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2">Sign In</button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}



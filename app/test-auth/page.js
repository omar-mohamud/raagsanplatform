"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function TestAuth() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState(null);

  const testLogin = async () => {
    try {
      const result = await signIn("credentials", {
        username: "admin",
        password: "admin123",
        redirect: false,
      });
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: error.message });
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Current Session Status:</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Session:</strong> {session ? JSON.stringify(session, null, 2) : "No session"}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Login (admin/admin123)
          </button>

          {session && (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          )}
        </div>

        {testResult && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
            <pre className="text-sm">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Test Login" to try logging in with admin/admin123</li>
            <li>Check the browser console for detailed logs</li>
            <li>Check the server console for NextAuth logs</li>
            <li>If login works, you should see session data above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
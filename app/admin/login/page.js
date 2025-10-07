"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Clear URL parameters on page load to prevent credential exposure
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any existing URL parameters to prevent credential exposure
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setLoading(true);
    setError("");

    // Validate inputs
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { username: credentials.username.trim() });
      
      const result = await signIn("credentials", {
        username: credentials.username.trim(),
        password: credentials.password,
        redirect: false,
        callbackUrl: "/admin"
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.log("Login error:", result.error);
        setError(`Login failed: ${result.error}`);
        // Clear password field on error
        setCredentials(prev => ({ ...prev, password: "" }));
      } else if (result?.ok) {
        console.log("Login successful, redirecting...");
        // Successful login - redirect to admin
        router.push("/admin");
        router.refresh();
      } else {
        console.log("Unexpected result:", result);
        setError("Login failed. Please try again.");
        setCredentials(prev => ({ ...prev, password: "" }));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`An error occurred: ${err.message}`);
      setCredentials(prev => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Main Card - Using who-we-are design */}
        <div className="who-we-are-section">
          {/* Header Section */}
          <div className="who-we-are-header text-center mb-6">
            <h3 className="who-we-are-title">Admin Portal</h3>
            <div className="who-we-are-line"></div>
          </div>
          <h2 className="who-we-are-main-title text-center mb-8">
            Secure Access to<br />
            Content Management
          </h2>

          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit} method="POST" action="/api/auth/signin/credentials">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#035F87] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your username"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#035F87] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm font-medium text-red-700">{error}</div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-[#035F87] to-[#046E9C] hover:from-[#046E9C] hover:to-[#035F87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#035F87] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

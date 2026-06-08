"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/dashboard");
      }
    };

    checkUser();
  }, [router, supabase.auth]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">InboxAI</h1>
          <p className="text-xl text-gray-600">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Mode tabs for clearer state indication */}
          <div className="mb-6" role="tablist" aria-label="Authentication mode">
            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                role="tab"
                aria-selected={!isSignUp}
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setMessage(null);
                }}
                className={`${
                  !isSignUp
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-800"
                } flex items-center justify-center py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isSignUp}
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                  setMessage(null);
                }}
                className={`${
                  isSignUp
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-800"
                } flex items-center justify-center py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Prominent mode badge + heading */}
          <div className="flex items-center justify-center mb-6">
            <span
              aria-live="polite"
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                isSignUp
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              {isSignUp ? "Sign up" : "Sign in"}
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">Error: {error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-600 text-center">{message}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none ${
                  isSignUp
                    ? "focus:ring-emerald-500 focus:border-emerald-500"
                    : "focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none ${
                  isSignUp
                    ? "focus:ring-emerald-500 focus:border-emerald-500"
                    : "focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter your password"
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-500">
                  Use at least 6 characters.
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : isSignUp
                      ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.042 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </div>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium cursor-pointer"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

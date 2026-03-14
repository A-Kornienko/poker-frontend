import React, { useState } from "react";
import { useFetching } from "../../hooks/useFetching";
import RegisterService from "../../api/Auth/RegisterService";
import Loader from "../../components/UI/Loader/Loader";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: [],
    login: [],
    password: [],
  });

  const [fetchRegister, isRegisterLoading, RegisterError] = useFetching(
    async (email, login, password) => {
      // Clear previous field errors
      setFieldErrors({ email: [], login: [], password: [] });

      const response = await RegisterService.register(email, login, password);

      if (!response.data.success) {
        setFieldErrors({
          email: response.data.data.email || [],
          login: response.data.data.login || [],
          password: response.data.data.password || [],
        });
        setPassword("");
        return;
      }

      setEmail("");
      setLogin("");
      setPassword("");

      navigate("/login");
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    fetchRegister(email, login, password);
  };

  return (
    <>
      {/* Loader */}
      {isRegisterLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <Loader />
        </div>
      )}

      <div className="h-vh-fullScreen bg-zinc-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-100">PokerRoom</h1>
            <p className="text-gray-500 mt-2">Register</p>
          </div>

          {/* Form card */}
          <div className="w-full bg-zinc-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-700 p-8 flex flex-col">
            {/* Error message */}
            {RegisterError && (
              <div className="mb-6 p-4 bg-red-900/60 border border-red-700 text-red-200 rounded-lg text-sm">
                {RegisterError}
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`px-4 py-3 bg-zinc-700/70 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition ${
                    fieldErrors.email.length > 0
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-600 focus:border-indigo-500"
                  }`}
                  placeholder="your@email.com"
                  disabled={isRegisterLoading}
                />
                {/* Email errors */}
                {fieldErrors.email.length > 0 && (
                  <div className="mt-2 text-sm text-red-400">
                    {fieldErrors.email.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Login */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-2">
                  Login
                </label>
                <input
                  type="text"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className={`px-4 py-3 bg-zinc-700/70 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition ${
                    fieldErrors.login.length > 0
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-600 focus:border-indigo-500"
                  }`}
                  placeholder="login"
                  disabled={isRegisterLoading}
                />
                {/* Login errors */}
                {fieldErrors.login.length > 0 && (
                  <div className="mt-2 text-sm text-red-400">
                    {fieldErrors.login.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-zinc-700/70 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition ${
                      fieldErrors.password.length > 0
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-600 focus:border-indigo-500"
                    }`}
                    placeholder="••••••••"
                    disabled={isRegisterLoading}
                  />

                  {/* Eye button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-200 transition"
                  >
                    {showPassword ? (
                      // Eye open (password visible)
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      // The eye is crossed out (password hidden)
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password errors */}
                {fieldErrors.password.length > 0 && (
                  <div className="mt-2 text-sm text-red-400">
                    {fieldErrors.password.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isRegisterLoading}
                className="py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {isRegisterLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

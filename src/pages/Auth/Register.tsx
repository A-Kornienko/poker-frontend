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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      <main className="flex min-h-[calc(100vh-var(--topbar-height))] items-center justify-center bg-[#101a19] px-4 py-10 sm:px-6">
        <div className="flex w-full max-w-md flex-col items-center">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              PokerRoom
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Register
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Create your account and join the table.
            </p>
          </div>

          {/* Form card */}
          <div className="flex w-full flex-col rounded-2xl border border-white/10 bg-zinc-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            {/* Error message */}
            {RegisterError && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {RegisterError}
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`rounded-xl border bg-white/[0.04] px-4 py-3 text-zinc-100 placeholder-zinc-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                    fieldErrors.email.length > 0
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-emerald-400/60"
                  }`}
                  placeholder="your@email.com"
                  disabled={isRegisterLoading}
                />
                {/* Email errors */}
                {fieldErrors.email.length > 0 && (
                  <div className="mt-2 text-sm text-red-300">
                    {fieldErrors.email.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Login */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-zinc-300">
                  Login
                </label>
                <input
                  type="text"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className={`rounded-xl border bg-white/[0.04] px-4 py-3 text-zinc-100 placeholder-zinc-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                    fieldErrors.login.length > 0
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-emerald-400/60"
                  }`}
                  placeholder="login"
                  disabled={isRegisterLoading}
                />
                {/* Login errors */}
                {fieldErrors.login.length > 0 && (
                  <div className="mt-2 text-sm text-red-300">
                    {fieldErrors.login.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3 pr-12 text-zinc-100 placeholder-zinc-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                      fieldErrors.password.length > 0
                        ? "border-red-500 focus:border-red-500"
                        : "border-white/10 focus:border-emerald-400/60"
                    }`}
                    placeholder="••••••••"
                    disabled={isRegisterLoading}
                  />

                  {/* Eye button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400"
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
                  <div className="mt-2 text-sm text-red-300">
                    {fieldErrors.password.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isRegisterLoading}
                className="rounded-xl bg-emerald-400 px-4 py-3.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isRegisterLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

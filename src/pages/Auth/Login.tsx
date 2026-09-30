import React, { useState } from "react";
import { useFetching } from "../../hooks/useFetching";
import LoginService from "../../api/Auth/LoginService";
import Loader from "../../components/UI/Loader/Loader";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    email: [],
    password: [],
    non_field_errors: [],
  });

  const [fetchLogin, isLoginLoading, loginError] = useFetching(
    async (email, password) => {
      setFieldErrors({ email: [], password: [], non_field_errors: [] });

      try {
        const response = await LoginService.login(email, password);

        // Get access_token
        const { token, refresh_token } = response.data;

        const userPayload = jwtDecode(token);

        // Save access_token & refresh_token
        Cookies.set("access_token", token, {
          expires: 30,
          path: '/',
          sameSite: 'lax'
        });
        Cookies.set("refresh_token", refresh_token, {
          expires: 30,
          path: '/',
          sameSite: 'lax'
        });

        // Save userPayload in context (login, email)
        login(userPayload);

        navigate("/cash-table");
      } catch (err) {
        if (err.response?.data) {
          const data = err.response.data;
          setFieldErrors({
            email: data.email || [],
            password: data.password || [],
            non_field_errors: data.message
              ? [data.message]
              : data.non_field_errors || [],
          });
        } else {
          setFieldErrors({
            non_field_errors: ["Network error. Try again."],
          });
        }
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    fetchLogin(email, password);
  };

  return (
    <>
      {/* Loader */}
      {isLoginLoading && (
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
              Login
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Welcome back to the table.
            </p>
          </div>

          {/* Form card */}
          <div className="flex w-full flex-col rounded-2xl border border-white/10 bg-zinc-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            {/* Error message */}
            {fieldErrors.non_field_errors.length > 0 && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {fieldErrors.non_field_errors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
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
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-zinc-100 placeholder-zinc-500 transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="your@email.com"
                  disabled={isLoginLoading}
                />
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
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-zinc-100 placeholder-zinc-500 transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="••••••••"
                    disabled={isLoginLoading}
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
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm text-emerald-300 transition hover:text-emerald-200"
                >
                  Forgot your password?
                </a>
                <a
                  href="/register"
                  className="text-sm text-emerald-300 transition hover:text-emerald-200"
                >
                  Register
                </a>
              </div>

              {/* Кнопка */}
              <button
                type="submit"
                disabled={isLoginLoading}
                className="rounded-xl bg-emerald-400 px-4 py-3.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoginLoading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

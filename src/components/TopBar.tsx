import React, { useState, useRef, useEffect } from "react";
import LogoutService from "../api/Auth/LogoutService";
import { useAuth } from "../context/AuthContext";
import { useFetching } from "../hooks/useFetching";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/UI/Loader/Loader";
import { clearAuthTokens } from '../helpers/authUtils';

const TopBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentcolor = "#9ca3af";
  const isLobbyRoute = pathname === "/" || pathname.startsWith("/cash-table");
  const isPokerTableRoute = pathname.startsWith("/poker-table");
  const isCashGamesActive = isLobbyRoute || isPokerTableRoute;
  const isTournamentsActive = pathname.startsWith("/tournaments");
  const isSettingsActive = pathname === "/settings";
  const activeTabClass = isLobbyRoute
    ? "text-amber-300 after:bg-amber-400"
    : "text-emerald-300 after:bg-emerald-400";
  const navTabClass =
    "relative flex min-h-16 items-center gap-2.5 px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 sm:px-4";

  // Dropdown status
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout: contextLogout, user } = useAuth();

  // Close when clicked outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [fetchLogout, isLogoutLoading] = useFetching(async () => {
    await LogoutService.logout();
  });

  const actionLogout = () => {
    fetchLogout(); 
    contextLogout(); // Deletes the state of authContext
    clearAuthTokens(); // Deletes Cookies and calls API
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Loader */}
      {isLogoutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <Loader />
        </div>
      )}
      <div
        className={`relative z-30 border-b bg-zinc-950/90 shadow-lg shadow-black/10 backdrop-blur-xl ${
          isLobbyRoute ? "border-amber-400/20" : "border-emerald-400/20"
        }`}
      >
        <div className="flex min-h-16 items-center justify-between px-2 sm:px-4 lg:px-8">
          {/* left tabs */}
          <div className="flex min-w-0 items-center gap-1">
            <a
              className={`${navTabClass} ${
                isCashGamesActive
                  ? `${activeTabClass} after:opacity-100`
                  : "text-zinc-400 after:opacity-0 hover:bg-white/[0.04] hover:text-zinc-100"
              }`}
              href="/cash-table"
              aria-current={isCashGamesActive ? "page" : undefined}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6">
                <path
                  d="M11.19,2.25C11.97,2.26 12.71,2.73 13,3.5L18,15.45C18.09,15.71 18.14,16 18.13,16.25C18.11,17 17.65,17.74 16.9,18.05L9.53,21.1C9.27,21.22 9,21.25 8.74,21.25C7.97,21.23 7.24,20.77 6.93,20L1.97,8.05C1.55,7.04 2.04,5.87 3.06,5.45L10.42,2.4C10.67,2.31 10.93,2.25 11.19,2.25M14.67,2.25H16.12A2,2 0 0,1 18.12,4.25V10.6L14.67,2.25M20.13,3.79L21.47,4.36C22.5,4.78 22.97,5.94 22.56,6.96L20.13,12.82V3.79M11.19,4.22L3.8,7.29L8.77,19.3L16.17,16.24L11.19,4.22M8.65,8.54L11.88,10.95L11.44,14.96L8.21,12.54L8.65,8.54Z"
                  fill={currentcolor}
                />
              </svg>
              <span className="whitespace-nowrap">Cash games</span>
            </a>
            <a
              className={`${navTabClass} ${
                isTournamentsActive
                  ? `${activeTabClass} after:opacity-100`
                  : "text-zinc-400 after:opacity-0 hover:bg-white/[0.04] hover:text-zinc-100"
              }`}
              href="/tournaments"
              aria-current={isTournamentsActive ? "page" : undefined}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6">
                <path
                  d="M2,2V4H7V8H2V10H7C8.11,10 9,9.11 9,8V7H14V17H9V16C9,14.89 8.11,14 7,14H2V16H7V20H2V22H7C8.11,22 9,21.11 9,20V19H14C15.11,19 16,18.11 16,17V13H22V11H16V7C16,5.89 15.11,5 14,5H9V4C9,2.89 8.11,2 7,2H2Z"
                  fill={currentcolor}
                />
              </svg>
              <span className="whitespace-nowrap">Tournaments</span>
            </a>
          </div>

          {/* right dropdown */}
          <div className="relative flex h-full items-center" ref={dropdownRef}>
            {!user ? (
              <a
                href="/login"
                aria-label="Log in"
                className="flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls="topbar-account-menu"
                className={`flex h-11 max-w-[55vw] items-center gap-2 rounded-xl border px-3 text-zinc-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:max-w-none ${
                  isOpen
                    ? "border-white/20 bg-white/[0.09]"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="truncate text-sm">{user.login || user.email || ""}</span>
                <svg
                  className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}

            {/* dropdown menu */}
            <div
              id="topbar-account-menu"
              className={`absolute right-0 top-full w-56 origin-top-right rounded-xl shadow-2xl ring-1 ring-black/30 transition-all duration-200 ease-out ${
                isOpen
                  ? "visible z-40 mt-2 scale-100 opacity-100"
                  : "opacity-0 invisible scale-95 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 py-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Profile</span>
                </a>
                <a
                  href="/settings"
                  aria-current={isSettingsActive ? "page" : undefined}
                  className={`flex items-center px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 ${
                    isSettingsActive
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Settings</span>
                </a>
                <div className="my-1.5 border-t border-white/10"></div>
                <button
                  type="button"
                  onClick={actionLogout}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-400/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;

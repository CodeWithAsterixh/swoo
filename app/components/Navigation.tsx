"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { initialLetters } from "@/lib/text-transform";

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const navItems = [
    { label: "Template", href: "/templates" },
    { label: "Create", href: "/editor/create" },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="mx-auto w-full max-w-6xl">
        {/* Main Navigation Banner */}
        <div className="bg-primary/50 backdrop-blur-lg border border-base-300/40 rounded-full px-6 py-4 shadow-xl flex items-center justify-between">
          {/* Left: Status Badge */}
          <div className="flex items-center gap-0 p-2 sm:pr-4 bg-base-300 text-secondary rounded-full text-xs font-semibold whitespace-nowrap">
            <Link href="/" className="flex items-center gap-0.5 shrink-0">
              <div className="w-9 h-9 bg-base-content rounded-full flex items-center justify-center">
                <span className="text-base-100 font-bold text-lg">S</span>
              </div>
              <span className="hidden sm:inline text-lg font-bold -mt-1 text-base-content">
                woo
              </span>
            </Link>
          </div>

          {/* Center: Logo + Nav Items */}
          <div className="absolute -translate-x-1/2 left-1/2 flex items-center gap-1 md:gap-8">
            {/* Logo with Icon */}

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all ${
                    isActive(item.href)
                      ? "bg-primary/20 text-primary"
                      : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative hidden sm:flex">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-4 rounded-full text-sm font-medium bg-base-100 text-neutral-100 hover:bg-base-100/80 cursor-pointer transition-all flex items-center gap-2"
                >
                  <span className="hidden sm:inline">
                    {initialLetters({
                      str: user?.name || user?.email || "U",
                      amount: 2,
                      type: "uppercase",
                    })}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-base-300 text-xs text-base-content/60 font-medium">
                      {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50/50 transition-colors font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:inline px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-semibold rounded-full bg-primary text-primary-content hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-base-200/50 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Dropdown below banner */}
        {mobileOpen && (
          <div className="mt-3 bg-base-100/85 backdrop-blur-lg border border-base-300/40 rounded-3xl p-4 shadow-xl lg:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-primary/20 text-primary"
                      : "text-base-content/70 hover:bg-base-200/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {!isAuthenticated ? (
                <div className="flex gap-2 pt-3 border-t border-base-300/40">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 px-4 py-3 text-center text-sm font-medium text-base-content/70 hover:bg-base-200/50 rounded-2xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 px-4 py-3 text-center text-sm font-semibold rounded-2xl bg-primary text-primary-content hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="mt-2 w-full bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-base-300 text-xs text-base-content/60 font-medium">
                    {user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50/50 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;

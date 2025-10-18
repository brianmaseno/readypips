"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  BarChart3,
  Menu,
  X,
  AreaChart,
  Copy,
  MoreVertical,
  HelpCircle,
  MessageSquare,
  Shield,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-context";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { CreditDisplay } from "@/components/credit-display";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const navigationItems = [
    {
      name: "Signals Tool",
      href: "/signals",
      icon: AreaChart,
      description: "Trading signals & subscription",
    },
    {
      name: "Copy Trading",
      href: "/copy-trading",
      icon: Copy,
      description: "Copy expert traders",
    },
    {
      name: "Charts",
      href: "/charts",
      icon: BarChart3,
      description: "Advanced charts",
    },
  ];

  const moreItems = [
    {
      name: "Support",
      href: "/support",
      icon: HelpCircle,
    },
    {
      name: "FAQs",
      href: "/faqs",
      icon: HelpCircle,
    },
    {
      name: "Testimonials",
      href: "/testimonials",
      icon: MessageSquare,
    },
    {
      name: "Privacy Policy",
      href: "/privacy-policy",
      icon: Shield,
    },
    {
      name: "Terms & Conditions",
      href: "/terms-conditions",
      icon: FileText,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <div className="relative h-8">
              <img
                src="/logo-light.png"
                alt="Ready Pips Logo"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/logo-dark.png"
                alt="Ready Pips Logo"
                className="h-8 w-auto hidden dark:block"
              />
            </div>
          </Link>


        </div>

        {/* Main Navigation */}
        <div className="flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isActive(item.href)
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}

          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span>More</span>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Resources</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <DropdownMenuItem className="cursor-pointer flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  </Link>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <ThemeSwitcher />
          {user && <CreditDisplay />}

          {user ? (
            <>
              {/* User avatar circle with initials and link to profile */}
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                    {user.firstName && user.lastName
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                      : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.firstName || user.email}</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center">
            <div className="relative h-8">
              <img
                src="/logo-dark.png"
                alt="Ready Pips Logo"
                className="h-8 w-auto"
              />
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            {user && <CreditDisplay />}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black dark:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="px-4 pb-4 space-y-2 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive(item.href)
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              );
            })}

            {/* More Items in Mobile */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2 py-1">More</div>
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

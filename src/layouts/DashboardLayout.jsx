import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  Home,
  Users,
  UserPlus,
  Key,
  LogOut,
  FileText,
} from "lucide-react";

const navItems = {
  SUPERADMIN: [
    { label: "Dashboard", href: "/superadmin/dashboard", icon: Home },
    { label: "Clients", href: "/superadmin/clients", icon: Users },
    { label: "Partners", href: "/superadmin/partners", icon: UserPlus },
    { label: "Billing", href: "/superadmin/billing", icon: FileText },
    { label: "Keys", href: "/superadmin/keys", icon: Key },
  ],
  PARTNER: [
    { label: "Dashboard", href: "/partner/dashboard", icon: Home },
    { label: "Clients", href: "/partner/clients", icon: Users },
    { label: "Keys", href: "/partner/keys", icon: Key },
  ],
  SUPERADMIN_CLIENT: [
    { label: "Dashboard", href: "/client/dashboard", icon: Home },
    { label: "Keys", href: "/client/keys", icon: Key },
  ],
  PARTNER_CLIENT: [
    { label: "Dashboard", href: "/client/dashboard", icon: Home },
    { label: "Keys", href: "/client/keys", icon: Key },
  ],
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = navItems[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex flex-col items-center ">
                <img
                  src="/Cloudedata.svg"
                  alt="Cloudedata"
                  className="h-15 w-auto"
                />
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {items.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"}`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-center">
            <div className="flex flex-col items-center ">
              <img
                src="/Cloudedata.svg"
                alt="Cloudedata"
                className="h-15 w-auto"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 space-y-1 px-2">
              {items.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"}`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {items.find((item) => item.href === location.pathname)?.label ||
                  "Dashboard"}
              </h2>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative ml-3 flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  {user?.representativeName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// internal import
import Sidebar from "@components/user-dashboard/Sidebar";
import { getUserServerSession } from "@lib/auth-server";

export async function generateMetadata() {
  // You can fetch user info or page data here to make metadata dynamic
  const user = await getUserServerSession(); // Your own function to fetch user details
  return {
    title: `${user?.name || "User"} - Dashboard | Azli`,
    description: `Welcome back ${user?.name || "User"}!`,
  };
}

export default async function DashboardLayout({ children }) {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      {/* The children will now take up the full width of the container */}
      {children}
    </div>
  );
}

import Link from "next/link";
import AdminNavbarLinks from "@/app/ui/admin/AdminNavbarLinks";
import SportSphereLogo from "@/app/ui/sportsphere-logo";
import AdminSignout from "@/app/ui/admin/AdminSignout";

export default function AdminNavbar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-700 p-4 md:h-40"
        href="/admin/users"
      >
        <div className="w-32 text-white md:w-40">
          <SportSphereLogo />
          <div className="text-sm mt-2 font-semibold">Admin Panel</div>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <AdminNavbarLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <AdminSignout />
      </div>
    </div>
  );
}